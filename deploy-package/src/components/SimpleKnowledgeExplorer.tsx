import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

const SimpleKnowledgeExplorer: React.FC = () => {
  const { toast } = useToast();
  const graphContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'2d'>('2d'); // Only 2D mode is supported in this fallback
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [era, setEra] = useState<[number, number]>([1000, 1500]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [expandLevel, setExpandLevel] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);

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
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Initialize canvas
        initializeGraph();
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
      }
    };
    
    loadGraphData();
  }, [expandLevel, categoryFilters, era, toast]);
  
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

  // Initialize the graph visualization
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
    initializeGraph(); // Redraw with new zoom level
  };
  
  // Handle zoom out
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
    initializeGraph(); // Redraw with new zoom level
  };
  
  // Handle reset view
  const handleReset = () => {
    setZoomLevel(1);
    setRotation(0);
    setSelectedNode(null);
    initializeGraph();
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
            animate={{ x: showControls || isDesktop ? 0 : '-100%' }}
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

              {/* View Mode - Disabled in fallback */}
              <div className="space-y-2 pt-4">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">وضع العرض</label>
                <Tabs value={viewMode} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="2d" disabled={false}>ثنائي الأبعاد</TabsTrigger>
                    <TabsTrigger value="3d" disabled={true}>ثلاثي الأبعاد (غير متاح)</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Graph Controls */}
              <div className="space-y-3 pt-4">
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">أدوات التحكم بالرسم</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" onClick={handleZoomIn} className="w-full">
                        <ZoomIn className="h-4 w-4 mr-2" /> تكبير
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>تكبير العرض</p></TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" onClick={handleZoomOut} className="w-full">
                        <ZoomOut className="h-4 w-4 mr-2" /> تصغير
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>تصغير العرض</p></TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" onClick={() => {
                        setRotation(prev => prev + 15);
                        initializeGraph();
                      }} className="w-full">
                        <RotateCw className="h-4 w-4 mr-2" /> تدوير
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>تدوير الرسم البياني</p></TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" onClick={handleReset} className="w-full">
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
                    onValueChange={(value) => handleExpandLevelChange(value[0])}
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
                        onClick={() => handleCategoryFilterChange(category)}
                        className="justify-center"
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-600 dark:text-slate-400">الفترة الزمنية: {era[0]} - {era[1]}</label>
                  <Slider
                    min={700}
                    max={2023}
                    step={50}
                    value={era}
                    onValueChange={handleEraChange}
                    className="py-4"
                  />
                </div>
              </div>

              {/* Export Options */}
              <div className="space-y-3 pt-4">
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">خيارات التصدير</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="w-full">
                    <Save className="h-4 w-4 mr-2" /> حفظ
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" /> تنزيل
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Share2 className="h-4 w-4 mr-2" /> مشاركة
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </motion.aside>

          {/* Main Visualization Area */}
          <div className="flex-1 relative overflow-hidden" ref={graphContainerRef}>
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Spinner size="lg" />
                <span className="ml-3 text-lg font-medium">جاري تحميل الرسم البياني...</span>
              </div>
            ) : error ? (
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <Alert variant="destructive" className="max-w-md">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>خطأ في تحميل الرسم البياني</AlertTitle>
                  <AlertDescription>
                    {error}
                    <Button variant="outline" className="mt-2 w-full" onClick={initializeGraph}>
                      إعادة المحاولة
                    </Button>
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <>
                {/* Canvas for 2D fallback */}
                <canvas 
                  ref={canvasRef} 
                  className="w-full h-full" 
                  style={{ 
                    transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                    transformOrigin: 'center center'
                  }}
                />
                
                {/* Node Detail Panel */}
                {selectedNode && (
                  <div className="absolute bottom-4 right-4 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 z-20 border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{selectedNode.name}</h3>
                      <Button variant="ghost" size="icon" onClick={() => setSelectedNode(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <Badge className="mb-2" variant="outline">
                      {selectedNode.type || 'غير مصنف'}
                    </Badge>
                    
                    {selectedNode.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{selectedNode.description}</p>
                    )}
                    
                    {selectedNode.scholars && selectedNode.scholars.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">العلماء المرتبطون:</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedNode.scholars.map((scholar: string, i: number) => (
                            <Badge key={i} variant="secondary">{scholar}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedNode.books && selectedNode.books.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">الكتب المرتبطة:</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedNode.books.map((book: string, i: number) => (
                            <Badge key={i} variant="outline">{book}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedNode.connections && selectedNode.connections.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">الارتباطات:</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedNode.connections.map((connection: string, i: number) => (
                            <Badge key={i} variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                              {connection}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedNode.timeline && (
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                        <Info className="h-3 w-3 inline mr-1" />
                        الفترة الزمنية: {selectedNode.timeline}
                      </div>
                    )}
                    
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      <Search className="h-3 w-3 mr-2" />
                      استكشاف المزيد
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default SimpleKnowledgeExplorer;