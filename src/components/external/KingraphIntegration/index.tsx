import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Filter, 
  Download, 
  Share2, 
  Info,
  User,
  Book,
  FileText,
  Bookmark
} from 'lucide-react';

// Mock data for Islamic knowledge graph
const mockGraphData = {
  nodes: [
    // Primary sources
    { id: "quran", label: "القرآن الكريم", group: "primary", size: 30 },
    { id: "hadith", label: "الحديث الشريف", group: "primary", size: 25 },
    
    // Islamic sciences
    { id: "tafsir", label: "علم التفسير", group: "science", size: 20 },
    { id: "fiqh", label: "علم الفقه", group: "science", size: 20 },
    { id: "aqeedah", label: "علم العقيدة", group: "science", size: 20 },
    { id: "usul", label: "أصول الفقه", group: "science", size: 18 },
    { id: "mustalah", label: "مصطلح الحديث", group: "science", size: 18 },
    
    // Madhabs (Schools of thought)
    { id: "hanafi", label: "المذهب الحنفي", group: "madhab", size: 15 },
    { id: "maliki", label: "المذهب المالكي", group: "madhab", size: 15 },
    { id: "shafii", label: "المذهب الشافعي", group: "madhab", size: 15 },
    { id: "hanbali", label: "المذهب الحنبلي", group: "madhab", size: 15 },
    
    // Scholars
    { id: "bukhari", label: "الإمام البخاري", group: "scholar", size: 18 },
    { id: "muslim", label: "الإمام مسلم", group: "scholar", size: 18 },
    { id: "malik", label: "الإمام مالك", group: "scholar", size: 18 },
    { id: "abuhanifa", label: "الإمام أبو حنيفة", group: "scholar", size: 18 },
    { id: "shafii_imam", label: "الإمام الشافعي", group: "scholar", size: 18 },
    { id: "ahmad", label: "الإمام أحمد بن حنبل", group: "scholar", size: 18 },
    { id: "ibnkathir", label: "ابن كثير", group: "scholar", size: 16 },
    { id: "tabari", label: "الطبري", group: "scholar", size: 16 },
    
    // Books
    { id: "sahih_bukhari", label: "صحيح البخاري", group: "book", size: 14 },
    { id: "sahih_muslim", label: "صحيح مسلم", group: "book", size: 14 },
    { id: "muwatta", label: "الموطأ", group: "book", size: 14 },
    { id: "tafsir_ibn_kathir", label: "تفسير ابن كثير", group: "book", size: 14 },
    { id: "tafsir_tabari", label: "تفسير الطبري", group: "book", size: 14 },
  ],
  links: [
    // Primary sources to sciences
    { source: "quran", target: "tafsir", value: 5 },
    { source: "quran", target: "fiqh", value: 4 },
    { source: "quran", target: "aqeedah", value: 4 },
    { source: "hadith", target: "fiqh", value: 4 },
    { source: "hadith", target: "mustalah", value: 5 },
    { source: "hadith", target: "aqeedah", value: 3 },
    
    // Sciences relationships
    { source: "fiqh", target: "usul", value: 4 },
    
    // Madhabs to sciences
    { source: "hanafi", target: "fiqh", value: 3 },
    { source: "maliki", target: "fiqh", value: 3 },
    { source: "shafii", target: "fiqh", value: 3 },
    { source: "hanbali", target: "fiqh", value: 3 },
    { source: "hanafi", target: "usul", value: 2 },
    { source: "maliki", target: "usul", value: 2 },
    { source: "shafii", target: "usul", value: 2 },
    { source: "hanbali", target: "usul", value: 2 },
    
    // Scholars to madhabs
    { source: "abuhanifa", target: "hanafi", value: 5 },
    { source: "malik", target: "maliki", value: 5 },
    { source: "shafii_imam", target: "shafii", value: 5 },
    { source: "ahmad", target: "hanbali", value: 5 },
    
    // Scholars to sciences
    { source: "bukhari", target: "mustalah", value: 4 },
    { source: "muslim", target: "mustalah", value: 4 },
    { source: "ibnkathir", target: "tafsir", value: 4 },
    { source: "tabari", target: "tafsir", value: 4 },
    
    // Scholars to books
    { source: "bukhari", target: "sahih_bukhari", value: 5 },
    { source: "muslim", target: "sahih_muslim", value: 5 },
    { source: "malik", target: "muwatta", value: 5 },
    { source: "ibnkathir", target: "tafsir_ibn_kathir", value: 5 },
    { source: "tabari", target: "tafsir_tabari", value: 5 },
    
    // Books to sciences
    { source: "sahih_bukhari", target: "hadith", value: 4 },
    { source: "sahih_muslim", target: "hadith", value: 4 },
    { source: "muwatta", target: "hadith", value: 4 },
    { source: "tafsir_ibn_kathir", target: "tafsir", value: 4 },
    { source: "tafsir_tabari", target: "tafsir", value: 4 },
  ]
};

// Mock data for hadith isnad (chain of narration)
const mockIsnadData = {
  nodes: [
    { id: "prophet", label: "النبي ﷺ", group: "prophet", size: 35 },
    { id: "abuhurayrah", label: "أبو هريرة", group: "companion", size: 25 },
    { id: "hammam", label: "همام بن منبه", group: "successor", size: 20 },
    { id: "maamar", label: "معمر بن راشد", group: "narrator", size: 18 },
    { id: "abdulrazzaq", label: "عبد الرزاق", group: "narrator", size: 18 },
    { id: "ahmad", label: "أحمد بن حنبل", group: "narrator", size: 18 },
    { id: "bukhari", label: "البخاري", group: "collector", size: 22 },
    { id: "muslim", label: "مسلم", group: "collector", size: 22 },
  ],
  links: [
    { source: "prophet", target: "abuhurayrah", value: 5 },
    { source: "abuhurayrah", target: "hammam", value: 4 },
    { source: "hammam", target: "maamar", value: 3 },
    { source: "maamar", target: "abdulrazzaq", value: 3 },
    { source: "abdulrazzaq", target: "ahmad", value: 3 },
    { source: "ahmad", target: "bukhari", value: 2 },
    { source: "ahmad", target: "muslim", value: 2 },
  ]
};

