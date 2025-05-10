/**
 * AIEnhancedKnowledgeExplorer.tsx
 * 
 * An AI-enhanced version of the knowledge explorer that uses TensorFlow.js
 * to provide intelligent features like relationship discovery, content 
 * recommendations, and semantic text analysis.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import {
  Search,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Brain,
  Network,
  Text,
  BookOpen,
  Lightbulb,
  ChevronRight,
  MessageSquare
} from "lucide-react";

// Import the IslamicKnowledgeGraph component from our Kingraph integration
import IslamicKnowledgeGraph from '../../integration/kingraph/src/IslamicKnowledgeGraph';

// Import our TensorFlow hook
import useTensorflow from '@/hooks/useTensorflow';

// Mock data for initial graph
import scholarNetwork from '../../integration/kingraph/examples/islamic_scholars_network.json';

const AIEnhancedKnowledgeExplorer: React.FC = () => {
  // Refs
  const graphContainerRef = useRef<HTMLDivElement>(null);
  
  // States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("graph");
  const [textForAnalysis, setTextForAnalysis] = useState("");
  const [graphData, setGraphData] = useState(scholarNetwork);
  const [enhancedGraph, setEnhancedGraph] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [textAnalysisResult, setTextAnalysisResult] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  
  // Get TensorFlow.js capabilities through our custom hook
  const {
    initialized: tfInitialized,
    loading: tfLoading,
    error: tfError,
    analyzeIslamicText,
    enhanceKnowledgeGraph
  } = useTensorflow({ initializeOnMount: true });
  
  // Handle node selection
  const handleNodeClick = (nodeData: any) => {
    setSelectedNode(nodeData);
  };
  
  // Enhance the knowledge graph with AI
  const handleEnhanceGraph = async () => {
    try {
      if (!graphData) return;
      
      const enhancementResult = await enhanceKnowledgeGraph(graphData);
      
      // Create an enhanced version of the graph with AI suggestions
      const enhancedData = {
        ...graphData,
        nodes: [
          ...graphData.nodes,
          ...enhancementResult.suggestedNodes.map((node) => ({
            id: node.id,
            label: node.label,
            type: node.type,
            group: node.type,
            size: 15,
            ai_generated: true,
            confidence: node.confidence
          }))
        ],
        links: [
          ...graphData.links,
          ...enhancementResult.suggestedEdges.map((edge) => ({
            source: edge.source,
            target: edge.target,
            value: 1,
            type: edge.type,
            ai_generated: true,
            confidence: edge.confidence
          }))
        ]
      };
      
      setEnhancedGraph(enhancedData);
    } catch (error) {
      console.error('Error enhancing graph:', error);
    }
  };
  
  // Analyze Islamic text
  const handleAnalyzeText = async () => {
    if (!textForAnalysis.trim()) return;
    
    try {
      const result = await analyzeIslamicText(textForAnalysis);
      setTextAnalysisResult(result);
    } catch (error) {
      console.error('Error analyzing text:', error);
    }
  };
  
  // Reset to original graph
  const handleResetGraph = () => {
    setEnhancedGraph(null);
  };
  
  // Text analysis tab content
  const renderTextAnalysisTab = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="textAnalysis" className="text-sm font-medium text-right block">
          أدخل نصًا إسلاميًا للتحليل
        </label>
        <Textarea
          id="textAnalysis"
          placeholder="أدخل آية قرآنية، حديثًا شريفًا، أو نصًا من كتاب إسلامي..."
          className="min-h-32 text-right"
          dir="rtl"
          value={textForAnalysis}
          onChange={(e) => setTextForAnalysis(e.target.value)}
        />
        <Button 
          onClick={handleAnalyzeText}
          disabled={tfLoading || !textForAnalysis.trim()}
          className="w-full"
        >
          {tfLoading ? <Spinner className="mr-2 h-4 w-4" /> : <Text className="mr-2 h-4 w-4" />}
          تحليل النص
        </Button>
      </div>
      
      {textAnalysisResult && (
        <Card>
          <CardHeader>
            <CardTitle className="text-right">نتائج تحليل النص</CardTitle>
            <CardDescription className="text-right">تحليل مدعوم بتقنية الذكاء الاصطناعي</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-72">
              <div className="space-y-4">
                {/* Topics */}
                <div>
                  <h4 className="text-sm font-medium text-right mb-2">المواضيع:</h4>
                  <div className="flex flex-wrap gap-2 justify-end">
                    {textAnalysisResult.topics.map((topic: any, index: number) => (
                      <Badge key={index} variant="outline">
                        {topic.name} ({Math.round(topic.score * 100)}%)
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Sentiment */}
                <div>
                  <h4 className="text-sm font-medium text-right mb-2">المشاعر في النص:</h4>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-md bg-green-100 dark:bg-green-900/20">
                      <div className="text-xs text-green-800 dark:text-green-300">إيجابي</div>
                      <div className="text-sm font-medium">{Math.round(textAnalysisResult.sentiment.positive * 100)}%</div>
                    </div>
                    <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900/20">
                      <div className="text-xs text-blue-800 dark:text-blue-300">محايد</div>
                      <div className="text-sm font-medium">{Math.round(textAnalysisResult.sentiment.neutral * 100)}%</div>
                    </div>
                    <div className="p-2 rounded-md bg-red-100 dark:bg-red-900/20">
                      <div className="text-xs text-red-800 dark:text-red-300">سلبي</div>
                      <div className="text-sm font-medium">{Math.round(textAnalysisResult.sentiment.negative * 100)}%</div>
                    </div>
                  </div>
                </div>
                
                {/* Summary */}
                <div>
                  <h4 className="text-sm font-medium text-right mb-2">ملخص التحليل:</h4>
                  <p className="text-sm text-right">{textAnalysisResult.summary}</p>
                </div>
                
                {/* Entities */}
                {textAnalysisResult.entities && textAnalysisResult.entities.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-right mb-2">الكيانات المذكورة:</h4>
                    <div className="space-y-2">
                      {textAnalysisResult.entities.map((entity: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <Badge variant="outline">{entity.type}</Badge>
                          <span className="text-sm">{entity.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
  
  // Knowledge graph tab content
  const renderKnowledgeGraphTab = () => (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
        <div className="w-full md:w-auto md:flex-1">
          <Input
            placeholder="البحث في شبكة المعرفة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-right"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" title="تكبير">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" title="تصغير">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" title="إعادة تعيين">
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button 
            onClick={enhancedGraph ? handleResetGraph : handleEnhanceGraph}
            disabled={tfLoading}
            variant={enhancedGraph ? "secondary" : "default"}
          >
            {enhancedGraph ? "إعادة تعيين" : "تعزيز بالذكاء الاصطناعي"}
            {tfLoading ? <Spinner className="mr-2 h-4 w-4" /> : <Brain className="mr-2 h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <div ref={graphContainerRef} className="w-full h-[600px] bg-white dark:bg-gray-950 rounded-lg border">
            <IslamicKnowledgeGraph 
              data={enhancedGraph || graphData}
              height="600px"
              width="100%"
              theme="light"
              onNodeClick={handleNodeClick}
              showControls={true}
              enableSearch={true}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Node details panel */}
          {selectedNode ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-right">{selectedNode.label}</CardTitle>
                <CardDescription className="text-right">
                  <Badge variant={selectedNode.ai_generated ? "secondary" : "outline"}>
                    {selectedNode.type || selectedNode.group}
                    {selectedNode.ai_generated && " (مقترح من الذكاء الاصطناعي)"}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-right">
                  <p className="text-sm">
                    {selectedNode.description || "لا يوجد وصف متاح."}
                  </p>
                  {selectedNode.ai_generated && (
                    <p className="text-sm text-muted-foreground">
                      نسبة الثقة: {Math.round((selectedNode.confidence || 0.5) * 100)}%
                    </p>
                  )}
                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full">
                      عرض تفاصيل كاملة
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-right">شبكة المعرفة الإسلامية</CardTitle>
                <CardDescription className="text-right">
                  اضغط على أي عنصر لعرض التفاصيل
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-right">
                  <p className="text-sm">
                    تعرض شبكة المعرفة الإسلامية العلاقات بين العلماء والكتب والمفاهيم الإسلامية.
                    يمكنك التفاعل مع الشبكة وتعزيزها باستخدام الذكاء الاصطناعي لاكتشاف علاقات جديدة.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* AI explanation panel */}
          {enhancedGraph && (
            <Card>
              <CardHeader>
                <CardTitle className="text-right">
                  <div className="flex items-center justify-end">
                    <span>تعزيز الذكاء الاصطناعي</span>
                    <Brain className="ml-2 h-4 w-4" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-right">
                  <p className="text-sm">
                    قام نظام الذكاء الاصطناعي بإضافة {enhancedGraph.nodes.filter((n: any) => n.ai_generated).length} عناصر و{enhancedGraph.links.filter((l: any) => l.ai_generated).length} علاقات جديدة بناءً على تحليل أنماط المعرفة الإسلامية.
                  </p>
                  <div className="flex justify-end gap-2 pt-2">
                    <Badge variant="outline">عناصر جديدة</Badge>
                    <Badge variant="outline">علاقات مكتشفة</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="container mx-auto py-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            <h2 className="text-2xl font-bold">مستكشف المعرفة الإسلامية المعزز بالذكاء الاصطناعي</h2>
          </div>
        </div>
        
        {tfError && (
          <Alert variant="destructive">
            <AlertTitle>خطأ في تحميل نظام الذكاء الاصطناعي</AlertTitle>
            <AlertDescription>
              تعذر تهيئة خدمة تحليل النصوص. يرجى المحاولة مرة أخرى لاحقًا.
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="graph" value={selectedTab} onValueChange={setSelectedTab}>
          <div className="flex justify-center">
            <TabsList>
              <TabsTrigger value="graph" className="flex gap-1">
                <Network className="h-4 w-4" />
                <span>شبكة المعرفة</span>
              </TabsTrigger>
              <TabsTrigger value="textAnalysis" className="flex gap-1">
                <BookOpen className="h-4 w-4" />
                <span>تحليل النصوص</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="graph" className="mt-4">
            {renderKnowledgeGraphTab()}
          </TabsContent>
          
          <TabsContent value="textAnalysis" className="mt-4">
            {renderTextAnalysisTab()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AIEnhancedKnowledgeExplorer;
