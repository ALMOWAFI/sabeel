# Knowledge Graph Best Practices

## Table of Contents
- [Data Model](#data-model)
- [Common Operations](#common-operations)
- [Performance Considerations](#performance-considerations)
- [Security Best Practices](#security-best-practices)
- [Integration Patterns](#integration-patterns)
- [Code Examples](#code-examples)

## Data Model

### Nodes
**Types:** `concept`, `person`, `event`, `location`, `book`, `hadith`, `verse`

**Required Fields:**
- `id`: Unique identifier (UUID)
- `title`: Human-readable name
- `type`: One of the node types
- `created_at`: Timestamp
- `created_by`: User ID

### Relationships
**Types:** `references`, `authored`, `occurred_at`, `related_to`, `part_of`, `cites`

**Properties:**
- `source_id`: Source node ID
- `target_id`: Target node ID
- `type`: Relationship type
- `created_at`: Timestamp
- `created_by`: User ID

## Common Operations

### Creating Nodes
```typescript
const { data: newNode, error } = await supabase
  .from('knowledge_nodes')
  .insert([{
    title: 'Node Title',
    type: 'concept',
    content: 'Detailed content...',
    metadata: { /* optional */ }
  }])
  .select();
```

### Creating Relationships
```typescript
const { error } = await supabase
  .from('knowledge_edges')
  .insert([{
    source_id: 'source-node-uuid',
    target_id: 'target-node-uuid',
    type: 'related_to'
  }]);
```

### Querying Connected Nodes
```typescript
// Get all nodes connected to a specific node
const { data: edges } = await supabase
  .from('knowledge_edges')
  .select('*')
  .or(`source_id.eq.${nodeId},target_id.eq.${nodeId}`);

const connectedNodeIds = edges.map(edge => 
  edge.source_id === nodeId ? edge.target_id : edge.source_id
);

const { data: connectedNodes } = await supabase
  .from('knowledge_nodes')
  .select('*')
  .in('id', connectedNodeIds);
```

## Performance Considerations

### Indexing
- Ensure proper indexes on `source_id`, `target_id`, and `type` in the edges table
- Add indexes on frequently queried fields in the nodes table

### Query Optimization
- Use `select()` to fetch only needed fields
- Implement pagination for large result sets
- Consider materialized views for complex queries

### Caching
- Implement client-side caching for frequently accessed nodes
- Use Supabase's real-time subscriptions for live updates

## Security Best Practices

### Row Level Security (RLS)
- Enable RLS on all knowledge graph tables
- Create policies to restrict access based on user roles

### Input Validation
- Validate all user inputs before database operations
- Use TypeScript types to enforce data shapes

### Rate Limiting
- Implement rate limiting for API endpoints
- Consider query complexity limits

## Integration Patterns

### React Hook for Graph Data
```typescript
function useKnowledgeGraph(nodeId?: string) {
  const [data, setData] = useState<{
    node?: KnowledgeNode;
    connectedNodes: KnowledgeNode[];
    loading: boolean;
    error: Error | null;
  }>({ connectedNodes: [], loading: false, error: null });

  useEffect(() => {
    if (!nodeId) return;
    
    const fetchData = async () => {
      setData(prev => ({ ...prev, loading: true }));
      try {
        // Fetch node and connected nodes
        // Update state
      } catch (error) {
        setData(prev => ({ ...prev, error }));
      } finally {
        setData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchData();
  }, [nodeId]);

  return data;
}
```

### Real-time Updates
```typescript
// Subscribe to node changes
const subscription = supabase
  .channel('node-changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'knowledge_nodes'
  }, (payload) => {
    // Handle node changes
    console.log('Node changed:', payload);
  })
  .subscribe();
```

## Code Examples

### Creating a New Node with Relationships
```typescript
const createNodeWithRelationships = async (
  nodeData: Omit<KnowledgeNode, 'id'>, 
  relatedNodeIds: string[]
) => {
  const { data: node, error: nodeError } = await supabase
    .from('knowledge_nodes')
    .insert([nodeData])
    .select()
    .single();

  if (nodeError) throw nodeError;

  const relationships = relatedNodeIds.map(targetId => ({
    source_id: node.id,
    target_id: targetId,
    type: 'related_to' as const,
    created_by: userId
  }));

  const { error: relError } = await supabase
    .from('knowledge_edges')
    .insert(relationships);

  if (relError) {
    // Consider transaction rollback
    console.error('Failed to create relationships:', relError);
  }

  return node;
};
```

### Batch Operations
```typescript
const batchCreateNodes = async (nodes: Omit<KnowledgeNode, 'id'>[]) => {
  const { data, error } = await supabase
    .from('knowledge_nodes')
    .insert(nodes)
    .select();
  
  if (error) throw error;
  return data;
};
```

## Best Practices Summary

- **Consistent Naming**: Use clear, consistent naming for nodes and relationships
- **Type Safety**: Leverage TypeScript for type safety
- **Error Handling**: Implement comprehensive error handling
- **Documentation**: Document node types and relationship meanings
- **Testing**: Write tests for critical graph operations
- **Backup**: Regularly backup your knowledge graph
- **Monitoring**: Monitor query performance and resource usage

## Islamic Knowledge Graph Specific Guidelines

### Node Types for Islamic Content
- **`verse`**: Quranic verses and chapters
- **`hadith`**: Prophetic traditions and sayings
- **`person`**: Prophets, scholars, historical figures
- **`concept`**: Islamic theological and jurisprudential concepts
- **`event`**: Historical events in Islamic history
- **`location`**: Sacred places and historically significant locations
- **`book`**: Islamic texts, commentaries, and scholarly works

### Relationship Types for Islamic Content
- **`references`**: When a text references another
- **`authored`**: Author-to-work relationships
- **`occurred_at`**: Event-to-location relationships
- **`part_of`**: Chapter-to-book, verse-to-chapter relationships
- **`cites`**: Citation relationships between scholarly works
- **`related_to`**: General conceptual relationships

### Metadata Standards
```typescript
// Example metadata for different node types
const verseMetadata = {
  chapter: number,
  verse_number: number,
  revelation_type: 'Meccan' | 'Medinan',
  arabic_text: string,
  translation: string
};

const hadithMetadata = {
  collection: string,
  book: string,
  hadith_number: string,
  narrator_chain: string[],
  authenticity_grade: string
};

const personMetadata = {
  birth_year: number,
  death_year: number,
  birth_place: string,
  school_of_thought: string,
  contributions: string[]
};
```

---

This documentation provides the foundation for building and maintaining a robust Islamic knowledge graph within the Sabeel platform. 