export function KnowledgeGraphViewer() {
  const [activeTab, setActiveTab] = useState('knowledge');
  const [searchTerm, setSearchTerm] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [filterGroup, setFilterGroup] = useState<string | null>(null);
  const graphRef = useRef<HTMLDivElement>(null);
  const isnadRef = useRef<HTMLDivElement>(null);

  // Initialize the graph visualization
  useEffect(() => {
    if (activeTab === 'knowledge') {
      renderKnowledgeGraph();
    } else if (activeTab === 'isnad') {
      renderIsnadGraph();
    }
  }, [activeTab, zoomLevel, filterGroup]);

  // Function to render the knowledge graph
  const renderKnowledgeGraph = () => {
    if (!graphRef.current) return;
    
    // Clear previous content
    graphRef.current.innerHTML = '';
    
    // Create SVG element
    const width = graphRef.current.clientWidth;
    const height = 500;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", width.toString());
    svg.setAttribute("height", height.toString());
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.style.overflow = "hidden";
    
    // Add a background
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", width.toString());
    rect.setAttribute("height", height.toString());
    rect.setAttribute("fill", "#f8fafc");
    svg.appendChild(rect);
    
    // Filter nodes based on selected group
    const filteredNodes = filterGroup 
      ? mockGraphData.nodes.filter(node => node.group === filterGroup)
      : mockGraphData.nodes;
    
    // Filter links based on filtered nodes
    const filteredNodeIds = filteredNodes.map(node => node.id);
    const filteredLinks = mockGraphData.links.filter(link => 
      filteredNodeIds.includes(link.source) && filteredNodeIds.includes(link.target)
    );
    
    // Simple force-directed layout simulation
    // In a real implementation, you would use a proper force-directed layout algorithm
    const nodePositions: {[key: string]: {x: number, y: number}} = {};
    
    // Assign initial positions in a circle
    filteredNodes.forEach((node, i) => {
      const angle = (i / filteredNodes.length) * Math.PI * 2;
      const radius = Math.min(width, height) * 0.35 * zoomLevel;
      const x = width / 2 + Math.cos(angle) * radius;
      const y = height / 2 + Math.sin(angle) * radius;
      nodePositions[node.id] = { x, y };
    });
    
    // Draw links
    filteredLinks.forEach(link => {
      const sourcePos = nodePositions[link.source];
      const targetPos = nodePositions[link.target];
      
      if (sourcePos && targetPos) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", sourcePos.x.toString());
        line.setAttribute("y1", sourcePos.y.toString());
        line.setAttribute("x2", targetPos.x.toString());
        line.setAttribute("y2", targetPos.y.toString());
        line.setAttribute("stroke", "#cbd5e1");
        line.setAttribute("stroke-width", (link.value / 2).toString());
        line.setAttribute("opacity", "0.6");
        
        svg.appendChild(line);
      }
    });
    
    // Draw nodes
    filteredNodes.forEach(node => {
      const pos = nodePositions[node.id];
      if (!pos) return;
      
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("transform", `translate(${pos.x}, ${pos.y})`);
      g.dataset.id = node.id;
      
      // Create circle for node
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("r", ((node.size || 10) / 2 * zoomLevel).toString());
      
      // Set color based on group
      let fill = "#3b82f6";  // Default blue
      if (node.group === "primary") fill = "#8b5cf6";  // Purple
      if (node.group === "science") fill = "#10b981"; // Green
      if (node.group === "madhab") fill = "#f59e0b";  // Amber
      if (node.group === "scholar") fill = "#ef4444";  // Red
      if (node.group === "book") fill = "#6366f1";  // Indigo
      
      circle.setAttribute("fill", fill);
      circle.setAttribute("opacity", "0.8");
      
      // Add text label
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.textContent = node.label;
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dy", ((node.size || 10) / 2 + 12).toString());
      text.setAttribute("font-size", (10 * zoomLevel).toString());
      text.setAttribute("fill", "#1e293b");
      
      // Add interactivity
      g.onclick = () => {
        setSelectedNode(node);
      };
      
      g.appendChild(circle);
      g.appendChild(text);
      svg.appendChild(g);
    });
    
    graphRef.current.appendChild(svg);
  };
  
  // Function to render the isnad graph
  const renderIsnadGraph = () => {
    if (!isnadRef.current) return;
    
    // Clear previous content
    isnadRef.current.innerHTML = '';
    
    // Create SVG element
    const width = isnadRef.current.clientWidth;
    const height = 500;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", width.toString());
    svg.setAttribute("height", height.toString());
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.style.overflow = "hidden";
    
    // Add a background
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", width.toString());
    rect.setAttribute("height", height.toString());
    rect.setAttribute("fill", "#f8fafc");
    svg.appendChild(rect);
    
    // Position nodes in a vertical chain
    const nodePositions: {[key: string]: {x: number, y: number}} = {};
    
    mockIsnadData.nodes.forEach((node, i) => {
      const x = width / 2;
      const y = 80 + i * 70 * zoomLevel;
      nodePositions[node.id] = { x, y };
    });
    
    // Draw links
    mockIsnadData.links.forEach(link => {
      const sourcePos = nodePositions[link.source];
      const targetPos = nodePositions[link.target];
      
      if (sourcePos && targetPos) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const d = `M ${sourcePos.x} ${sourcePos.y} C ${sourcePos.x} ${(sourcePos.y + targetPos.y) / 2}, ${targetPos.x} ${(sourcePos.y + targetPos.y) / 2}, ${targetPos.x} ${targetPos.y}`;
        path.setAttribute("d", d);
        path.setAttribute("stroke", "#cbd5e1");
        path.setAttribute("stroke-width", (link.value).toString());
        path.setAttribute("fill", "none");
        path.setAttribute("opacity", "0.6");
        
        svg.appendChild(path);
      }
    });
    
    // Draw nodes
    mockIsnadData.nodes.forEach(node => {
      const pos = nodePositions[node.id];
      if (!pos) return;
      
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("transform", `translate(${pos.x}, ${pos.y})`);
      g.dataset.id = node.id;
      
      // Create circle for node
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("r", ((node.size || 10) / 2 * zoomLevel).toString());
      
      // Set color based on group
      let fill = "#3b82f6";  // Default blue
      if (node.group === "prophet") fill = "#8b5cf6";  // Purple
      if (node.group === "companion") fill = "#10b981"; // Green
      if (node.group === "successor") fill = "#f59e0b";  // Amber
      if (node.group === "narrator") fill = "#6366f1";  // Indigo
      if (node.group === "collector") fill = "#ef4444";  // Red
      
      circle.setAttribute("fill", fill);
      circle.setAttribute("opacity", "0.8");
      
      // Add text label
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.textContent = node.label;
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dy", ((node.size || 10) / 2 + 12).toString());
      text.setAttribute("font-size", (10 * zoomLevel).toString());
      text.setAttribute("fill", "#1e293b");
      
      // Add interactivity
      g.onclick = () => {
        setSelectedNode(node);
      };
      
      g.appendChild(circle);
      g.appendChild(text);
      svg.appendChild(g);
    });
    
    isnadRef.current.appendChild(svg);
  };
  
  const handleSearch = () => {
    // In a real implementation, this would filter the graph
    console.log("Searching for:", searchTerm);
  };
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };
  
  const handleReset = () => {
    setZoomLevel(1);
    setSelectedNode(null);
    setFilterGroup(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2 rtl:space-x-reverse">
          <Input
            type="text"
            placeholder="ابحث في المعرفة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-right"
          />
          <Button type="submit" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Select value={filterGroup || ''} onValueChange={(value) => setFilterGroup(value || null)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="تصفية حسب النوع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">الكل</SelectItem>
              <SelectItem value="primary">المصادر الأساسية</SelectItem>
              <SelectItem value="science">العلوم الشرعية</SelectItem>
              <SelectItem value="madhab">المذاهب الفقهية</SelectItem>
              <SelectItem value="scholar">العلماء</SelectItem>
              <SelectItem value="book">الكتب</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleReset}>
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="knowledge" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="knowledge">شبكة المعرفة الإسلامية</TabsTrigger>
          <TabsTrigger value="isnad">سلسلة الإسناد</TabsTrigger>
        </TabsList>
        
        <TabsContent value="knowledge" className="p-0">
          <Card>
            <CardContent className="p-0 overflow-hidden">
              <div className="relative">
                <div 
                  ref={graphRef} 
                  className="w-full h-[500px] bg-gray-50"
                ></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="isnad" className="p-0">
          <Card>
            <CardHeader>
              <CardTitle>سلسلة إسناد حديث</CardTitle>
              <CardDescription>
                "من سلك طريقا يلتمس فيه علما سهل الله له به طريقا إلى الجنة"
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden">
              <div className="relative">
                <div 
                  ref={isnadRef} 
                  className="w-full h-[500px] bg-gray-50"
                ></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {selectedNode && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full 
                ${selectedNode.group === 'primary' ? 'bg-purple-100 text-purple-600' : ''}
                ${selectedNode.group === 'science' ? 'bg-green-100 text-green-600' : ''}
                ${selectedNode.group === 'madhab' ? 'bg-amber-100 text-amber-600' : ''}
                ${selectedNode.group === 'scholar' ? 'bg-red-100 text-red-600' : ''}
                ${selectedNode.group === 'book' ? 'bg-indigo-100 text-indigo-600' : ''}
                ${selectedNode.group === 'prophet' ? 'bg-purple-100 text-purple-600' : ''}
                ${selectedNode.group === 'companion' ? 'bg-green-100 text-green-600' : ''}
                ${selectedNode.group === 'successor' ? 'bg-amber-100 text-amber-600' : ''}
                ${selectedNode.group === 'narrator' ? 'bg-indigo-100 text-indigo-600' : ''}
                ${selectedNode.group === 'collector' ? 'bg-red-100 text-red-600' : ''}
              `}>
                {selectedNode.group === 'primary' && <Book className="h-6 w-6" />}
                {selectedNode.group === 'science' && <Bookmark className="h-6 w-6" />}
                {selectedNode.group === 'madhab' && <FileText className="h-6 w-6" />}
                {selectedNode.group === 'scholar' && <User className="h-6 w-6" />}
                {selectedNode.group === 'book' && <Book className="h-6 w-6" />}
                {selectedNode.group === 'prophet' && <User className="h-6 w-6" />}
                {selectedNode.group === 'companion' && <User className="h-6 w-6" />}
                {selectedNode.group === 'successor' && <User className="h-6 w-6" />}
                {selectedNode.group === 'narrator' && <User className="h-6 w-6" />}
                {selectedNode.group === 'collector' && <User className="h-6 w-6" />}
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-1">{selectedNode.label}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {selectedNode.group === 'primary' && 'مصدر تشريعي أساسي'}
                  {selectedNode.group === 'science' && 'علم شرعي'}
                  {selectedNode.group === 'madhab' && 'مذهب فقهي'}
                  {selectedNode.group === 'scholar' && 'عالم'}
                  {selectedNode.group === 'book' && 'كتاب'}
                  {selectedNode.group === 'prophet' && 'النبي صلى الله عليه وسلم'}
                  {selectedNode.group === 'companion' && 'صحابي'}
                  {selectedNode.group === 'successor' && 'تابعي'}
                  {selectedNode.group === 'narrator' && 'راوي'}
                  {selectedNode.group === 'collector' && 'محدث'}
                </p>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Info className="h-4 w-4" />
                    تفاصيل
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Share2 className="h-4 w-4" />
                    مشاركة
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Filter, 
  Download, 
  Share2, 
  Info,
  User,
  Book,
  FileText,
  Bookmark
} from 'lucide-react';

// Mock data for Islamic knowledge graph
const mockGraphData = {
  nodes: [
    // Primary sources
    { id: "quran", label: "القرآن الكريم", group: "primary", size: 30 },
    { id: "hadith", label: "الحديث الشريف", group: "primary", size: 25 },
    
    // Islamic sciences
    { id: "tafsir", label: "علم التفسير", group: "science", size: 20 },
    { id: "fiqh", label: "علم الفقه", group: "science", size: 20 },
    { id: "aqeedah", label: "علم العقيدة", group: "science", size: 20 },
    { id: "usul", label: "أصول الفقه", group: "science", size: 18 },
    { id: "mustalah", label: "مصطلح الحديث", group: "science", size: 18 },
    
    // Madhabs (Schools of thought)
    { id: "hanafi", label: "المذهب الحنفي", group: "madhab", size: 15 },
    { id: "maliki", label: "المذهب المالكي", group: "madhab", size: 15 },
    { id: "shafii", label: "المذهب الشافعي", group: "madhab", size: 15 },
    { id: "hanbali", label: "المذهب الحنبلي", group: "madhab", size: 15 },
    
    // Scholars
    { id: "bukhari", label: "الإمام البخاري", group: "scholar", size: 18 },
    { id: "muslim", label: "الإمام مسلم", group: "scholar", size: 18 },
    { id: "malik", label: "الإمام مالك", group: "scholar", size: 18 },
    { id: "abuhanifa", label: "الإمام أبو حنيفة", group: "scholar", size: 18 },
    { id: "shafii_imam", label: "الإمام الشافعي", group: "scholar", size: 18 },
    { id: "ahmad", label: "الإمام أحمد بن حنبل", group: "scholar", size: 18 },
    { id: "ibnkathir", label: "ابن كثير", group: "scholar", size: 16 },
    { id: "tabari", label: "الطبري", group: "scholar", size: 16 },
    
    // Books
    { id: "sahih_bukhari", label: "صحيح البخاري", group: "book", size: 14 },
    { id: "sahih_muslim", label: "صحيح مسلم", group: "book", size: 14 },
    { id: "muwatta", label: "الموطأ", group: "book", size: 14 },
    { id: "tafsir_ibn_kathir", label: "تفسير ابن كثير", group: "book", size: 14 },
    { id: "tafsir_tabari", label: "تفسير الطبري", group: "book", size: 14 },
  ],
  links: [
    // Primary sources to sciences
    { source: "quran", target: "tafsir", value: 5 },
    { source: "quran", target: "fiqh", value: 4 },
    { source: "quran", target: "aqeedah", value: 4 },
    { source: "hadith", target: "fiqh", value: 4 },
    { source: "hadith", target: "mustalah", value: 5 },
    { source: "hadith", target: "aqeedah", value: 3 },
    
    // Sciences relationships
    { source: "fiqh", target: "usul", value: 4 },
    
    // Madhabs to sciences
    { source: "hanafi", target: "fiqh", value: 3 },
    { source: "maliki", target: "fiqh", value: 3 },
    { source: "shafii", target: "fiqh", value: 3 },
    { source: "hanbali", target: "fiqh", value: 3 },
    { source: "hanafi", target: "usul", value: 2 },
    { source: "maliki", target: "usul", value: 2 },
    { source: "shafii", target: "usul", value: 2 },
    { source: "hanbali", target: "usul", value: 2 },
    
    // Scholars to madhabs
    { source: "abuhanifa", target: "hanafi", value: 5 },
    { source: "malik", target: "maliki", value: 5 },
    { source: "shafii_imam", target: "shafii", value: 5 },
    { source: "ahmad", target: "hanbali", value: 5 },
    
    // Scholars to sciences
    { source: "bukhari", target: "mustalah", value: 4 },
    { source: "muslim", target: "mustalah", value: 4 },
    { source: "ibnkathir", target: "tafsir", value: 4 },
    { source: "tabari", target: "tafsir", value: 4 },
    
    // Scholars to books
    { source: "bukhari", target: "sahih_bukhari", value: 5 },
    { source: "muslim", target: "sahih_muslim", value: 5 },
    { source: "malik", target: "muwatta", value: 5 },
    { source: "ibnkathir", target: "tafsir_ibn_kathir", value: 5 },
    { source: "tabari", target: "tafsir_tabari", value: 5 },
    
    // Books to sciences
    { source: "sahih_bukhari", target: "hadith", value: 4 },
    { source: "sahih_muslim", target: "hadith", value: 4 },
    { source: "muwatta", target: "hadith", value: 4 },
    { source: "tafsir_ibn_kathir", target: "tafsir", value: 4 },
    { source: "tafsir_tabari", target: "tafsir", value: 4 },
  ]
};

// Mock data for hadith isnad (chain of narration)
const mockIsnadData = {
  nodes: [
    { id: "prophet", label: "النبي ﷺ", group: "prophet", size: 35 },
    { id: "abuhurayrah", label: "أبو هريرة", group: "companion", size: 25 },
    { id: "hammam", label: "همام بن منبه", group: "successor", size: 20 },
    { id: "maamar", label: "معمر بن راشد", group: "narrator", size: 18 },
    { id: "abdulrazzaq", label: "عبد الرزاق", group: "narrator", size: 18 },
    { id: "ahmad", label: "أحمد بن حنبل", group: "narrator", size: 18 },
    { id: "bukhari", label: "البخاري", group: "collector", size: 22 },
    { id: "muslim", label: "مسلم", group: "collector", size: 22 },
  ],
  links: [
    { source: "prophet", target: "abuhurayrah", value: 5 },
    { source: "abuhurayrah", target: "hammam", value: 4 },
    { source: "hammam", target: "maamar", value: 3 },
    { source: "maamar", target: "abdulrazzaq", value: 3 },
    { source: "abdulrazzaq", target: "ahmad", value: 3 },
    { source: "ahmad", target: "bukhari", value: 2 },
    { source: "ahmad", target: "muslim", value: 2 },
  ]
};

export function KnowledgeGraphViewer() {
  const [activeTab, setActiveTab] = useState('knowledge');
  const [searchTerm, setSearchTerm] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [filterGroup, setFilterGroup] = useState<string | null>(null);
  const graphRef = useRef<HTMLDivElement>(null);
  const isnadRef = useRef<HTMLDivElement>(null);

  // Initialize the graph visualization
  useEffect(() => {
    if (activeTab === 'knowledge') {
      renderKnowledgeGraph();
    } else if (activeTab === 'isnad') {
      renderIsnadGraph();
    }
  }, [activeTab, zoomLevel, filterGroup]);

  // Function to render the knowledge graph
  const renderKnowledgeGraph = () => {
    if (!graphRef.current) return;
    
    // Clear previous content
    graphRef.current.innerHTML = '';
    
    // Create SVG element
    const width = graphRef.current.clientWidth;
    const height = 500;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", width.toString());
    svg.setAttribute("height", height.toString());
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.style.overflow = "hidden";
    
    // Add a background
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", width.toString());
    rect.setAttribute("height", height.toString());
    rect.setAttribute("fill", "#f8fafc");
    svg.appendChild(rect);
    
    // Filter nodes based on selected group
    const filteredNodes = filterGroup 
      ? mockGraphData.nodes.filter(node => node.group === filterGroup)
      : mockGraphData.nodes;
    
    // Filter links based on filtered nodes
    const filteredNodeIds = filteredNodes.map(node => node.id);
    const filteredLinks = mockGraphData.links.filter(link => 
      filteredNodeIds.includes(link.source) && filteredNodeIds.includes(link.target)
    );
    
    // Simple force-directed layout simulation
    // In a real implementation, you would use a proper force-directed layout algorithm
    const nodePositions: {[key: string]: {x: number, y: number}} = {};
    
    // Assign initial positions in a circle
    filteredNodes.forEach((node, i) => {
      const angle = (i / filteredNodes.length) * Math.PI * 2;
      const radius = Math.min(width, height) * 0.35 * zoomLevel;
      const x = width / 2 + Math.cos(angle) * radius;
      const y = height / 2 + Math.sin(angle) * radius;
      nodePositions[node.id] = { x, y };
    });
    
    // Draw links
    filteredLinks.forEach(link => {
      const sourcePos = nodePositions[link.source];
      const targetPos = nodePositions[link.target];
      
      if (sourcePos && targetPos) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", sourcePos.x.toString());
        line.setAttribute("y1", sourcePos.y.toString());
        line.setAttribute("x2", targetPos.x.toString());
        line.setAttribute("y2", targetPos.y.toString());
        line.setAttribute("stroke", "#cbd5e1");
        line.setAttribute("stroke-width", (link.value / 2).toString());
        line.setAttribute("opacity", "0.6");
        
        svg.appendChild(line);
      }
    });
    
    // Draw nodes
    filteredNodes.forEach(node => {
      const pos = nodePositions[node.id];
      if (!pos) return;
      
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("transform", `translate(${pos.x}, ${pos.y})`);
      g.dataset.id = node.id;
      
      // Create circle for node
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("r", ((node.size || 10) / 2 * zoomLevel).toString());
      
      // Set color based on group
      let fill = "#3b82f6";  // Default blue
      if (node.group === "primary") fill = "#8b5cf6";  // Purple
      if (node.group === "science") fill = "#10b981"; // Green
      if (node.group === "madhab") fill = "#f59e0b";  // Amber
      if (node.group === "scholar") fill = "#ef4444";  // Red
      if (node.group === "book") fill = "#6366f1";  // Indigo
      
      circle.setAttribute("fill", fill);
      circle.setAttribute("opacity", "0.8");
      
      // Add text label
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.textContent = node.label;
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dy", ((node.size || 10) / 2 + 12).toString());
      text.setAttribute("font-size", (10 * zoomLevel).toString());
      text.setAttribute("fill", "#1e293b");
      
      // Add interactivity
      g.onclick = () => {
        setSelectedNode(node);
      };
      
      g.appendChild(circle);
      g.appendChild(text);
      svg.appendChild(g);
    });
    
    graphRef.current.appendChild(svg);
  };
  
  // Function to render the isnad graph
  const renderIsnadGraph = () => {
    if (!isnadRef.current) return;
    
    // Clear previous content
    isnadRef.current.innerHTML = '';
    
    // Create SVG element
    const width = isnadRef.current.clientWidth;
    const height = 500;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", width.toString());
    svg.setAttribute("height", height.toString());
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.style.overflow = "hidden";
    
    // Add a background
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", width.toString());
    rect.setAttribute("height", height.toString());
    rect.setAttribute("fill", "#f8fafc");
    svg.appendChild(rect);
    
    // Position nodes in a vertical chain
    const nodePositions: {[key: string]: {x: number, y: number}} = {};
    
    mockIsnadData.nodes.forEach((node, i) => {
      const x = width / 2;
      const y = 80 + i * 70 * zoomLevel;
      nodePositions[node.id] = { x, y };
    });
    
    // Draw links
    mockIsnadData.links.forEach(link => {
      const sourcePos = nodePositions[link.source];
      const targetPos = nodePositions[link.target];
      
      if (sourcePos && targetPos) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const d = `M ${sourcePos.x} ${sourcePos.y} C ${sourcePos.x} ${(sourcePos.y + targetPos.y) / 2}, ${targetPos.x} ${(sourcePos.y + targetPos.y) / 2}, ${targetPos.x} ${targetPos.y}`;
        path.setAttribute("d", d);
        path.setAttribute("stroke", "#cbd5e1");
        path.setAttribute("stroke-width", (link.value).toString());
        path.setAttribute("fill", "none");
        path.setAttribute("opacity", "0.6");
        
        svg.appendChild(path);
      }
    });
    
    // Draw nodes
    mockIsnadData.nodes.forEach(node => {
      const pos = nodePositions[node.id];
      if (!pos) return;
      
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("transform", `translate(${pos.x}, ${pos.y})`);
      g.dataset.id = node.id;
      
      // Create circle for node
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("r", ((node.size || 10) / 2 * zoomLevel).toString());
      
      // Set color based on group
      let fill = "#3b82f6";  // Default blue
      if (node.group === "prophet") fill = "#8b5cf6";  // Purple
      if (node.group === "companion") fill = "#10b981"; // Green
      if (node.group === "successor") fill = "#f59e0b";  // Amber
      if (node.group === "narrator") fill = "#6366f1";  // Indigo
      if (node.group === "collector") fill = "#ef4444";  // Red
      
      circle.setAttribute("fill", fill);
      circle.setAttribute("opacity", "0.8");
      
      // Add text label
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.textContent = node.label;
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dy", ((node.size || 10) / 2 + 12).toString());
      text.setAttribute("font-size", (10 * zoomLevel).toString());
      text.setAttribute("fill", "#1e293b");
      
      // Add interactivity
      g.onclick = () => {
        setSelectedNode(node);
      };
      
      g.appendChild(circle);
      g.appendChild(text);
      svg.appendChild(g);
    });
    
    isnadRef.current.appendChild(svg);
  };
  
  const handleSearch = () => {
    // In a real implementation, this would filter the graph
    console.log("Searching for:", searchTerm);
  };
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };
  
  const handleReset = () => {
    setZoomLevel(1);
    setSelectedNode(null);
    setFilterGroup(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2 rtl:space-x-reverse">
          <Input
            type="text"
            placeholder="ابحث في المعرفة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-right"
          />
          <Button type="submit" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Select value={filterGroup || ''} onValueChange={(value) => setFilterGroup(value || null)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="تصفية حسب النوع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">الكل</SelectItem>
              <SelectItem value="primary">المصادر الأساسية</SelectItem>
              <SelectItem value="science">العلوم الشرعية</SelectItem>
              <SelectItem value="madhab">المذاهب الفقهية</SelectItem>
              <SelectItem value="scholar">العلماء</SelectItem>
              <SelectItem value="book">الكتب</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleReset}>
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="knowledge" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="knowledge">شبكة المعرفة الإسلامية</TabsTrigger>
          <TabsTrigger value="isnad">سلسلة الإسناد</TabsTrigger>
        </TabsList>
        
        <TabsContent value="knowledge" className="p-0">
          <Card>
            <CardContent className="p-0 overflow-hidden">
              <div className="relative">
                <div 
                  ref={graphRef} 
                  className="w-full h-[500px] bg-gray-50"
                ></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="isnad" className="p-0">
          <Card>
            <CardHeader>
              <CardTitle>سلسلة إسناد حديث</CardTitle>
              <CardDescription>
                "من سلك طريقا يلتمس فيه علما سهل الله له به طريقا إلى الجنة"
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden">
              <div className="relative">
                <div 
                  ref={isnadRef} 
                  className="w-full h-[500px] bg-gray-50"
                ></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {selectedNode && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full 
                ${selectedNode.group === 'primary' ? 'bg-purple-100 text-purple-600' : ''}
                ${selectedNode.group === 'science' ? 'bg-green-100 text-green-600' : ''}
                ${selectedNode.group === 'madhab' ? 'bg-amber-100 text-amber-600' : ''}
                ${selectedNode.group === 'scholar' ? 'bg-red-100 text-red-600' : ''}
                ${selectedNode.group === 'book' ? 'bg-indigo-100 text-indigo-600' : ''}
                ${selectedNode.group === 'prophet' ? 'bg-purple-100 text-purple-600' : ''}
                ${selectedNode.group === 'companion' ? 'bg-green-100 text-green-600' : ''}
                ${selectedNode.group === 'successor' ? 'bg-amber-100 text-amber-600' : ''}
                ${selectedNode.group === 'narrator' ? 'bg-indigo-100 text-indigo-600' : ''}
                ${selectedNode.group === 'collector' ? 'bg-red-100 text-red-600' : ''}
              `}>
                {selectedNode.group === 'primary' && <Book className="h-6 w-6" />}
                {selectedNode.group === 'science' && <Bookmark className="h-6 w-6" />}
                {selectedNode.group === 'madhab' && <FileText className="h-6 w-6" />}
                {selectedNode.group === 'scholar' && <User className="h-6 w-6" />}
                {selectedNode.group === 'book' && <Book className="h-6 w-6" />}
                {selectedNode.group === 'prophet' && <User className="h-6 w-6" />}
                {selectedNode.group === 'companion' && <User className="h-6 w-6" />}
                {selectedNode.group === 'successor' && <User className="h-6 w-6" />}
                {selectedNode.group === 'narrator' && <User className="h-6 w-6" />}
                {selectedNode.group === 'collector' && <User className="h-6 w-6" />}
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-1">{selectedNode.label}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {selectedNode.group === 'primary' && 'مصدر تشريعي أساسي'}
                  {selectedNode.group === 'science' && 'علم شرعي'}
                  {selectedNode.group === 'madhab' && 'مذهب فقهي'}
                  {selectedNode.group === 'scholar' && 'عالم'}
                  {selectedNode.group === 'book' && 'كتاب'}
                  {selectedNode.group === 'prophet' && 'النبي صلى الله عليه وسلم'}
                  {selectedNode.group === 'companion' && 'صحابي'}
                  {selectedNode.group === 'successor' && 'تابعي'}
                  {selectedNode.group === 'narrator' && 'راوي'}
                  {selectedNode.group === 'collector' && 'محدث'}
                </p>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Info className="h-4 w-4" />
                    تفاصيل
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Share2 className="h-4 w-4" />
                    مشاركة
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Filter, 
  Download, 
  Share2, 
  Info,
  User,
  Book,
  FileText,
  Bookmark
} from 'lucide-react';

// Mock data for Islamic knowledge graph
const mockGraphData = {
  nodes: [
    // Primary sources
    { id: "quran", label: "القرآن الكريم", group: "primary", size: 30 },
    { id: "hadith", label: "الحديث الشريف", group: "primary", size: 25 },
    
    // Islamic sciences
    { id: "tafsir", label: "علم التفسير", group: "science", size: 20 },
    { id: "fiqh", label: "علم الفقه", group: "science", size: 20 },
    { id: "aqeedah", label: "علم العقيدة", group: "science", size: 20 },
    { id: "usul", label: "أصول الفقه", group: "science", size: 18 },
    { id: "mustalah", label: "مصطلح الحديث", group: "science", size: 18 },
    
    // Madhabs (Schools of thought)
    { id: "hanafi", label: "المذهب الحنفي", group: "madhab", size: 15 },
    { id: "maliki", label: "المذهب المالكي", group: "madhab", size: 15 },
    { id: "shafii", label: "المذهب الشافعي", group: "madhab", size: 15 },
    { id: "hanbali", label: "المذهب الحنبلي", group: "madhab", size: 15 },
    
    // Scholars
    { id: "bukhari", label: "الإمام البخاري", group: "scholar", size: 18 },
    { id: "muslim", label: "الإمام مسلم", group: "scholar", size: 18 },
    { id: "malik", label: "الإمام مالك", group: "scholar", size: 18 },
    { id: "abuhanifa", label: "الإمام أبو حنيفة", group: "scholar", size: 18 },
    { id: "shafii_imam", label: "الإمام الشافعي", group: "scholar", size: 18 },
    { id: "ahmad", label: "الإمام أحمد بن حنبل", group: "scholar", size: 18 },
    { id: "ibnkathir", label: "ابن كثير", group: "scholar", size: 16 },
    { id: "tabari", label: "الطبري", group: "scholar", size: 16 },
    
    // Books
    { id: "sahih_bukhari", label: "صحيح البخاري", group: "book", size: 14 },
    { id: "sahih_muslim", label: "صحيح مسلم", group: "book", size: 14 },
    { id: "muwatta", label: "الموطأ", group: "book", size: 14 },
    { id: "tafsir_ibn_kathir", label: "تفسير ابن كثير", group: "book", size: 14 },
    { id: "tafsir_tabari", label: "تفسير الطبري", group: "book", size: 14 },
  ],
  links: [
    // Primary sources to sciences
    { source: "quran", target: "tafsir", value: 5 },
    { source: "quran", target: "fiqh", value: 4 },
    { source: "quran", target: "aqeedah", value: 4 },
    { source: "hadith", target: "fiqh", value: 4 },
    { source: "hadith", target: "mustalah", value: 5 },
    { source: "hadith", target: "aqeedah", value: 3 },
    
    // Sciences relationships
    { source: "fiqh", target: "usul", value: 4 },
    
    // Madhabs to sciences
    { source: "hanafi", target: "fiqh", value: 3 },
    { source: "maliki", target: "fiqh", value: 3 },
    { source: "shafii", target: "fiqh", value: 3 },
    { source: "hanbali", target: "fiqh", value: 3 },
    { source: "hanafi", target: "usul", value: 2 },
    { source: "maliki", target: "usul", value: 2 },
    { source: "shafii", target: "usul", value: 2 },
    { source: "hanbali", target: "usul", value: 2 },
    
    // Scholars to madhabs
    { source: "abuhanifa", target: "hanafi", value: 5 },
    { source: "malik", target: "maliki", value: 5 },
    { source: "shafii_imam", target: "shafii", value: 5 },
    { source: "ahmad", target: "hanbali", value: 5 },
    
    // Scholars to sciences
    { source: "bukhari", target: "mustalah", value: 4 },
    { source: "muslim", target: "mustalah", value: 4 },
    { source: "ibnkathir", target: "tafsir", value: 4 },
    { source: "tabari", target: "tafsir", value: 4 },
    
    // Scholars to books
    { source: "bukhari", target: "sahih_bukhari", value: 5 },
    { source: "muslim", target: "sahih_muslim", value: 5 },
    { source: "malik", target: "muwatta", value: 5 },
    { source: "ibnkathir", target: "tafsir_ibn_kathir", value: 5 },
    { source: "tabari", target: "tafsir_tabari", value: 5 },
    
    // Books to sciences
    { source: "sahih_bukhari", target: "hadith", value: 4 },
    { source: "sahih_muslim", target: "hadith", value: 4 },
    { source: "muwatta", target: "hadith", value: 4 },
    { source: "tafsir_ibn_kathir", target: "tafsir", value: 4 },
    { source: "tafsir_tabari", target: "tafsir", value: 4 },
  ]
};

// Mock data for hadith isnad (chain of narration)
const mockIsnadData = {
  nodes: [
    { id: "prophet", label: "النبي ﷺ", group: "prophet", size: 35 },
    { id: "abuhurayrah", label: "أبو هريرة", group: "companion", size: 25 },
    { id: "hammam", label: "همام بن منبه", group: "successor", size: 20 },
    { id: "maamar", label: "معمر بن راشد", group: "narrator", size: 18 },
    { id: "abdulrazzaq", label: "عبد الرزاق", group: "narrator", size: 18 },
    { id: "ahmad", label: "أحمد بن حنبل", group: "narrator", size: 18 },
    { id: "bukhari", label: "البخاري", group: "collector", size: 22 },
    { id: "muslim", label: "مسلم", group: "collector", size: 22 },
  ],
  links: [
    { source: "prophet", target: "abuhurayrah", value: 5 },
    { source: "abuhurayrah", target: "hammam", value: 4 },
    { source: "hammam", target: "maamar", value: 3 },
    { source: "maamar", target: "abdulrazzaq", value: 3 },
    { source: "abdulrazzaq", target: "ahmad", value: 3 },
    { source: "ahmad", target: "bukhari", value: 2 },
    { source: "ahmad", target: "muslim", value: 2 },
  ]
};

export function KnowledgeGraphViewer() {
  const [activeTab, setActiveTab] = useState('knowledge');
  const [searchTerm, setSearchTerm] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [filterGroup, setFilterGroup] = useState<string | null>(null);
  const graphRef = useRef<HTMLDivElement>(null);
  const isnadRef = useRef<HTMLDivElement>(null);

  // Initialize the graph visualization
  useEffect(() => {
    if (activeTab === 'knowledge') {
      renderKnowledgeGraph();
    } else if (activeTab === 'isnad') {
      renderIsnadGraph();
    }
  }, [activeTab, zoomLevel, filterGroup]);

  // Function to render the knowledge graph
  const renderKnowledgeGraph = () => {
    if (!graphRef.current) return;
    
    // Clear previous content
    graphRef.current.innerHTML = '';
    
    // Create SVG element
    const width = graphRef.current.clientWidth;
    const height = 500;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", width.toString());
    svg.setAttribute("height", height.toString());
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.style.overflow = "hidden";
    
    // Add a background
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", width.toString());
    rect.setAttribute("height", height.toString());
    rect.setAttribute("fill", "#f8fafc");
    svg.appendChild(rect);
    
    // Filter nodes based on selected group
    const filteredNodes = filterGroup 
      ? mockGraphData.nodes.filter(node => node.group === filterGroup)
      : mockGraphData.nodes;
    
    // Filter links based on filtered nodes
    const filteredNodeIds = filteredNodes.map(node => node.id);
    const filteredLinks = mockGraphData.links.filter(link => 
      filteredNodeIds.includes(link.source) && filteredNodeIds.includes(link.target)
    );
    
    // Simple force-directed layout simulation
    // In a real implementation, you would use a proper force-directed layout algorithm
    const nodePositions: {[key: string]: {x: number, y: number}} = {};
    
    // Assign initial positions in a circle
    filteredNodes.forEach((node, i) => {
      const angle = (i / filteredNodes.length) * Math.PI * 2;
      const radius = Math.min(width, height) * 0.35 * zoomLevel;
      const x = width / 2 + Math.cos(angle) * radius;
      const y = height / 2 + Math.sin(angle) * radius;
      nodePositions[node.id] = { x, y };
    });
    
    // Draw links
    filteredLinks.forEach(link => {
      const sourcePos = nodePositions[link.source];
      const targetPos = nodePositions[link.target];
      
      if (sourcePos && targetPos) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", sourcePos.x.toString());
        line.setAttribute("y1", sourcePos.y.toString());
        line.setAttribute("x2", targetPos.x.toString());
        line.setAttribute("y2", targetPos.y.toString());
        line.setAttribute("stroke", "#cbd5e1");
        line.setAttribute("stroke-width", (link.value / 2).toString());
        line.setAttribute("opacity", "0.6");
        
        svg.appendChild(line);
      }
    });
    
    // Draw nodes
    filteredNodes.forEach(node => {
      const pos = nodePositions[node.id];
      if (!pos) return;
      
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("transform", `translate(${pos.x}, ${pos.y})`);
      g.dataset.id = node.id;
      
      // Create circle for node
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("r", ((node.size || 10) / 2 * zoomLevel).toString());
      
      // Set color based on group
      let fill = "#3b82f6";  // Default blue
      if (node.group === "primary") fill = "#8b5cf6";  // Purple
      if (node.group === "science") fill = "#10b981"; // Green
      if (node.group === "madhab") fill = "#f59e0b";  // Amber
      if (node.group === "scholar") fill = "#ef4444";  // Red
      if (node.group === "book") fill = "#6366f1";  // Indigo
      
      circle.setAttribute("fill", fill);
      circle.setAttribute("opacity", "0.8");
      
      // Add text label
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.textContent = node.label;
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dy", ((node.size || 10) / 2 + 12).toString());
      text.setAttribute("font-size", (10 * zoomLevel).toString());
      text.setAttribute("fill", "#1e293b");
      
      // Add interactivity
      g.onclick = () => {
        setSelectedNode(node);
      };
      
      g.appendChild(circle);
      g.appendChild(text);
      svg.appendChild(g);
    });
    
    graphRef.current.appendChild(svg);
  };
  
  // Function to render the isnad graph
  const renderIsnadGraph = () => {
    if (!isnadRef.current) return;
    
    // Clear previous content
    isnadRef.current.innerHTML = '';
    
    // Create SVG element
    const width = isnadRef.current.clientWidth;
    const height = 500;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", width.toString());
    svg.setAttribute("height", height.toString());
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.style.overflow = "hidden";
    
    // Add a background
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", width.toString());
    rect.setAttribute("height", height.toString());
    rect.setAttribute("fill", "#f8fafc");
    svg.appendChild(rect);
    
    // Position nodes in a vertical chain
    const nodePositions: {[key: string]: {x: number, y: number}} = {};
    
    mockIsnadData.nodes.forEach((node, i) => {
      const x = width / 2;
      const y = 80 + i * 70 * zoomLevel;
      nodePositions[node.id] = { x, y };
    });
    
    // Draw links
    mockIsnadData.links.forEach(link => {
      const sourcePos = nodePositions[link.source];
      const targetPos = nodePositions[link.target];
      
      if (sourcePos && targetPos) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const d = `M ${sourcePos.x} ${sourcePos.y} C ${sourcePos.x} ${(sourcePos.y + targetPos.y) / 2}, ${targetPos.x} ${(sourcePos.y + targetPos.y) / 2}, ${targetPos.x} ${targetPos.y}`;
        path.setAttribute("d", d);
        path.setAttribute("stroke", "#cbd5e1");
        path.setAttribute("stroke-width", (link.value).toString());
        path.setAttribute("fill", "none");
        path.setAttribute("opacity", "0.6");
        
        svg.appendChild(path);
      }
    });
    
    // Draw nodes
    mockIsnadData.nodes.forEach(node => {
      const pos = nodePositions[node.id];
      if (!pos) return;
      
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("transform", `translate(${pos.x}, ${pos.y})`);
      g.dataset.id = node.id;
      
      // Create circle for node
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("r", ((node.size || 10) / 2 * zoomLevel).toString());
      
      // Set color based on group
      let fill = "#3b82f6";  // Default blue
      if (node.group === "prophet") fill = "#8b5cf6";  // Purple
      if (node.group === "companion") fill = "#10b981"; // Green
      if (node.group === "successor") fill = "#f59e0b";  // Amber
      if (node.group === "narrator") fill = "#6366f1";  // Indigo
      if (node.group === "collector") fill = "#ef4444";  // Red
      
      circle.setAttribute("fill", fill);
      circle.setAttribute("opacity", "0.8");
      
      // Add text label
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.textContent = node.label;
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dy", ((node.size || 10) / 2 + 12).toString());
      text.setAttribute("font-size", (10 * zoomLevel).toString());
      text.setAttribute("fill", "#1e293b");
      
      // Add interactivity
      g.onclick = () => {
        setSelectedNode(node);
      };
      
      g.appendChild(circle);
      g.appendChild(text);
      svg.appendChild(g);
    });
    
    isnadRef.current.appendChild(svg);
  };
  
  const handleSearch = () => {
    // In a real implementation, this would filter the graph
    console.log("Searching for:", searchTerm);
  };
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };
  
  const handleReset = () => {
    setZoomLevel(1);
    setSelectedNode(null);
    setFilterGroup(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2 rtl:space-x-reverse">
          <Input
            type="text"
            placeholder="ابحث في المعرفة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-right"
          />
          <Button type="submit" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Select value={filterGroup || ''} onValueChange={(value) => setFilterGroup(value || null)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="تصفية حسب النوع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">الكل</SelectItem>
              <SelectItem value="primary">المصادر الأساسية</SelectItem>
              <SelectItem value="science">العلوم الشرعية</SelectItem>
              <SelectItem value="madhab">المذاهب الفقهية</SelectItem>
              <SelectItem value="scholar">العلماء</SelectItem>
              <SelectItem value="book">الكتب</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleReset}>
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="knowledge" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="knowledge">شبكة المعرفة الإسلامية</TabsTrigger>
          <TabsTrigger value="isnad">سلسلة الإسناد</TabsTrigger>
        </TabsList>
        
        <TabsContent value="knowledge" className="p-0">
          <Card>
            <CardContent className="p-0 overflow-hidden">
              <div className="relative">
                <div 
                  ref={graphRef} 
                  className="w-full h-[500px] bg-gray-50"
                ></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="isnad" className="p-0">
          <Card>
            <CardHeader>
              <CardTitle>سلسلة إسناد حديث</CardTitle>
              <CardDescription>
                "من سلك طريقا يلتمس فيه علما سهل الله له به طريقا إلى الجنة"
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden">
              <div className="relative">
                <div 
                  ref={isnadRef} 
                  className="w-full h-[500px] bg-gray-50"
                ></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {selectedNode && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full 
                ${selectedNode.group === 'primary' ? 'bg-purple-100 text-purple-600' : ''}
                ${selectedNode.group === 'science' ? 'bg-green-100 text-green-600' : ''}
                ${selectedNode.group === 'madhab' ? 'bg-amber-100 text-amber-600' : ''}
                ${selectedNode.group === 'scholar' ? 'bg-red-100 text-red-600' : ''}
                ${selectedNode.group === 'book' ? 'bg-indigo-100 text-indigo-600' : ''}
                ${selectedNode.group === 'prophet' ? 'bg-purple-100 text-purple-600' : ''}
                ${selectedNode.group === 'companion' ? 'bg-green-100 text-green-600' : ''}
                ${selectedNode.group === 'successor' ? 'bg-amber-100 text-amber-600' : ''}
                ${selectedNode.group === 'narrator' ? 'bg-indigo-100 text-indigo-600' : ''}
                ${selectedNode.group === 'collector' ? 'bg-red-100 text-red-600' : ''}
              `}>
                {selectedNode.group === 'primary' && <Book className="h-6 w-6" />}
                {selectedNode.group === 'science' && <Bookmark className="h-6 w-6" />}
                {selectedNode.group === 'madhab' && <FileText className="h-6 w-6" />}
                {selectedNode.group === 'scholar' && <User className="h-6 w-6" />}
                {selectedNode.group === 'book' && <Book className="h-6 w-6" />}
                {selectedNode.group === 'prophet' && <User className="h-6 w-6" />}
                {selectedNode.group === 'companion' && <User className="h-6 w-6" />}
                {selectedNode.group === 'successor' && <User className="h-6 w-6" />}
                {selectedNode.group === 'narrator' && <User className="h-6 w-6" />}
                {selectedNode.group === 'collector' && <User className="h-6 w-6" />}
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-1">{selectedNode.label}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {selectedNode.group === 'primary' && 'مصدر تشريعي أساسي'}
                  {selectedNode.group === 'science' && 'علم شرعي'}
                  {selectedNode.group === 'madhab' && 'مذهب فقهي'}
                  {selectedNode.group === 'scholar' && 'عالم'}
                  {selectedNode.group === 'book' && 'كتاب'}
                  {selectedNode.group === 'prophet' && 'النبي صلى الله عليه وسلم'}
                  {selectedNode.group === 'companion' && 'صحابي'}
                  {selectedNode.group === 'successor' && 'تابعي'}
                  {selectedNode.group === 'narrator' && 'راوي'}
                  {selectedNode.group === 'collector' && 'محدث'}
                </p>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Info className="h-4 w-4" />
                    تفاصيل
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Share2 className="h-4 w-4" />
                    مشاركة
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Filter, 
  Download, 
  Share2, 
  Info,
  User,
  Book,
  FileText,
  Bookmark
} from 'lucide-react';

// Mock data for Islamic knowledge graph
const mockGraphData = {
  nodes: [
    // Primary sources
    { id: "quran", label: "القرآن الكريم", group: "primary", size: 30 },
    { id: "hadith", label: "الحديث الشريف", group: "primary", size: 25 },
    
    // Islamic sciences
    { id: "tafsir", label: "علم التفسير", group: "science", size: 20 },
    { id: "fiqh", label: "علم الفقه", group: "science", size: 20 },
    { id: "aqeedah", label: "علم العقيدة", group: "science", size: 20 },
    { id: "usul", label: "أصول الفقه", group: "science", size: 18 },
    { id: "mustalah", label: "مصطلح الحديث", group: "science", size: 18 },
    
    // Madhabs (Schools of thought)
    { id: "hanafi", label: "المذهب الحنفي", group: "madhab", size: 15 },
    { id: "maliki", label: "المذهب المالكي", group: "madhab", size: 15 },
    { id: "shafii", label: "المذهب الشافعي", group: "madhab", size: 15 },
    { id: "hanbali", label: "المذهب الحنبلي", group: "madhab", size: 15 },
    
    // Scholars
    { id: "bukhari", label: "الإمام البخاري", group: "scholar", size: 18 },
    { id: "muslim", label: "الإمام مسلم", group: "scholar", size: 18 },
    { id: "malik", label: "الإمام مالك", group: "scholar", size: 18 },
    { id: "abuhanifa", label: "الإمام أبو حنيفة", group: "scholar", size: 18 },
    { id: "shafii_imam", label: "الإمام الشافعي", group: "scholar", size: 18 },
    { id: "ahmad", label: "الإمام أحمد بن حنبل", group: "scholar", size: 18 },
    { id: "ibnkathir", label: "ابن كثير", group: "scholar", size: 16 },
    { id: "tabari", label: "الطبري", group: "scholar", size: 16 },
    
    // Books
    { id: "sahih_bukhari", label: "صحيح البخاري", group: "book", size: 14 },
    { id: "sahih_muslim", label: "صحيح مسلم", group: "book", size: 14 },
    { id: "muwatta", label: "الموطأ", group: "book", size: 14 },
    { id: "tafsir_ibn_kathir", label: "تفسير ابن كثير", group: "book", size: 14 },
    { id: "tafsir_tabari", label: "تفسير الطبري", group: "book", size: 14 },
  ],
  links: [
    // Primary sources to sciences
    { source: "quran", target: "tafsir", value: 5 },
    { source: "quran", target: "fiqh", value: 4 },
    { source: "quran", target: "aqeedah", value: 4 },
    { source: "hadith", target: "fiqh", value: 4 },
    { source: "hadith", target: "mustalah", value: 5 },
    { source: "hadith", target: "aqeedah", value: 3 },
    
    // Sciences relationships
    { source: "fiqh", target: "usul", value: 4 },
    
    // Madhabs to sciences
    { source: "hanafi", target: "fiqh", value: 3 },
    { source: "maliki", target: "fiqh", value: 3 },
    { source: "shafii", target: "fiqh", value: 3 },
    { source: "hanbali", target: "fiqh", value: 3 },
    { source: "hanafi", target: "usul", value: 2 },
    { source: "maliki", target: "usul", value: 2 },
    { source: "shafii", target: "usul", value: 2 },
    { source: "hanbali", target: "usul", value: 2 },
    
    // Scholars to madhabs
    { source: "abuhanifa", target: "hanafi", value: 5 },
    { source: "malik", target: "maliki", value: 5 },
    { source: "shafii_imam", target: "shafii", value: 5 },
    { source: "ahmad", target: "hanbali", value: 5 },
    
    // Scholars to sciences
    { source: "bukhari", target: "mustalah", value: 4 },
    { source: "muslim", target: "mustalah", value: 4 },
    { source: "ibnkathir", target: "tafsir", value: 4 },
    { source: "tabari", target: "tafsir", value: 4 },
    
    // Scholars to books
    { source: "bukhari", target: "sahih_bukhari", value: 5 },
    { source: "muslim", target: "sahih_muslim", value: 5 },
    { source: "malik", target: "muwatta", value: 5 },
    { source: "ibnkathir", target: "tafsir_ibn_kathir", value: 5 },
    { source: "tabari", target: "tafsir_tabari", value: 5 },
    
    // Books to sciences
    { source: "sahih_bukhari", target: "hadith", value: 4 },
    { source: "sahih_muslim", target: "hadith", value: 4 },
    { source: "muwatta", target: "hadith", value: 4 },
    { source: "tafsir_ibn_kathir", target: "tafsir", value: 4 },
    { source: "tafsir_tabari", target: "tafsir", value: 4 },
  ]
};

// Mock data for hadith isnad (chain of narration)
const mockIsnadData = {
  nodes: [
    { id: "prophet", label: "النبي ﷺ", group: "prophet", size: 35 },
    { id: "abuhurayrah", label: "أبو هريرة", group: "companion", size: 25 },
    { id: "hammam", label: "همام بن منبه", group: "successor", size: 20 },
    { id: "maamar", label: "معمر بن راشد", group: "narrator", size: 18 },
    { id: "abdulrazzaq", label: "عبد الرزاق", group: "narrator", size: 18 },
    { id: "ahmad", label: "أحمد بن حنبل", group: "narrator", size: 18 },
    { id: "bukhari", label: "البخاري", group: "collector", size: 22 },
    { id: "muslim", label: "مسلم", group: "collector", size: 22 },
  ],
  links: [
    { source: "prophet", target: "abuhurayrah", value: 5 },
    { source: "abuhurayrah", target: "hammam", value: 4 },
    { source: "hammam", target: "maamar", value: 3 },
    { source: "maamar", target: "abdulrazzaq", value: 3 },
    { source: "abdulrazzaq", target: "ahmad", value: 3 },
    { source: "ahmad", target: "bukhari", value: 2 },
    { source: "ahmad", target: "muslim", value: 2 },
  ]
};

export function KnowledgeGraphViewer() {
  const [activeTab, setActiveTab] = useState('knowledge');
  const [searchTerm, setSearchTerm] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [filterGroup, setFilterGroup] = useState<string | null>(null);
  const graphRef = useRef<HTMLDivElement>(null);
  const isnadRef = useRef<HTMLDivElement>(null);

  // Initialize the graph visualization
  useEffect(() => {
    if (activeTab === 'knowledge') {
      renderKnowledgeGraph();
    } else if (activeTab === 'isnad') {
      renderIsnadGraph();
    }
  }, [activeTab, zoomLevel, filterGroup]);

  // Function to render the knowledge graph
  const renderKnowledgeGraph = () => {
    if (!graphRef.current) return;
    
    // Clear previous content
    graphRef.current.innerHTML = '';
    
    // Create SVG element
    const width = graphRef.current.clientWidth;
    const height = 500;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", width.toString());
    svg.setAttribute("height", height.toString());
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.style.overflow = "hidden";
    
    // Add a background
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", width.toString());
    rect.setAttribute("height", height.toString());
    rect.setAttribute("fill", "#f8fafc");
    svg.appendChild(rect);
    
    // Filter nodes based on selected group
    const filteredNodes = filterGroup 
      ? mockGraphData.nodes.filter(node => node.group === filterGroup)
      : mockGraphData.nodes;
    
    // Filter links based on filtered nodes
    const filteredNodeIds = filteredNodes.map(node => node.id);
    const filteredLinks = mockGraphData.links.filter(link => 
      filteredNodeIds.includes(link.source) && filteredNodeIds.includes(link.target)
    );
    
    // Simple force-directed layout simulation
    // In a real implementation, you would use a proper force-directed layout algorithm
    const nodePositions: {[key: string]: {x: number, y: number}} = {};
    
    // Assign initial positions in a circle
    filteredNodes.forEach((node, i) => {
      const angle = (i / filteredNodes.length) * Math.PI * 2;
      const radius = Math.min(width, height) * 0.35 * zoomLevel;
      const x = width / 2 + Math.cos(angle) * radius;
      const y = height / 2 + Math.sin(angle) * radius;
      nodePositions[node.id] = { x, y };
    });
    
    // Draw links
    filteredLinks.forEach(link => {
      const sourcePos = nodePositions[link.source];
      const targetPos = nodePositions[link.target];
      
      if (sourcePos && targetPos) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", sourcePos.x.toString());
        line.setAttribute("y1", sourcePos.y.toString());
        line.setAttribute("x2", targetPos.x.toString());
        line.setAttribute("y2", targetPos.y.toString());
        line.setAttribute("stroke", "#cbd5e1");
        line.setAttribute("stroke-width", (link.value / 2).toString());
        line.setAttribute("opacity", "0.6");
        
        svg.appendChild(line);
      }
    });
    
    // Draw nodes
    filteredNodes.forEach(node => {
      const pos = nodePositions[node.id];
      if (!pos) return;
      
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("transform", `translate(${pos.x}, ${pos.y})`);
      g.dataset.id = node.id;
      
      // Create circle for node
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("r", ((node.size || 10) / 2 * zoomLevel).toString());
      
      // Set color based on group
      let fill = "#3b82f6";  // Default blue
      if (node.group === "primary") fill = "#8b5cf6";  // Purple
      if (node.group === "science") fill = "#10b981"; // Green
      if (node.group === "madhab") fill = "#f59e0b";  // Amber
      if (node.group === "scholar") fill = "#ef4444";  // Red
      if (node.group === "book") fill = "#6366f1";  // Indigo
      
      circle.setAttribute("fill", fill);
      circle.setAttribute("opacity", "0.8");
      
      // Add text label
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.textContent = node.label;
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dy", ((node.size || 10) / 2 + 12).toString());
      text.setAttribute("font-size", (10 * zoomLevel).toString());
      text.setAttribute("fill", "#1e293b");
      
      // Add interactivity
      g.onclick = () => {
        setSelectedNode(node);
      };
      
      g.appendChild(circle);
      g.appendChild(text);
      svg.appendChild(g);
    });
    
    graphRef.current.appendChild(svg);
  };
  
  // Function to render the isnad graph
  const renderIsnadGraph = () => {
    if (!isnadRef.current) return;
    
    // Clear previous content
    isnadRef.current.innerHTML = '';
    
    // Create SVG element
    const width = isnadRef.current.clientWidth;
    const height = 500;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", width.toString());
    svg.setAttribute("height", height.toString());
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.style.overflow = "hidden";
    
    // Add a background
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", width.toString());
    rect.setAttribute("height", height.toString());
    rect.setAttribute("fill", "#f8fafc");
    svg.appendChild(rect);
    
    // Position nodes in a vertical chain
    const nodePositions: {[key: string]: {x: number, y: number}} = {};
    
    mockIsnadData.nodes.forEach((node, i) => {
      const x = width / 2;
      const y = 80 + i * 70 * zoomLevel;
      nodePositions[node.id] = { x, y };
    });
    
    // Draw links
    mockIsnadData.links.forEach(link => {
      const sourcePos = nodePositions[link.source];
      const targetPos = nodePositions[link.target];
      
      if (sourcePos && targetPos) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const d = `M ${sourcePos.x} ${sourcePos.y} C ${sourcePos.x} ${(sourcePos.y + targetPos.y) / 2}, ${targetPos.x} ${(sourcePos.y + targetPos.y) / 2}, ${targetPos.x} ${targetPos.y}`;
        path.setAttribute("d", d);
        path.setAttribute("stroke", "#cbd5e1");
        path.setAttribute("stroke-width", (link.value).toString());
        path.setAttribute("fill", "none");
        path.setAttribute("opacity", "0.6");
        
        svg.appendChild(path);
      }
    });
    
    // Draw nodes
    mockIsnadData.nodes.forEach(node => {
      const pos = nodePositions[node.id];
      if (!pos) return;
      
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("transform", `translate(${pos.x}, ${pos.y})`);
      g.dataset.id = node.id;
      
      // Create circle for node
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("r", ((node.size || 10) / 2 * zoomLevel).toString());
      
      // Set color based on group
      let fill = "#3b82f6";  // Default blue
      if (node.group === "prophet") fill = "#8b5cf6";  // Purple
      if (node.group === "companion") fill = "#10b981"; // Green
      if (node.group === "successor") fill = "#f59e0b";  // Amber
      if (node.group === "narrator") fill = "#6366f1";  // Indigo
      if (node.group === "collector") fill = "#ef4444";  // Red
      
      circle.setAttribute("fill", fill);
      circle.setAttribute("opacity", "0.8");
      
      // Add text label
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.textContent = node.label;
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dy", ((node.size || 10) / 2 + 12).toString());
      text.setAttribute("font-size", (10 * zoomLevel).toString());
      text.setAttribute("fill", "#1e293b");
      
      // Add interactivity
      g.onclick = () => {
        setSelectedNode(node);
      };
      
      g.appendChild(circle);
      g.appendChild(text);
      svg.appendChild(g);
    });
    
    isnadRef.current.appendChild(svg);
  };
  
  const handleSearch = () => {
    // In a real implementation, this would filter the graph
    console.log("Searching for:", searchTerm);
  };
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };
  
  const handleReset = () => {
    setZoomLevel(1);
    setSelectedNode(null);
    setFilterGroup(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2 rtl:space-x-reverse">
          <Input
            type="text"
            placeholder="ابحث في المعرفة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-right"
          />
          <Button type="submit" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Select value={filterGroup || ''} onValueChange={(value) => setFilterGroup(value || null)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="تصفية حسب النوع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">الكل</SelectItem>
              <SelectItem value="primary">المصادر الأساسية</SelectItem>
              <SelectItem value="science">العلوم الشرعية</SelectItem>
              <SelectItem value="madhab">المذاهب الفقهية</SelectItem>
              <SelectItem value="scholar">العلماء</SelectItem>
              <SelectItem value="book">الكتب</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleReset}>
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="knowledge" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="knowledge">شبكة المعرفة الإسلامية</TabsTrigger>
          <TabsTrigger value="isnad">سلسلة الإسناد</TabsTrigger>
        </TabsList>
        
        <TabsContent value="knowledge" className="p-0">
          <Card>
            <CardContent className="p-0 overflow-hidden">
              <div className="relative">
                <div 
                  ref={graphRef} 
                  className="w-full h-[500px] bg-gray-50"
                ></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="isnad" className="p-0">
          <Card>
            <CardHeader>
              <CardTitle>سلسلة إسناد حديث</CardTitle>
              <CardDescription>
                "من سلك طريقا يلتمس فيه علما سهل الله له به طريقا إلى الجنة"
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden">
              <div className="relative">
                <div 
                  ref={isnadRef} 
                  className="w-full h-[500px] bg-gray-50"
                ></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {selectedNode && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full 
                ${selectedNode.group === 'primary' ? 'bg-purple-100 text-purple-600' : ''}
                ${selectedNode.group === 'science' ? 'bg-green-100 text-green-600' : ''}
                ${selectedNode.group === 'madhab' ? 'bg-amber-100 text-amber-600' : ''}
                ${selectedNode.group === 'scholar' ? 'bg-red-100 text-red-600' : ''}
                ${selectedNode.group === 'book' ? 'bg-indigo-100 text-indigo-600' : ''}
                ${selectedNode.group === 'prophet' ? 'bg-purple-100 text-purple-600' : ''}
                ${selectedNode.group === 'companion' ? 'bg-green-100 text-green-600' : ''}
                ${selectedNode.group === 'successor' ? 'bg-amber-100 text-amber-600' : ''}
                ${selectedNode.group === 'narrator' ? 'bg-indigo-100 text-indigo-600' : ''}
                ${selectedNode.group === 'collector' ? 'bg-red-100 text-red-600' : ''}
              `}>
                {selectedNode.group === 'primary' && <Book className="h-6 w-6" />}
                {selectedNode.group === 'science' && <Bookmark className="h-6 w-6" />}
                {selectedNode.group === 'madhab' && <FileText className="h-6 w-6" />}
                {selectedNode.group === 'scholar' && <User className="h-6 w-6" />}
                {selectedNode.group === 'book' && <Book className="h-6 w-6" />}
                {selectedNode.group === 'prophet' && <User className="h-6 w-6" />}
                {selectedNode.group === 'companion' && <User className="h-6 w-6" />}
                {selectedNode.group === 'successor' && <User className="h-6 w-6" />}
                {selectedNode.group === 'narrator' && <User className="h-6 w-6" />}
                {selectedNode.group === 'collector' && <User className="h-6 w-6" />}
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-1">{selectedNode.label}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {selectedNode.group === 'primary' && 'مصدر تشريعي أساسي'}
                  {selectedNode.group === 'science' && 'علم شرعي'}
                  {selectedNode.group === 'madhab' && 'مذهب فقهي'}
                  {selectedNode.group === 'scholar' && 'عالم'}
                  {selectedNode.group === 'book' && 'كتاب'}
                  {selectedNode.group === 'prophet' && 'النبي صلى الله عليه وسلم'}
                  {selectedNode.group === 'companion' && 'صحابي'}
                  {selectedNode.group === 'successor' && 'تابعي'}
                  {selectedNode.group === 'narrator' && 'راوي'}
                  {selectedNode.group === 'collector' && 'محدث'}
                </p>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Info className="h-4 w-4" />
                    تفاصيل
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Share2 className="h-4 w-4" />
                    مشاركة
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Filter, 
  Download, 
  Share2, 
  Info,
  User,
  Book,
  FileText,
  Bookmark
} from 'lucide-react';

// Mock data for Islamic knowledge graph
const mockGraphData = {
  nodes: [
    // Primary sources
    { id: "quran", label: "القرآن الكريم", group: "primary", size: 30 },
    { id: "hadith", label: "الحديث الشريف", group: "primary", size: 25 },
    
    // Islamic sciences
    { id: "tafsir", label: "علم التفسير", group: "science", size: 20 },
    { id: "fiqh", label: "علم الفقه", group: "science", size: 20 },
    { id: "aqeedah", label: "علم العقيدة", group: "science", size: 20 },
    { id: "usul", label: "أصول الفقه", group: "science", size: 18 },
    { id: "mustalah", label: "مصطلح الحديث", group: "science", size: 18 },
    
    // Madhabs (Schools of thought)
    { id: "hanafi", label: "المذهب الحنفي", group: "madhab", size: 15 },
    { id: "maliki", label: "المذهب المالكي", group: "madhab", size: 15 },
    { id: "shafii", label: "المذهب الشافعي", group: "madhab", size: 15 },
    { id: "hanbali", label: "المذهب الحنبلي", group: "madhab", size: 15 },
    
    // Scholars
    { id: "bukhari", label: "الإمام البخاري", group: "scholar", size: 18 },
    { id: "muslim", label: "الإمام مسلم", group: "scholar", size: 18 },
    { id: "malik", label: "الإمام مالك", group: "scholar", size: 18 },
    { id: "abuhanifa", label: "الإمام أبو حنيفة", group: "scholar", size: 18 },
    { id: "shafii_imam", label: "الإمام الشافعي", group: "scholar", size: 18 },
    { id: "ahmad", label: "الإمام أحمد بن حنبل", group: "scholar", size: 18 },
    { id: "ibnkathir", label: "ابن كثير", group: "scholar", size: 16 },
    { id: "tabari", label: "الطبري", group: "scholar", size: 16 },
    
    // Books
    { id: "sahih_bukhari", label: "صحيح البخاري", group: "book", size: 14 },
    { id: "sahih_muslim", label: "صحيح مسلم", group: "book", size: 14 },
    { id: "muwatta", label: "الموطأ", group: "book", size: 14 },
    { id: "tafsir_ibn_kathir", label: "تفسير ابن كثير", group: "book", size: 14 },
    { id: "tafsir_tabari", label: "تفسير الطبري", group: "book", size: 14 },
  ],
  links: [
    // Primary sources to sciences
    { source: "quran", target: "tafsir", value: 5 },
    { source: "quran", target: "fiqh", value: 4 },
    { source: "quran", target: "aqeedah", value: 4 },
    { source: "hadith", target: "fiqh", value: 4 },
    { source: "hadith", target: "mustalah", value: 5 },
    { source: "hadith", target: "aqeedah", value: 3 },
    
    // Sciences relationships
    { source: "fiqh", target: "usul", value: 4 },
    
    // Madhabs to sciences
    { source: "hanafi", target: "fiqh", value: 3 },
    { source: "maliki", target: "fiqh", value: 3 },
    { source: "shafii", target: "fiqh", value: 3 },
    { source: "hanbali", target: "fiqh", value: 3 },
    { source: "hanafi", target: "usul", value: 2 },
    { source: "maliki", target: "usul", value: 2 },
    { source: "shafii", target: "usul", value: 2 },
    { source: "hanbali", target: "usul", value: 2 },
    
    // Scholars to madhabs
    { source: "abuhanifa", target: "hanafi", value: 5 },
    { source: "malik", target: "maliki", value: 5 },
    { source: "shafii_imam", target: "shafii", value: 5 },
    { source: "ahmad", target: "hanbali", value: 5 },
    
    // Scholars to sciences
    { source: "bukhari", target: "mustalah", value: 4 },
    { source: "muslim", target: "mustalah", value: 4 },
    { source: "ibnkathir", target: "tafsir", value: 4 },
    { source: "tabari", target: "tafsir", value: 4 },
    
    // Scholars to books
    { source: "bukhari", target: "sahih_bukhari", value: 5 },
    { source: "muslim", target: "sahih_muslim", value: 5 },
    { source: "malik", target: "muwatta", value: 5 },
    { source: "ibnkathir", target: "tafsir_ibn_kathir", value: 5 },
    { source: "tabari", target: "tafsir_tabari", value: 5 },
    
    // Books to sciences
    { source: "sahih_bukhari", target: "hadith", value: 4 },
    { source: "sahih_muslim", target: "hadith", value: 4 },
    { source: "muwatta", target: "hadith", value: 4 },
    { source: "tafsir_ibn_kathir", target: "tafsir", value: 4 },
    { source: "tafsir_tabari", target: "tafsir", value: 4 },
  ]
};

// Mock data for hadith isnad (chain of narration)
const mockIsnadData = {
  nodes: [
    { id: "prophet", label: "النبي ﷺ", group: "prophet", size: 35 },
    { id: "abuhurayrah", label: "أبو هريرة", group: "companion", size: 25 },
    { id: "hammam", label: "همام بن منبه", group: "successor", size: 20 },
    { id: "maamar", label: "معمر بن راشد", group: "narrator", size: 18 },
    { id: "abdulrazzaq", label: "عبد الرزاق", group: "narrator", size: 18 },
    { id: "ahmad", label: "أحمد بن حنبل", group: "narrator", size: 18 },
    { id: "bukhari", label: "البخاري", group: "collector", size: 22 },
    { id: "muslim", label: "مسلم", group: "collector", size: 22 },
  ],
  links: [
    { source: "prophet", target: "abuhurayrah", value: 5 },
    { source: "abuhurayrah", target: "hammam", value: 4 },
    { source: "hammam", target: "maamar", value: 3 },
    { source: "maamar", target: "abdulrazzaq", value: 3 },
    { source: "abdulrazzaq", target: "ahmad", value: 3 },
    { source: "ahmad", target: "bukhari", value: 2 },
    { source: "ahmad", target: "muslim", value: 2 },
  ]
};

export function KnowledgeGraphViewer() {
  const [activeTab, setActiveTab] = useState('knowledge');
  const [searchTerm, setSearchTerm] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [filterGroup, setFilterGroup] = useState<string | null>(null);
  const graphRef = useRef<HTMLDivElement>(null);
  const isnadRef = useRef<HTMLDivElement>(null);

  // Initialize the graph visualization
  useEffect(() => {
    if (activeTab === 'knowledge') {
      renderKnowledgeGraph();
    } else if (activeTab === 'isnad') {
      renderIsnadGraph();
    }
  }, [activeTab, zoomLevel, filterGroup]);

  // Function to render the knowledge graph
  const renderKnowledgeGraph = () => {
    if (!graphRef.current) return;
    
    // Clear previous content
    graphRef.current.innerHTML = '';
    
    // Create SVG element
    const width = graphRef.current.clientWidth;
    const height = 500;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", width.toString());
    svg.setAttribute("height", height.toString());
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.style.overflow = "hidden";
    
    // Add a background
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", width.toString());
    rect.setAttribute("height", height.toString());
    rect.setAttribute("fill", "#f8fafc");
    svg.appendChild(rect);
    
    // Filter nodes based on selected group
    const filteredNodes = filterGroup 
      ? mockGraphData.nodes.filter(node => node.group === filterGroup)
      : mockGraphData.nodes;
    
    // Filter links based on filtered nodes
    const filteredNodeIds = filteredNodes.map(node => node.id);
    const filteredLinks = mockGraphData.links.filter(link => 
      filteredNodeIds.includes(link.source) && filteredNodeIds.includes(link.target)
    );
    
    // Simple force-directed layout simulation
    // In a real implementation, you would use a proper force-directed layout algorithm
    const nodePositions: {[key: string]: {x: number, y: number}} = {};
    
    // Assign initial positions in a circle
    filteredNodes.forEach((node, i) => {
      const angle = (i / filteredNodes.length) * Math.PI * 2;
      const radius = Math.min(width, height) * 0.35 * zoomLevel;
      const x = width / 2 + Math.cos(angle) * radius;
      const y = height / 2 + Math.sin(angle) * radius;
      nodePositions[node.id] = { x, y };
    });
    
    // Draw links
    filteredLinks.forEach(link => {
      const sourcePos = nodePositions[link.source];
      const targetPos = nodePositions[link.target];
      
      if (sourcePos && targetPos) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", sourcePos.x.toString());
        line.setAttribute("y1", sourcePos.y.toString());
        line.setAttribute("x2", targetPos.x.toString());
        line.setAttribute("y2", targetPos.y.toString());
        line.setAttribute("stroke", "#cbd5e1");
        line.setAttribute("stroke-width", (link.value / 2).toString());
        line.setAttribute("opacity", "0.6");
        
        svg.appendChild(line);
      }
    });
    
    // Draw nodes
    filteredNodes.forEach(node => {
      const pos = nodePositions[node.id];
      if (!pos) return;
      
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("transform", `translate(${pos.x}, ${pos.y})`);
      g.dataset.id = node.id;
      
      // Create circle for node
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("r", ((node.size || 10) / 2 * zoomLevel).toString());
      
      // Set color based on group
      let fill = "#3b82f6";  // Default blue
      if (node.group === "primary") fill = "#8b5cf6";  // Purple
      if (node.group === "science") fill = "#10b981"; // Green
      if (node.group === "madhab") fill = "#f59e0b";  // Amber
      if (node.group === "scholar") fill = "#ef4444";  // Red
      if (node.group === "book") fill = "#6366f1";  // Indigo
      
      circle.setAttribute("fill", fill);
      circle.setAttribute("opacity", "0.8");
      
      // Add text label
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.textContent = node.label;
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dy", ((node.size || 10) / 2 + 12).toString());
      text.setAttribute("font-size", (10 * zoomLevel).toString());
      text.setAttribute("fill", "#1e293b");
      
      // Add interactivity
      g.onclick = () => {
        setSelectedNode(node);
      };
      
      g.appendChild(circle);
      g.appendChild(text);
      svg.appendChild(g);
    });
    
    graphRef.current.appendChild(svg);
  };
  
  // Function to render the isnad graph
  const renderIsnadGraph = () => {
    if (!isnadRef.current) return;
    
    // Clear previous content
    isnadRef.current.innerHTML = '';
    
    // Create SVG element
    const width = isnadRef.current.clientWidth;
    const height = 500;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", width.toString());
    svg.setAttribute("height", height.toString());
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.style.overflow = "hidden";
    
    // Add a background
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", width.toString());
    rect.setAttribute("height", height.toString());
    rect.setAttribute("fill", "#f8fafc");
    svg.appendChild(rect);
    
    // Position nodes in a vertical chain
    const nodePositions: {[key: string]: {x: number, y: number}} = {};
    
    mockIsnadData.nodes.forEach((node, i) => {
      const x = width / 2;
      const y = 80 + i * 70 * zoomLevel;
      nodePositions[node.id] = { x, y };
    });
    
    // Draw links
    mockIsnadData.links.forEach(link => {
      const sourcePos = nodePositions[link.source];
      const targetPos = nodePositions[link.target];
      
      if (sourcePos && targetPos) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const d = `M ${sourcePos.x} ${sourcePos.y} C ${sourcePos.x} ${(sourcePos.y + targetPos.y) / 2}, ${targetPos.x} ${(sourcePos.y + targetPos.y) / 2}, ${targetPos.x} ${targetPos.y}`;
        path.setAttribute("d", d);
        path.setAttribute("stroke", "#cbd5e1");
        path.setAttribute("stroke-width", (link.value).toString());
        path.setAttribute("fill", "none");
        path.setAttribute("opacity", "0.6");
        
        svg.appendChild(path);
      }
    });
    
    // Draw nodes
    mockIsnadData.nodes.forEach(node => {
      const pos = nodePositions[node.id];
      if (!pos) return;
      
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("transform", `translate(${pos.x}, ${pos.y})`);
      g.dataset.id = node.id;
      
      // Create circle for node
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("r", ((node.size || 10) / 2 * zoomLevel).toString());
      
      // Set color based on group
      let fill = "#3b82f6";  // Default blue
      if (node.group === "prophet") fill = "#8b5cf6";  // Purple
      if (node.group === "companion") fill = "#10b981"; // Green
      if (node.group === "successor") fill = "#f59e0b";  // Amber
      if (node.group === "narrator") fill = "#6366f1";  // Indigo
      if (node.group === "collector") fill = "#ef4444";  // Red
      
      circle.setAttribute("fill", fill);
      circle.setAttribute("opacity", "0.8");
      
      // Add text label
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.textContent = node.label;
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dy", ((node.size || 10) / 2 + 12).toString());
      text.setAttribute("font-size", (10 * zoomLevel).toString());
      text.setAttribute("fill", "#1e293b");
      
      // Add interactivity
      g.onclick = () => {
        setSelectedNode(node);
      };
      
      g.appendChild(circle);
      g.appendChild(text);
      svg.appendChild(g);
    });
    
    isnadRef.current.appendChild(svg);
  };
  
  const handleSearch = () => {
    // In a real implementation, this would filter the graph
    console.log("Searching for:", searchTerm);
  };
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };
  
  const handleReset = () => {
    setZoomLevel(1);
    setSelectedNode(null);
    setFilterGroup(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2 rtl:space-x-reverse">
          <Input
            type="text"
            placeholder="ابحث في المعرفة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-right"
          />
          <Button type="submit" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Select value={filterGroup || ''} onValueChange={(value) => setFilterGroup(value || null)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="تصفية حسب النوع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">الكل</SelectItem>
              <SelectItem value="primary">المصادر الأساسية</SelectItem>
              <SelectItem value="science">العلوم الشرعية</SelectItem>
              <SelectItem value="madhab">المذاهب الفقهية</SelectItem>
              <SelectItem value="scholar">العلماء</SelectItem>
              <SelectItem value="book">الكتب</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleReset}>
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="knowledge" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="knowledge">شبكة المعرفة الإسلامية</TabsTrigger>
          <TabsTrigger value="isnad">سلسلة الإسناد</TabsTrigger>
        </TabsList>
        
        <TabsContent value="knowledge" className="p-0">
          <Card>
            <CardContent className="p-0 overflow-hidden">
              <div className="relative">
                <div 
                  ref={graphRef} 
                  className="w-full h-[500px] bg-gray-50"
                ></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="isnad" className="p-0">
          <Card>
            <CardHeader>
              <CardTitle>سلسلة إسناد حديث</CardTitle>
              <CardDescription>
                "من سلك طريقا يلتمس فيه علما سهل الله له به طريقا إلى الجنة"
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden">
              <div className="relative">
                <div 
                  ref={isnadRef} 
                  className="w-full h-[500px] bg-gray-50"
                ></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {selectedNode && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full 
                ${selectedNode.group === 'primary' ? 'bg-purple-100 text-purple-600' : ''}
                ${selectedNode.group === 'science' ? 'bg-green-100 text-green-600' : ''}
                ${selectedNode.group === 'madhab' ? 'bg-amber-100 text-amber-600' : ''}
                ${selectedNode.group === 'scholar' ? 'bg-red-100 text-red-600' : ''}
                ${selectedNode.group === 'book' ? 'bg-indigo-100 text-indigo-600' : ''}
                ${selectedNode.group === 'prophet' ? 'bg-purple-100 text-purple-600' : ''}
                ${selectedNode.group === 'companion' ? 'bg-green-100 text-green-600' : ''}
                ${selectedNode.group === 'successor' ? 'bg-amber-100 text-amber-600' : ''}
                ${selectedNode.group === 'narrator' ? 'bg-indigo-100 text-indigo-600' : ''}
                ${selectedNode.group === 'collector' ? 'bg-red-100 text-red-600' : ''}
              `}>
                {selectedNode.group === 'primary' && <Book className="h-6 w-6" />}
                {selectedNode.group === 'science' && <Bookmark className="h-6 w-6" />}
                {selectedNode.group === 'madhab' && <FileText className="h-6 w-6" />}
                {selectedNode.group === 'scholar' && <User className="h-6 w-6" />}
                {selectedNode.group === 'book' && <Book className="h-6 w-6" />}
                {selectedNode.group === 'prophet' && <User className="h-6 w-6" />}
                {selectedNode.group === 'companion' && <User className="h-6 w-6" />}
                {selectedNode.group === 'successor' && <User className="h-6 w-6" />}
                {selectedNode.group === 'narrator' && <User className="h-6 w-6" />}
                {selectedNode.group === 'collector' && <User className="h-6 w-6" />}
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-1">{selectedNode.label}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {selectedNode.group === 'primary' && 'مصدر تشريعي أساسي'}
                  {selectedNode.group === 'science' && 'علم شرعي'}
                  {selectedNode.group === 'madhab' && 'مذهب فقهي'}
                  {selectedNode.group === 'scholar' && 'عالم'}
                  {selectedNode.group === 'book' && 'كتاب'}
                  {selectedNode.group === 'prophet' && 'النبي صلى الله عليه وسلم'}
                  {selectedNode.group === 'companion' && 'صحابي'}
                  {selectedNode.group === 'successor' && 'تابعي'}
                  {selectedNode.group === 'narrator' && 'راوي'}
                  {selectedNode.group === 'collector' && 'محدث'}
                </p>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Info className="h-4 w-4" />
                    تفاصيل
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Share2 className="h-4 w-4" />
                    مشاركة
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}