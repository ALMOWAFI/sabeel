import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
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
  AlertCircle
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Enhanced knowledge graph component that connects to the backend API
const RobustKnowledgeExplorer: React.FC = () => {
  const { toast } = useToast();
  const graphContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [era, setEra] = useState<[number, number]>([700, 2023]);
  const [expandLevel, setExpandLevel] = useState(1);
  const [graphData, setGraphData] = useState<any>(null);
  const [isApiConnected, setIsApiConnected] = useState(true);
  
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

  // Fetch knowledge graph data from the API
  useEffect(() => {
    const fetchKnowledgeGraph = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Add a small delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check API connection
        const healthResponse = await fetch('http://localhost:5000/api/health', { signal: AbortSignal.timeout(5000) });
        if (!healthResponse.ok) {
          throw new Error('API server is not responding');
        }
        
        const healthData = await healthResponse.json();
        if (healthData.status !== 'healthy') {
          setIsApiConnected(false);
          throw new Error(`API status: ${healthData.status}`);
        }
        
        // Fetch graph data with parameters
        const response = await fetch(`http://localhost:5000/api/knowledge-graph?topic=Islam&depth=${expandLevel}`, { 
          signal: AbortSignal.timeout(10000)
        });
        
        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }
        
        const data = await response.json();
        setGraphData(data);
        setIsApiConnected(true);
      } catch (err: any) {
        console.error('Error fetching knowledge graph:', err);
        setError(err.message || 'Failed to load knowledge graph');
        
        // Check if this is a connection error
        if (err.name === 'AbortError' || err.message.includes('not responding')) {
          setIsApiConnected(false);
        }
        
        // Fallback to using the mock data when API is unavailable
        toast({
          variant: "destructive",
          title: "تعذر الاتصال بالخادم",
          description: "نستخدم البيانات المحلية مؤقتاً. بعض الميزات قد تكون محدودة."
        });
      } finally {
        setLoading(false);
        initializeGraph();
      }
    };
    
    fetchKnowledgeGraph();
  }, [expandLevel, toast]);

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
    
    // Draw graph
    if (graphData && isApiConnected) {
      drawGraphFromApiData(ctx, centerX, centerY);
    } else {
      // Fallback to mock data visualization
      drawKnowledgeGraph(ctx, centerX, centerY);
    }
    
    // Add canvas interaction
    canvas.onclick = handleCanvasClick;
  };

  // Draw graph using API data
  const drawGraphFromApiData = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    if (!graphData || !graphData.nodes || !graphData.links) return;
    
    // Calculate node positions (simple force-directed layout)
    const nodes = graphData.nodes.map((node: any) => {
      // Position nodes in a circle around the center
      const angle = Math.random() * Math.PI * 2;
      const distance = 150 * Math.random() + 50;
      return {
        ...node,
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        color: getNodeColor(node.group)
      };
    });
    
    // Draw links
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    
    graphData.links.forEach((link: any) => {
      const source = nodes.find((n: any) => n.id === link.source);
      const target = nodes.find((n: any) => n.id === link.target);
      
      if (source && target) {
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
      }
    });
    
    // Draw nodes
    nodes.forEach((node: any) => {
      // Draw node
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.group === 1 ? 25 : 20, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.fill();
      
      // Draw label
      ctx.font = node.group === 1 ? 'bold 14px Arial' : 'bold 12px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label || node.id, node.x, node.y);
    });
  };
  
  // Get color based on node group
  const getNodeColor = (group: number) => {
    const colors = [
      '#1e40af', // Primary (Islam)
      '#8b5cf6', // Quran
      '#3b82f6', // Hadith
      '#10b981', // Fiqh
      '#f59e0b', // Aqeedah
      '#ef4444', // Other
    ];
    
    return colors[group % colors.length];
  };
  
  // Draw the knowledge graph (fallback when API is unavailable)
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
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(category.name, category.x, category.y);
      
      // If expandLevel > 1, draw subcategories
      if (expandLevel > 1) {
        drawSubcategories(ctx, category);
      }
    }
  };
  
  // Draw subcategories (fallback)
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
  const handleCanvasClick = (event: MouseEvent) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Logic to detect which node was clicked
    // For simplicity, we'll show some fixed node details
    setSelectedNode({
      name: 'العقيدة الإسلامية',
      description: 'أصول الإيمان والعقيدة في الإسلام',
      scholars: ['ابن تيمية', 'الإمام الطحاوي', 'محمد بن عبد الوهاب'],
      sources: [
        { title: 'العقيدة الواسطية', author: 'ابن تيمية' },
        { title: 'العقيدة الطحاوية', author: 'الإمام الطحاوي' }
      ]
    });
    
    toast({
      title: "تم اختيار العقدة",
      description: "تم تحميل معلومات عن العقيدة الإسلامية"
    });
  };
  
  // Handle zoom changes
  const handleZoomChange = (newZoom: number) => {
    setZoomLevel(newZoom);
    // Apply zoom to canvas
    if (canvasRef.current && graphContainerRef.current) {
      canvasRef.current.style.transform = `scale(${newZoom}) rotate(${rotation}deg)`;
    }
  };
  
  // Handle rotation changes
  const handleRotationChange = (degrees: number) => {
    setRotation(rotation + degrees);
    if (canvasRef.current) {
      canvasRef.current.style.transform = `scale(${zoomLevel}) rotate(${rotation + degrees}deg)`;
    }
  };
  
  // Handle filter changes
  const toggleCategoryFilter = (category: string) => {
    setCategoryFilters(prev => 
      prev.includes(category)
        ? prev.filter(cat => cat !== category)
        : [...prev, category]
    );
  };
  
  // Handle expand level changes
  const handleExpandLevelChange = (level: number) => {
    setExpandLevel(level);
  };
  
  // Handle search
  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    toast({
      title: "جاري البحث",
      description: `البحث عن: ${searchTerm}`
    });
    
    // In a real implementation, this would query the API
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Mock finding a node
      setSelectedNode({
        name: searchTerm,
        description: `معلومات عن ${searchTerm} في المعرفة الإسلامية`,
        scholars: ['عالم 1', 'عالم 2'],
        sources: [
          { title: 'المصدر 1', author: 'المؤلف 1' },
          { title: 'المصدر 2', author: 'المؤلف 2' }
        ]
      });
    }, 1500);
  };
  
  // Reset graph view
  const resetView = () => {
    setZoomLevel(1);
    setRotation(0);
    setSelectedNode(null);
    setCategoryFilters([]);
    if (canvasRef.current) {
      canvasRef.current.style.transform = 'scale(1) rotate(0deg)';
    }
    
    // Reinitialize graph
    initializeGraph();
    
    toast({
      title: "تم إعادة ضبط العرض",
      description: "تم إعادة ضبط مستكشف المعرفة"
    });
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-[600px] gap-4 dir-rtl">
      {/* Graph Container */}
      <div className="w-full md:w-2/3 h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-md">
        {/* Toolbar */}
        <div className="p-2 border-b flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleZoomChange(zoomLevel + 0.1)}
              title="تكبير"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleZoomChange(Math.max(0.5, zoomLevel - 0.1))}
              title="تصغير"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleRotationChange(15)}
              title="تدوير"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={resetView}
              title="إعادة ضبط العرض"
            >
              <RotateCw className="h-4 w-4 transform rotate-180" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Tabs
              defaultValue="3d"
              value={viewMode}
              onValueChange={(value) => setViewMode(value as '3d' | '2d')}
              className="w-auto"
            >
              <TabsList>
                <TabsTrigger value="3d">ثلاثي الأبعاد</TabsTrigger>
                <TabsTrigger value="2d">ثنائي الأبعاد</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleExpandLevelChange(Math.max(1, expandLevel - 1))}
                title="تقليل العمق"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-sm">عمق {expandLevel}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleExpandLevelChange(expandLevel + 1)}
                title="زيادة العمق"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Input
              placeholder="بحث في شبكة المعرفة"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-60"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button
              onClick={handleSearch}
              className="bg-sabeel-primary hover:bg-sabeel-secondary"
            >
              <Search className="h-4 w-4 mr-2" />
              بحث
            </Button>
          </div>
        </div>
        
        {/* Graph View */}
        <div
          className="relative w-full h-[550px] p-4 overflow-hidden"
          ref={graphContainerRef}
        >
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800">
              <Spinner className="h-12 w-12 mb-4" />
              <p className="text-center text-muted-foreground">جاري تحميل شبكة المعرفة الإسلامية...</p>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800">
              <AlertCircle className="h-12 w-12 mb-4 text-red-500" />
              <p className="text-center text-lg font-semibold text-red-500">حدث خطأ</p>
              <p className="text-center text-muted-foreground">{error}</p>
              <Button onClick={resetView} className="mt-4">
                إعادة المحاولة
              </Button>
            </div>
          ) : (
            <>
              {!isApiConnected && (
                <Alert className="mb-4 bg-amber-50 dark:bg-amber-900/20">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>وضع غير متصل</AlertTitle>
                  <AlertDescription>
                    تعذر الاتصال بخادم المعرفة الإسلامية. نعرض بيانات محلية بسيطة.
                  </AlertDescription>
                </Alert>
              )}
              <canvas
                ref={canvasRef}
                className="w-full h-full transition-transform duration-300"
                style={{ transformOrigin: 'center center' }}
              />
            </>
          )}
        </div>
      </div>
      
      {/* Information Panel */}
      <Card className="w-full md:w-1/3 h-[600px] bg-white dark:bg-gray-800">
        <CardContent className="p-4 h-full">
          {selectedNode ? (
            <div className="h-full flex flex-col">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-sabeel-primary">{selectedNode.name}</h2>
                <p className="text-muted-foreground">{selectedNode.description}</p>
              </div>
              
              <ScrollArea className="flex-1">
                {/* Scholars */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-sabeel-primary" />
                    العلماء المرتبطون
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedNode.scholars.map((scholar: string, i: number) => (
                      <Badge key={i} variant="outline">
                        {scholar}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Sources */}
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-sabeel-primary" />
                    المصادر
                  </h3>
                  <div className="space-y-2">
                    {selectedNode.sources.map((source: any, i: number) => (
                      <div key={i} className="p-3 border rounded-md">
                        <h4 className="font-semibold">{source.title}</h4>
                        <p className="text-sm text-muted-foreground">{source.author}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
              
              <div className="mt-4 pt-2 border-t">
                <div className="flex items-center justify-between">
                  <Button variant="outline" size="sm" onClick={() => setSelectedNode(null)}>
                    عودة
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" title="تحميل">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" title="مشاركة">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center">
              <Info className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-center mb-2">مستكشف المعرفة الإسلامية</h2>
              <p className="text-center text-muted-foreground mb-6">
                انقر على أي عقدة في الرسم البياني لعرض التفاصيل والمعلومات المرتبطة بها
              </p>
              <div className="w-full max-w-xs space-y-2">
                <h3 className="text-md font-semibold">تصفية حسب الموضوع</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 5).map((category) => (
                    <Badge
                      key={category}
                      variant={categoryFilters.includes(category) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleCategoryFilter(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RobustKnowledgeExplorer;
