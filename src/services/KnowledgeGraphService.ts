import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

export class KnowledgeGraphService {
  private supabase;
  private memoryMCP: any;

  constructor() {
    this.supabase = createClient<Database>(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
  }

  // Initialize Memory MCP connection
  async initialize() {
    try {
      // Initialize Memory MCP connection
      // This would be replaced with actual MCP initialization
      this.memoryMCP = {};
      return { success: true };
    } catch (error) {
      console.error('Failed to initialize KnowledgeGraphService:', error);
      return { success: false, error };
    }
  }

  // Sync Supabase knowledge nodes with Memory MCP
  async syncWithMemoryMCP() {
    try {
      // Fetch all knowledge nodes and edges from Supabase
      const { data: nodes, error: nodesError } = await this.supabase
        .from('knowledge_nodes')
        .select('*');
      
      if (nodesError) throw nodesError;

      const { data: edges, error: edgesError } = await this.supabase
        .from('knowledge_edges')
        .select('*');
      
      if (edgesError) throw edgesError;

      // Sync nodes to Memory MCP
      const nodeSyncResults = await Promise.all(
        nodes.map(async (node) => {
          return this.syncNodeToMCP(node);
        })
      );

      // Sync edges to Memory MCP
      const edgeSyncResults = await Promise.all(
        edges.map(async (edge) => {
          return this.syncEdgeToMCP(edge);
        })
      );

      return {
        success: true,
        nodesSynced: nodeSyncResults.filter(r => r.success).length,
        edgesSynced: edgeSyncResults.filter(r => r.success).length,
      };
    } catch (error) {
      console.error('Failed to sync with Memory MCP:', error);
      return { success: false, error };
    }
  }

  // Sync a single node to Memory MCP
  private async syncNodeToMCP(node: Database['public']['Tables']['knowledge_nodes']['Row']) {
    try {
      // Create or update node in Memory MCP
      const nodeData = {
        id: node.id,
        title: node.title,
        type: node.type,
        content: node.content,
        metadata: node.metadata,
        created_at: node.created_at,
        updated_at: node.updated_at,
      };

      // This would be replaced with actual MCP node creation/update
      await this.memoryMCP?.createOrUpdateNode?.(nodeData);
      
      return { success: true, nodeId: node.id };
    } catch (error) {
      console.error(`Failed to sync node ${node.id} to MCP:`, error);
      return { success: false, error, nodeId: node.id };
    }
  }

  // Sync a single edge to Memory MCP
  private async syncEdgeToMCP(edge: Database['public']['Tables']['knowledge_edges']['Row']) {
    try {
      // Create or update edge in Memory MCP
      const edgeData = {
        id: edge.id,
        sourceId: edge.source_id,
        targetId: edge.target_id,
        type: edge.relationship_type,
        metadata: edge.metadata,
        created_at: edge.created_at,
        updated_at: edge.updated_at,
      };

      // This would be replaced with actual MCP edge creation/update
      await this.memoryMCP?.createOrUpdateEdge?.(edgeData);
      
      return { success: true, edgeId: edge.id };
    } catch (error) {
      console.error(`Failed to sync edge ${edge.id} to MCP:`, error);
      return { success: false, error, edgeId: edge.id };
    }
  }

  // Enhanced search using Memory MCP
  async enhancedSearch(query: string, filters: {
    types?: string[],
    minRelevance?: number,
    limit?: number
  } = {}) {
    try {
      // First try MCP search if available
      if (this.memoryMCP?.search) {
        const mcpResults = await this.memoryMCP.search({
          query,
          types: filters.types,
          minRelevance: filters.minRelevance || 0.5,
          limit: filters.limit || 10,
        });

        if (mcpResults?.length > 0) {
          return { success: true, data: mcpResults, source: 'mcp' };
        }
      }


      // Fallback to Supabase search if MCP is not available or returns no results
      const { data, error } = await this.supabase
        .from('knowledge_nodes')
        .select('*')
        .ilike('title', `%${query}%`)
        .in('type', filters.types || ['concept', 'person', 'event', 'book'])
        .limit(filters.limit || 10);

      if (error) throw error;

      return { success: true, data, source: 'supabase' };
    } catch (error) {
      console.error('Search failed:', error);
      return { success: false, error };
    }
  }

  // Get related nodes with context from Memory MCP
  async getRelatedNodes(nodeId: string, options: {
    relationshipTypes?: string[],
    limit?: number,
    includePath?: boolean
  } = {}) {
    try {
      // Try to get enriched relationships from MCP
      if (this.memoryMCP?.getRelatedNodes) {
        const mcpResults = await this.memoryMCP.getRelatedNodes({
          nodeId,
          relationshipTypes: options.relationshipTypes,
          limit: options.limit || 10,
          includePath: options.includePath || false,
        });

        if (mcpResults?.length > 0) {
          return { success: true, data: mcpResults, source: 'mcp' };
        }
      }


      // Fallback to basic Supabase query
      const { data: edges, error: edgesError } = await this.supabase
        .from('knowledge_edges')
        .select('*')
        .or(`source_id.eq.${nodeId},target_id.eq.${nodeId}`);

      if (edgesError) throw edgesError;

      const relatedNodeIds = edges.map(edge => 
        edge.source_id === nodeId ? edge.target_id : edge.source_id
      );

      const { data: nodes, error: nodesError } = await this.supabase
        .from('knowledge_nodes')
        .select('*')
        .in('id', relatedNodeIds)
        .limit(options.limit || 10);

      if (nodesError) throw nodesError;

      return { 
        success: true, 
        data: nodes.map(node => ({
          ...node,
          relationship: edges.find(e => 
            e.source_id === node.id || e.target_id === node.id
          )?.relationship_type
        })),
        source: 'supabase' 
      };
    } catch (error) {
      console.error('Failed to get related nodes:', error);
      return { success: false, error };
    }
  }

  // Add a new knowledge node with MCP sync
  async addNode(nodeData: {
    title: string;
    content?: string;
    type: string;
    metadata?: Record<string, any>;
  }) {
    const { data, error } = await this.supabase
      .from('knowledge_nodes')
      .insert([{
        ...nodeData,
        metadata: nodeData.metadata || {}
      }])
      .select()
      .single();

    if (error) return { success: false, error };

    // Sync to MCP
    if (this.memoryMCP) {
      await this.syncNodeToMCP(data);
    }

    return { success: true, data };
  }

  // Add a new relationship with MCP sync
  async addRelationship(edgeData: {
    source_id: string;
    target_id: string;
    relationship_type: string;
    metadata?: Record<string, any>;
  }) {
    const { data, error } = await this.supabase
      .from('knowledge_edges')
      .insert([{
        ...edgeData,
        metadata: edgeData.metadata || {}
      }])
      .select()
      .single();

    if (error) return { success: false, error };

    // Sync to MCP
    if (this.memoryMCP) {
      await this.syncEdgeToMCP(data);
    }

    return { success: true, data };
  }
}

// Singleton instance
export const knowledgeGraphService = new KnowledgeGraphService();

// Initialize the service when imported
knowledgeGraphService.initialize().catch(console.error);
