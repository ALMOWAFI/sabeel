import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export function SupabaseTest() {
  const [nodes, setNodes] = useState<Database['public']['Tables']['knowledge_nodes']['Row'][]>([]);
  const [edges, setEdges] = useState<Database['public']['Tables']['knowledge_edges']['Row'][]>([]);
  const [offlineContent, setOfflineContent] = useState<Database['public']['Tables']['offline_content']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Test data
  const testNode = {
    title: 'Test Node',
    content: 'This is a test node',
    type: 'concept' as const,
    metadata: { test: true }
  };

  const testEdge = {
    source_id: '',
    target_id: '',
    relationship_type: 'references' as const,
    metadata: { test: true }
  };

  const testOfflineContent = {
    user_id: '',
    content_type: 'article' as const,
    title: 'Test Article',
    content: 'This is a test article',
    metadata: { test: true }
  };

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
        .select('*')
        .limit(5);

      if (nodesError) throw nodesError;
      setNodes(nodesData || []);

      // Fetch edges
      const { data: edgesData, error: edgesError } = await supabase
        .from('knowledge_edges')
        .select('*')
        .limit(5);

      if (edgesError) throw edgesError;
      setEdges(edgesData || []);

      // Fetch offline content
      const { data: contentData, error: contentError } = await supabase
        .from('offline_content')
        .select('*')
        .limit(5);

      if (contentError) throw contentError;
      setOfflineContent(contentData || []);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNode = async () => {
    try {
      const { data, error } = await supabase
        .from('knowledge_nodes')
        .insert(testNode)
        .select()
        .single();

      if (error) throw error;
      setNodes(prev => [...prev, data]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create node');
    }
  };

  const handleCreateEdge = async () => {
    if (nodes.length < 2) {
      setError('Need at least 2 nodes to create an edge');
      return;
    }

    try {
      const edge = {
        ...testEdge,
        source_id: nodes[0].id,
        target_id: nodes[1].id
      };

      const { data, error } = await supabase
        .from('knowledge_edges')
        .insert(edge)
        .select()
        .single();

      if (error) throw error;
      setEdges(prev => [...prev, data]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create edge');
    }
  };

  const handleCreateOfflineContent = async () => {
    try {
      const { data, error } = await supabase
        .from('offline_content')
        .insert(testOfflineContent)
        .select()
        .single();

      if (error) throw error;
      setOfflineContent(prev => [...prev, data]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create offline content');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Supabase Table Tests</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Knowledge Nodes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={handleCreateNode}>Create Test Node</Button>
              <div className="space-y-2">
                {nodes.map(node => (
                  <div key={node.id} className="p-2 border rounded">
                    <p className="font-semibold">{node.title}</p>
                    <p className="text-sm text-gray-500">{node.type}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Knowledge Edges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={handleCreateEdge}>Create Test Edge</Button>
              <div className="space-y-2">
                {edges.map(edge => (
                  <div key={edge.id} className="p-2 border rounded">
                    <p className="text-sm">
                      {edge.source_id} → {edge.target_id}
                    </p>
                    <p className="text-xs text-gray-500">{edge.relationship_type}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Offline Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={handleCreateOfflineContent}>Create Test Content</Button>
              <div className="space-y-2">
                {offlineContent.map(content => (
                  <div key={content.id} className="p-2 border rounded">
                    <p className="font-semibold">{content.title}</p>
                    <p className="text-sm text-gray-500">{content.content_type}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 