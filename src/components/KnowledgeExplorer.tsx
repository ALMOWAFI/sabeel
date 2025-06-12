import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { KnowledgeNode, KnowledgeEdge, NodeType } from '../types/database';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { KnowledgeGraphService } from '../services/KnowledgeGraphService';
import { Database } from '../types/database';

// Constants for node and relationship types
const NODE_TYPES = ['concept', 'person', 'event', 'location', 'book', 'hadith', 'verse'] as const;
const RELATIONSHIP_TYPES = ['references', 'authored', 'occurred_at', 'related_to', 'part_of', 'cites'] as const;

type RelationshipType = typeof RELATIONSHIP_TYPES[number];

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Helper function to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

export function KnowledgeExplorer() {
  const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
  const [edges, setEdges] = useState<KnowledgeEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [connectedNodes, setConnectedNodes] = useState<KnowledgeNode[]>([]);
  const [suggestedNodes, setSuggestedNodes] = useState<KnowledgeNode[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [nodeType, setNodeType] = useState<NodeType>('concept');
  const [relationshipType, setRelationshipType] = useState<RelationshipType>('related_to');
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch nodes and edges in parallel
      const [nodesResponse, edgesResponse] = await Promise.all([
        supabase.from('knowledge_nodes').select('*'),
        supabase.from('knowledge_edges').select('*')
      ]);

      if (nodesResponse.error) throw nodesResponse.error;
      if (edgesResponse.error) throw edgesResponse.error;

      setNodes(nodesResponse.data || []);
      setEdges(edgesResponse.data || []);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('knowledge_nodes')
        .select('*');

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }
      
      if (nodeType && nodeType !== 'all') {
        query = query.eq('type', nodeType);
      }

      const { data, error: searchError } = await query;

      if (searchError) throw searchError;
      setNodes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCreateRelationship = async (sourceId: string, targetId: string, type: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('knowledge_edges')
        .insert([
          { 
            source_id: sourceId, 
            target_id: targetId, 
            type,
            created_by: (await supabase.auth.getUser()).data.user?.id || 'system'
          }
        ]);

      if (error) throw error;
      
      // Refresh the data
      await fetchData();
      
      // Update suggested nodes
      const newSuggestedNodes = suggestedNodes.filter(node => node.id !== targetId);
      setSuggestedNodes(newSuggestedNodes);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create relationship');
    } finally {
      setLoading(false);
    }
  };

  const getConnectedNodes = (nodeId: string): KnowledgeNode[] => {
    const connectedEdges = edges.filter(
      edge => edge.source_id === nodeId || edge.target_id === nodeId
    );

    return connectedEdges.map(edge => {
      const connectedNodeId = edge.source_id === nodeId ? edge.target_id : edge.source_id;
      return nodes.find(node => node.id === connectedNodeId) as KnowledgeNode;
    }).filter(Boolean) as KnowledgeNode[];
  };

  const syncWithMCP = async () => {
    try {
      setSyncing(true);
      setError(null);
      
      await KnowledgeGraphService.syncWithMCP();
      await fetchData();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Syncing failed');
    } finally {
      setSyncing(false);
    }
  };

  const handleNodeSelect = (node: KnowledgeNode) => {
    setSelectedNode(node);
    setConnectedNodes(getConnectedNodes(node.id));
    fetchSuggestedNodes(node.id);
  };

  const fetchSuggestedNodes = async (nodeId: string) => {
    try {
      // This is a placeholder - replace with actual MCP integration
      // For now, we'll just get some random nodes that aren't already connected
      const { data: allNodes } = await supabase
        .from('knowledge_nodes')
        .select('*')
        .neq('id', nodeId)
        .limit(5);
        
      if (allNodes) {
        const connectedIds = new Set(connectedNodes.map(n => n.id));
        const suggestions = allNodes.filter(node => !connectedIds.has(node.id));
        setSuggestedNodes(suggestions);
      }
    } catch (err) {
      console.error('Error fetching suggested nodes:', err);
    }
  };

  useEffect(() => {
    if (selectedNode) {
      const connected = getConnectedNodes(selectedNode.id);
      setConnectedNodes(connected);
      
      // Fetch suggested nodes when a node is selected
      fetchSuggestedNodes(selectedNode.id);
    } else {
      setConnectedNodes([]);
      setSuggestedNodes([]);
    }
  }, [selectedNode, edges]);

  if (loading && !syncing) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Knowledge Graph Explorer</h1>
      
      {/* Search and Filter */}
      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <Label htmlFor="search" className="sr-only">Search</Label>
            <Input
              id="search"
              placeholder="Search knowledge nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full"
            />
          </div>
          <Select value={nodeType} onValueChange={(value) => setNodeType(value as NodeType)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Node Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {NODE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? <span className="mr-2">Loading...</span> : 'Search'}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
          >
            {showAdvancedSearch ? 'Hide Advanced' : 'Advanced'}
          </Button>
        </div>

        {showAdvancedSearch && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/50">
            <div className="space-y-2">
              <Label>Relationship Type</Label>
              <Select
                value={relationshipType}
                onValueChange={(value) => setRelationshipType(value as RelationshipType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship type" />
                </SelectTrigger>
                <SelectContent>
                  {RELATIONSHIP_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Node Type</Label>
                <Select 
                  value={relationshipType} 
                  onValueChange={setRelationshipType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    {RELATIONSHIP_TYPES.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 flex items-end">
                <Button 
                  variant="outline" 
                  onClick={syncWithMCP}
                  disabled={syncing}
                  className="flex items-center gap-2"
                >
                  {syncing ? 'Syncing...' : 'Sync with MCP'}
                  {syncing && <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggested nodes */}
      {suggestedNodes.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-md">
          <h3 className="font-medium text-blue-800 mb-2">Suggested from Knowledge Graph:</h3>
          <div className="flex flex-wrap gap-2">
            {suggestedNodes.map(node => (
              <Badge 
                key={node.id} 
                variant="outline" 
                className="cursor-pointer hover:bg-blue-100"
                onClick={() => handleNodeSelect(node)}
              >
                {node.title}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Node List */}
        <div className="md:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Nodes ({nodes.length})</h2>
          <ScrollArea className="h-[600px] border rounded-md p-4">
            {nodes.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No nodes found. Try adjusting your search.
              </div>
            ) : (
              nodes.map((node) => (
                <div
                  key={node.id}
                  className={`p-3 mb-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                    selectedNode?.id === node.id ? 'bg-blue-50 border border-blue-200' : 'border'
                  }`}
                  onClick={() => handleNodeSelect(node)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{node.title}</h3>
                      <div className="flex items-center mt-1">
                        <Badge variant="outline" className="text-xs mr-2">
                          {node.type}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatDate(node.created_at)}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {getConnectedNodes(node.id).length} connections
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </div>

        {/* Node Details */}
        <div className="md:col-span-2 space-y-6">
          {selectedNode ? (
            <>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{selectedNode.title}</CardTitle>
                      <div className="flex items-center mt-1">
                        <Badge variant="outline" className="mr-2">
                          {selectedNode.type}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          Created: {formatDate(selectedNode.created_at)}
                        </span>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{selectedNode.title}</CardTitle>
                        <div className="flex items-center mt-1">
                          <Badge variant="outline" className="mr-2">
                            {selectedNode.type}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            Created: {formatDate(selectedNode.created_at)}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => console.log('Edit node')}
                      >
                        Edit
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {selectedNode.content && (
                      <div className="prose max-w-none mb-6">
                        <h3 className="text-lg font-medium mb-2">Content</h3>
                        <p className="whitespace-pre-line">{selectedNode.content}</p>
                      </div>
                    )}
                    {selectedNode.metadata && Object.keys(selectedNode.metadata).length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-lg font-medium mb-2">Metadata</h3>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <pre className="text-sm overflow-x-auto">
                            {JSON.stringify(selectedNode.metadata, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Connections</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-3">Connected Nodes ({connectedNodes.length})</h3>
                      {connectedNodes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {connectedNodes.map((node) => (
                            <div
                              key={node.id}
                              className="border p-3 rounded-md hover:bg-gray-50 cursor-pointer"
                              onClick={() => handleNodeSelect(node)}
                            >
                              <h4 className="font-medium">{node.title}</h4>
                              <div className="flex items-center mt-1">
                                <Badge variant="outline" className="text-xs mr-2">
                                  {node.type}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No connected nodes found.</p>
                      )}
                    </div>

                    {suggestedNodes.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-3">Suggested Connections</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {suggestedNodes.map((node) => (
                            <div
                              key={node.id}
                              className="border p-3 rounded-md bg-blue-50 border-blue-100"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{node.title}</h4>
                                  <div className="flex items-center mt-1">
                                    <Badge variant="outline" className="text-xs mr-2">
                                      {node.type}
                                    </Badge>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => handleCreateRelationship(selectedNode.id, node.id, relationshipType)}
                                >
                                  Connect
                                </Button>
                              </div>
                            </div>
                          ))}
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => addRelationship(node)}
                          >
                            Connect
                          </Button>
                        </div>
                        {node.content && (
                          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                            {node.content}
                          </p>
                        )}
                      </Card>
                    ))}
                  </div>
                  
                  {getConnectedNodes(selectedNode.id).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No direct connections found</p>
                      <p className="text-sm mt-1">
                        Use the search to find and connect related knowledge
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-gray-50 p-6 rounded-lg inline-block">
                    <h3 className="font-medium text-gray-700">Knowledge Graph Explorer</h3>
                    <p className="text-sm text-gray-500 mt-2 max-w-md">
                      Select a node from the left to explore its connections in the knowledge graph.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}