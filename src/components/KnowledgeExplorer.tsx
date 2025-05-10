import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import ErrorBoundary from './ErrorBoundary';
import NodeDetailPanel from './NodeDetailPanel';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { API_ENDPOINTS } from "@/lib/config";
import {
  Search,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Filter,
  Plus,
  Minus,
  BookOpen,
  Save,
  Download,
  Share2,
  Info,
  AlertCircle,
  X
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";

// Import from Islamic Knowledge System
import { mockKnowledgeGraph } from '@/data/mockKnowledgeGraph';
import { ForceGraphMethods as ForceGraph2DMethods, GraphData, LinkObject, NodeObject } from 'react-force-graph-2d';
import { ForceGraphMethods as ForceGraph3DMethods } from 'react-force-graph-3d';
import type { KnowledgeNode, KnowledgeLink } from '@/data/mockKnowledgeGraph';

const LazyForceGraph2D = lazy(() => import('react-force-graph-2d'));
const LazyForceGraph3D = lazy(() => import('react-force-graph-3d'));

const KnowledgeExplorer: React.FC = () => {
  const { toast } = useToast();
  const graphContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'2d' | '3d'>("3d");
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [era, setEra] = useState<[number, number]>([1000, 1500]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [expandLevel, setExpandLevel] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [selectedNode, setSelectedNode] = useState<NodeObject | null>(null);
  const [isGraphInitialized, setIsGraphInitialized] = useState(false);
  const graphInstanceRef = useRef<ForceGraph2DMethods | ForceGraph3DMethods | undefined>();

  // Set client-side rendering flag
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Handle 3D visualization loading errors
  const handle3DLoadError = () => {
    setError('Failed to load 3D visualization components');
    setViewMode('2d');
    toast({
      variant: "warning",
      title: "تم التبديل إلى العرض ثنائي الأبعاد",
      description: "تعذر تحميل مكونات العرض ثلاثي الأبعاد. تم التبديل تلقائيًا إلى العرض ثنائي الأبعاد."
    });
  };


  // Effect to check window size for responsive control panel
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkIsDesktop(); // Initial check
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  const categories = [
    'الفقه',
    'العقيدة',
    'التفسير',
    'الحديث',
    'السيرة',
    'التصوف',
    'الفلسفة',
    'اللغة العربية',
    'المذاهب الفقهية'
  ];

  // Load and prepare graph data
  useEffect(() => {
    const loadGraphData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Transform mockKnowledgeGraph data to GraphData format
        const nodes = mockKnowledgeGraph.nodes.map(node => ({
          ...node,
          id: node.id,
          name: node.name,
          val: node.val || 15,
          color: getNodeColor(node.group),
          // Apply category and era filters
          hidden: (categoryFilters.length > 0 && !categoryFilters.includes(node.group)) ||
                 (node.era && !isInEraRange(node.era, era))
        }));
        
        const links = mockKnowledgeGraph.links
          .filter(link => {
            // Only include links where both source and target nodes are visible
            const sourceNode = nodes.find(n => n.id === link.source);
            const targetNode = nodes.find(n => n.id === link.target);
            return sourceNode && !sourceNode.hidden && targetNode && !targetNode.hidden;
          })
          .map(link => ({
            ...link,
            value: link.value
          }));
        
        setGraphData({ nodes, links });
        setIsGraphInitialized(true);
      } catch (err: any) {
        console.error('Error loading knowledge graph:', err);
        setError(err.message || 'Failed to load knowledge graph');
        toast({
          variant: "destructive",
          title: "خطأ في تحميل الرسم البياني",
          description: "حدث خطأ أثناء تحميل بيانات الرسم البياني. يرجى المحاولة مرة أخرى."
        });
      } finally {
        setLoading(false);
        // Initialize canvas fallback if in 2D mode or if 3D fails
        if (viewMode === '2d' || error) {
          initializeGraph();
        }
      }
    };
    
    // Only load graph data on the client side
    if (isClient) {
      loadGraphData();
    }
    
    return () => {
      // Cleanup any graph instance
      if (graphInstanceRef.current) {
        // @ts-ignore - Force Graph doesn't have a clear dispose method in types
        if (typeof graphInstanceRef.current.dispose === 'function') {
          // @ts-ignore
          graphInstanceRef.current.dispose();
        }
      }
    };
  }, [viewMode, expandLevel, categoryFilters, era, toast, error, isClient]);
  
  // Helper function to determine if a node's era is within the selected range
  const isInEraRange = (eraString: string, selectedRange: [number, number]): boolean => {
    // Parse era string (e.g., "700-774 هـ" or "164-241 هـ")
    const match = eraString.match(/(\d+)-(\d+|حتى الآن)/);
    if (!match) return true; // If can't parse, include by default
    
    const startYear = parseInt(match[1]);
    const endYear = match[2] === "حتى الآن" ? new Date().getFullYear() : parseInt(match[2]);
    
    // Check if there's any overlap with the selected range
    return !(endYear < selectedRange[0] || startYear > selectedRange[1]);
  };
  
  // Helper function to get node color based on group
  const getNodeColor = (group: string): string => {
    const colorMap: Record<string, string> = {
      core: '#1e40af',      // Deep blue
      primary: '#8b5cf6',   // Purple
      madhab: '#f59e0b',    // Amber
      scholar: '#ef4444',   // Red
      hadith_collection: '#3b82f6', // Blue
      tafsir_work: '#10b981', // Green
      quran_science: '#6366f1', // Indigo
    };
    
    return colorMap[group] || '#6b7280'; // Default gray
  };

  // Initialize the 3D graph visualization
  const initializeGraph = () => {
    if (!canvasRef.current || !graphContainerRef.current) return;
    
    const canvas = canvasRef.current;
    const container = graphContainerRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Center of the canvas
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Draw nodes and connections (simplified representation)
    drawKnowledgeGraph(ctx, centerX, centerY);
    
    // Add canvas interaction
    canvas.onclick = handleCanvasClick;
  };
  
  // Draw the knowledge graph (simplified representation)
  const drawKnowledgeGraph = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    // Main categories (level 1)
    const categories = [
      { name: 'القرآن', color: '#8b5cf6', x: centerX, y: centerY - 100 },
      { name: 'الحديث', color: '#3b82f6', x: centerX + 150, y: centerY - 50 },
      { name: 'الفقه', color: '#10b981', x: centerX + 100, y: centerY + 100 },
      { name: 'العقيدة', color: '#f59e0b', x: centerX - 100, y: centerY + 100 },
      { name: 'التصوف', color: '#ef4444', x: centerX - 150, y: centerY - 50 },
    ];
    
    // Draw connections between categories
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < categories.length; i++) {
      const cat1 = categories[i];
      
      // Connect to center
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(cat1.x, cat1.y);
      ctx.stroke();
      
      // Connect to next category
      const cat2 = categories[(i + 1) % categories.length];
      ctx.beginPath();
      ctx.moveTo(cat1.x, cat1.y);
      ctx.lineTo(cat2.x, cat2.y);
      ctx.stroke();
    }
    
    // Draw center node
    ctx.beginPath();
    ctx.arc(centerX, centerY, 25, 0, Math.PI * 2);
    ctx.fillStyle = '#1e40af';
    ctx.fill();
    
    // Draw center label
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('الإسلام', centerX, centerY);
    
    // Draw category nodes
    for (const category of categories) {
      // Draw node
      ctx.beginPath();
      ctx.arc(category.x, category.y, 20, 0, Math.PI * 2);
      ctx.fillStyle = category.color;
      ctx.fill();
      
      // Draw label
      ctx.font = 'bold 12px Arial';
      ctx.fillStyle = '#1f2937';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(category.name, category.x, category.y);
      
      // If expandLevel > 1, draw subcategories
      if (expandLevel > 1) {
        drawSubcategories(ctx, category);
      }
    }
  };
  
  // Draw subcategories for a given category
  const drawSubcategories = (ctx: CanvasRenderingContext2D, category: any) => {
    // Subcategories data (simplified)
    const subcategories = [
      { name: 'فرع 1', angle: Math.PI / 6 },
      { name: 'فرع 2', angle: Math.PI / 3 },
      { name: 'فرع 3', angle: Math.PI / 2 },
    ];
    
    const distance = 70; // Distance from parent
    
    for (const sub of subcategories) {
      // Calculate position
      const x = category.x + Math.cos(sub.angle) * distance;
      const y = category.y + Math.sin(sub.angle) * distance;
      
      // Draw connection
      ctx.beginPath();
      ctx.moveTo(category.x, category.y);
      ctx.lineTo(x, y);
      ctx.strokeStyle = '#d1d5db';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw node
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fillStyle = category.color + '80'; // Add transparency
      ctx.fill();
      
      // Draw label
      ctx.font = '10px Arial';
      ctx.fillStyle = '#1f2937';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(sub.name, x, y);
    }
  };
  
  // Handle canvas click
  const handleCanvasClick = (e: MouseEvent) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if clicked on a node
    checkNodeClick(x, y);
  };
  
  // Check if a node was clicked
  const checkNodeClick = (x: number, y: number) => {
    // In a real implementation, this would check if the coordinates hit any node
    // For this demo, we'll just show a sample node detail
    setSelectedNode({
      id: 'node-1',
      name: 'الفقه الإسلامي',
      type: 'category',
      description: 'العلم بالأحكام الشرعية العملية المكتسب من أدلتها التفصيلية',
      connections: ['الحديث', 'أصول الفقه', 'القواعد الفقهية'],
      scholars: ['الإمام الشافعي', 'الإمام أبو حنيفة', 'الإمام مالك', 'الإمام أحمد بن حنبل'],
      books: ['الأم', 'المبسوط', 'المدونة', 'المغني'],
      timeline: '767 - حتى الآن'
    });
  };
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
    // Implement semantic search in the knowledge graph
  };
  
  // Handle zoom in
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  };
  
  // Handle zoom out
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };
  
  // Handle reset view
  const handleReset = () => {
    setZoomLevel(1);
    setRotation(0);
    setSelectedNode(null);
    initializeGraph();
  };
  
  // Toggle view mode
  const toggleViewMode = () => {
    setViewMode(prev => (prev === '3d' ? '2d' : '3d'));
    setLoading(true);
  };
  
  // Handle category filter change
  const handleCategoryFilterChange = (category: string) => {
    setCategoryFilters(prev => {
      if (prev.includes(category)) {
        return prev.filter(cat => cat !== category);
      } else {
        return [...prev, category];
      }
    });
  };
  
  // Handle era filter change
  const handleEraChange = (value: [number, number]) => {
    setEra(value);
  };
  
  // Handle expand level change
  const handleExpandLevelChange = (level: number) => {
    setExpandLevel(level);
    setLoading(true);
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-sky-100 dark:from-slate-900 dark:to-sky-900">
        {/* Header */}
        <header className="p-4 border-b bg-white dark:bg-slate-800 shadow-sm flex items-center justify-between">
          <div className="flex items-center">
            <BookOpen className="h-7 w-7 text-blue-600 dark:text-blue-400 mr-3" />
            <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">مستكشف المعرفة الإسلامية</h1>
          </div>
          <Button variant="ghost" onClick={() => setShowControls(!showControls)} size="icon" className="lg:hidden">
            <Filter className="h-5 w-5" />
          </Button>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Controls Panel */}
          <motion.aside
            initial={{ x: 0 }}
            animate={{ x: showControls || isDesktop ? 0 : '-100%' }} // Use isDesktop state
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`w-80 bg-white dark:bg-slate-800 border-r dark:border-slate-700 p-4 flex flex-col space-y-6 overflow-y-auto lg:relative absolute h-full z-10 shadow-lg lg:shadow-none`}
          >
            <ScrollArea className="flex-grow pr-2">
              {/* Search */}
              <div className="space-y-2">
                <label htmlFor="search" className="text-sm font-medium text-slate-700 dark:text-slate-300">بحث في المعرفة</label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="search"
                    type="text"
                    placeholder="ابحث عن مصطلح، عالم، كتاب..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow"
                  />
                  <Button variant="outline" size="icon">
                    <Search className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* View Mode */}
              <div className="space-y-2 pt-4">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">وضع العرض</label>
                <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as '2d' | '3d')} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="3d">ثلاثي الأبعاد</TabsTrigger>
                    <TabsTrigger value="2d">ثنائي الأبعاد</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Graph Controls */}
              <div className="space-y-3 pt-4">
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">أدوات التحكم بالرسم</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" onClick={() => setZoomLevel(prev => Math.min(prev + 0.1, 3))} className="w-full">
                        <ZoomIn className="h-4 w-4 mr-2" /> تكبير
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>تكبير العرض</p></TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" onClick={() => setZoomLevel(prev => Math.max(prev - 0.1, 0.5))} className="w-full">
                        <ZoomOut className="h-4 w-4 mr-2" /> تصغير
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>تصغير العرض</p></TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" onClick={() => setRotation(prev => prev + 15)} className="w-full">
                        <RotateCw className="h-4 w-4 mr-2" /> تدوير
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>تدوير الرسم البياني</p></TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" onClick={initializeGraph} className="w-full">
                        <RotateCw className="h-4 w-4 mr-2" /> إعادة تعيين
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>إعادة تعيين الرسم البياني</p></TooltipContent>
                  </Tooltip>
                </div>
                <div className="space-y-1">
                  <label htmlFor="expandLevel" className="text-xs text-slate-600 dark:text-slate-400">مستوى التوسع: {expandLevel}</label>
                  <Slider
                    id="expandLevel"
                    min={1}
                    max={3}
                    step={1}
                    value={[expandLevel]}
                    onValueChange={(value) => setExpandLevel(value[0])}
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="space-y-3 pt-4">
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">الفلاتر</h3>
                <div className="space-y-2">
                  <label className="text-xs text-slate-600 dark:text-slate-400">التصنيفات</label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map(category => (
                      <Button
                        key={category}
                        variant={categoryFilters.includes(category) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setCategoryFilters(prev =>
                            prev.includes(category)
                              ? prev.filter(c => c !== category)
                              : [...prev, category]
                          );
                        }}
                        className="text-xs justify-start"
                      >
                        {categoryFilters.includes(category) ? <Minus className="h-3 w-3 mr-1" /> : <Plus className="h-3 w-3 mr-1" />}
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <label htmlFor="eraSlider" className="text-xs text-slate-600 dark:text-slate-400">الحقبة الزمنية: {era[0]} - {era[1]}</label>
                  <Slider
                    id="eraSlider"
                    min={500}
                    max={2024}
                    step={10}
                    value={era}
                    onValueChange={(value) => setEra(value as [number, number])}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-6">
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">إجراءات</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Save className="h-4 w-4 mr-2 text-blue-500" /> حفظ العرض الحالي
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2 text-green-500" /> تحميل كصورة
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Share2 className="h-4 w-4 mr-2 text-purple-500" /> مشاركة الرابط
                  </Button>
                </div>
              </div>

              {/* Information */}
              <div className="pt-6 mt-auto">
                <Card className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-3">
                    <div className="flex items-start">
                      <Info className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2 mt-1 flex-shrink-0" />
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        استخدم هذه الأدوات لاستكشاف العلاقات بين المفاهيم الإسلامية. يمكنك البحث، تصفية النتائج، وتغيير طريقة العرض.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </motion.aside>

          {/* Graph Area */}
          <main className="flex-1 p-4 relative bg-slate-100 dark:bg-slate-950 overflow-hidden">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-black/70 z-20">
                <Spinner size="lg" />
                <p className="ml-3 text-slate-700 dark:text-slate-300 font-medium">جاري تحميل الرسم البياني...</p>
              </div>
            )}
            {isClient && !loading && (
              <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-black/70 z-20"><Spinner size="lg" /><p className="ml-3 text-slate-700 dark:text-slate-300 font-medium">جاري تحميل مكون الرسم البياني...</p></div>}>
                {graphData.nodes.length > 0 ? (
                  <div className="w-full h-full absolute top-0 left-0">
                    {viewMode === '3d' ? (
                      <ErrorBoundary fallback={<canvas ref={canvasRef} className="w-full h-full" />} onError={handle3DLoadError}>
                        <LazyForceGraph3D
                          ref={(instance) => { graphInstanceRef.current = instance as ForceGraph3DMethods | undefined; }}
                          graphData={graphData}
                          nodeId="id"
                          nodeVal="val"
                          nodeLabel="name"
                          nodeColor="color"
                          linkWidth="value"
                          backgroundColor="#f8fafc"
                          width={graphContainerRef.current?.clientWidth || 800}
                          height={graphContainerRef.current?.clientHeight || 600}
                          onNodeClick={(node: any) => setSelectedNode(node)}
                        />
                      </ErrorBoundary>
                    ) : (
                      <ErrorBoundary fallback={<canvas ref={canvasRef} className="w-full h-full" />} onError={() => initializeGraph()}>
                        <LazyForceGraph2D
                          ref={(instance) => { graphInstanceRef.current = instance as ForceGraph2DMethods | undefined; }}
                          graphData={graphData}
                          nodeId="id"
                          nodeVal="val"
                          nodeLabel="name"
                          nodeColor="color"
                          linkWidth="value"
                          backgroundColor="#f8fafc"
                          width={graphContainerRef.current?.clientWidth || 800}
                          height={graphContainerRef.current?.clientHeight || 600}
                          onNodeClick={(node: any) => setSelectedNode(node)}
                        />
                      </ErrorBoundary>
                    )}
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <p className="text-slate-500 dark:text-slate-400">
                      {searchTerm ? `لا توجد نتائج بحث لـ "${searchTerm}".` : "لا توجد بيانات لعرضها. حاول تعديل الفلاتر أو البحث."}
                    </p>
                  </div>
                )}
              </Suspense>
            )}
            {selectedNode && (
              <NodeDetailPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
            )}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
};

// Dummy NodeDetailPanel for completeness - replace with actual implementation
interface NodeDetailPanelProps {
  node: NodeObject;
  onClose: () => void;
}
const NodeDetailPanel: React.FC<NodeDetailPanelProps> = ({ node, onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-4 right-4 w-72 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-xl border dark:border-slate-700 z-20"
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">{String(node.name || node.id)}</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 h-7 w-7">
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
        <p><strong>المعرف:</strong> {String(node.id)}</p>
        <p><strong>النوع:</strong> {String((node as any).group || 'غير محدد')}</p>
        <p><strong>القيمة:</strong> {String(node.val || 'N/A')}</p>
        <p><strong>الحقبة:</strong> {String((node as any).era || 'N/A')}</p>
        <p className="pt-2 text-xs text-slate-400 dark:text-slate-500">تفاصيل إضافية حول هذا العنصر تظهر هنا.</p>
      </div>
    </motion.div>
  );
};

export default KnowledgeExplorer;
