import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

type NodeType = Database['public']['Tables']['knowledge_nodes']['Row']['type'];
type RelationshipType = Database['public']['Tables']['knowledge_edges']['Row']['relationship_type'];

export function KnowledgeExplorer() {
  const [nodes, setNodes] = useState<Database['public']['Tables']['knowledge_nodes']['Row'][]>([]);
  const [edges, setEdges] = useState<Database['public']['Tables']['knowledge_edges']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [nodeType, setNodeType] = useState<NodeType>('concept');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch nodes
      const { data: nodesData, error: nodesError } = await supabase
        .from('knowledge_nodes')
        .select('*');

      if (nodesError) throw nodesError;
      setNodes(nodesData || []);

      // Fetch edges
      const { data: edgesData, error: edgesError } = await supabase
        .from('knowledge_edges')
        .select('*');

      if (edgesError) throw edgesError;
      setEdges(edgesData || []);

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

      const { data, error } = await supabase
        .from('knowledge_nodes')
        .select('*')
        .ilike('title', `%${searchQuery}%`)
        .eq('type', nodeType);

      if (error) throw error;
      setNodes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const getConnectedNodes = (nodeId: string) => {
    const connectedEdges = edges.filter(
      edge => edge.source_id === nodeId || edge.target_id === nodeId
    );

    return connectedEdges.map(edge => {
      const connectedNodeId = edge.source_id === nodeId ? edge.target_id : edge.source_id;
      return nodes.find(node => node.id === connectedNodeId);
    }).filter(Boolean);
  };

  if (loading) return <div className="flex justify-center p-8"><Spinner /></div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search knowledge nodes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:w-1/3"
        />
        <Select value={nodeType} onValueChange={(value: NodeType) => setNodeType(value)}>
          <SelectTrigger className="md:w-1/4">
            <SelectValue placeholder="Select node type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="concept">Concept</SelectItem>
            <SelectItem value="person">Person</SelectItem>
            <SelectItem value="event">Event</SelectItem>
            <SelectItem value="location">Location</SelectItem>
            <SelectItem value="book">Book</SelectItem>
            <SelectItem value="hadith">Hadith</SelectItem>
            <SelectItem value="verse">Verse</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleSearch}>Search</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Knowledge Nodes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nodes.map(node => (
                <div
                  key={node.id}
                  className={`p-4 border rounded cursor-pointer transition-colors ${
                    selectedNode === node.id ? 'bg-primary/10' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedNode(node.id)}
                >
                  <h3 className="font-semibold">{node.title}</h3>
                  <p className="text-sm text-gray-500">{node.type}</p>
                  {node.content && (
                    <p className="mt-2 text-sm">{node.content}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Connected Nodes</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedNode ? (
              <div className="space-y-4">
                {getConnectedNodes(selectedNode).map(node => (
                  <div key={node?.id} className="p-4 border rounded">
                    <h3 className="font-semibold">{node?.title}</h3>
                    <p className="text-sm text-gray-500">{node?.type}</p>
                    {node?.content && (
                      <p className="mt-2 text-sm">{node.content}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Select a node to view connections</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 