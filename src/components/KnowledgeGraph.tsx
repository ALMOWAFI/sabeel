import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

// This will be replaced with actual data from the Islamic Knowledge System
const mockGraphData = {
  nodes: [
    { id: "quran", label: "القرآن الكريم", group: "primary", size: 30 },
    { id: "hadith", label: "الحديث الشريف", group: "primary", size: 25 },
    { id: "fiqh", label: "الفقه", group: "secondary", size: 20 },
    { id: "aqeedah", label: "العقيدة", group: "secondary", size: 20 },
    { id: "tafsir", label: "التفسير", group: "secondary", size: 20 },
    { id: "hanafi", label: "المذهب الحنفي", group: "madhab", size: 15 },
    { id: "maliki", label: "المذهب المالكي", group: "madhab", size: 15 },
    { id: "shafii", label: "المذهب الشافعي", group: "madhab", size: 15 },
    { id: "hanbali", label: "المذهب الحنبلي", group: "madhab", size: 15 },
    { id: "ghazali", label: "الإمام الغزالي", group: "scholar", size: 18 },
    { id: "ibnTaymiyyah", label: "ابن تيمية", group: "scholar", size: 18 },
    { id: "ibnKathir", label: "ابن كثير", group: "scholar", size: 18 },
    { id: "bukhari", label: "البخاري", group: "scholar", size: 18 },
    { id: "muslim", label: "مسلم", group: "scholar", size: 18 },
  ],
  links: [
    { source: "quran", target: "tafsir", value: 5 },
    { source: "hadith", target: "fiqh", value: 5 },
    { source: "hadith", target: "bukhari", value: 3 },
    { source: "hadith", target: "muslim", value: 3 },
    { source: "fiqh", target: "hanafi", value: 2 },
    { source: "fiqh", target: "maliki", value: 2 },
    { source: "fiqh", target: "shafii", value: 2 },
    { source: "fiqh", target: "hanbali", value: 2 },
    { source: "tafsir", target: "ibnKathir", value: 2 },
    { source: "aqeedah", target: "ibnTaymiyyah", value: 2 },
    { source: "fiqh", target: "ghazali", value: 2 },
    { source: "aqeedah", target: "ghazali", value: 2 },
  ]
};

const KnowledgeGraph: React.FC = () => {
  const graphRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  
  useEffect(() => {
    // Simulate loading of graph data
    const timer = setTimeout(() => {
      setIsLoading(false);
      initializeGraph();
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const initializeGraph = () => {
    if (!graphRef.current) return;
    
    // In a real implementation, this would initialize a D3.js or similar
    // visualization library to render an interactive knowledge graph
    
    // For now, we'll render a static SVG as a placeholder
    const width = graphRef.current.clientWidth;
    const height = 400;
    
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
    
    // Plot nodes
    mockGraphData.nodes.forEach((node, i) => {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      
      // Simple positioning algorithm for demo
      const angle = (i / mockGraphData.nodes.length) * Math.PI * 2;
      const radius = Math.min(width, height) * 0.35;
      const x = width / 2 + Math.cos(angle) * radius;
      const y = height / 2 + Math.sin(angle) * radius;
      
      // Create circle for node
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", "0");
      circle.setAttribute("cy", "0");
      circle.setAttribute("r", (node.size / 2).toString());
      
      // Set color based on group
      let fill = "#3b82f6";  // Default blue
      if (node.group === "primary") fill = "#8b5cf6";  // Purple
      if (node.group === "secondary") fill = "#10b981"; // Green
      if (node.group === "madhab") fill = "#f59e0b";  // Amber
      if (node.group === "scholar") fill = "#ef4444";  // Red
      
      circle.setAttribute("fill", fill);
      circle.setAttribute("opacity", "0.8");
      
      // Add text label
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.textContent = node.label;
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dy", "30");  // Position below circle
      text.setAttribute("font-size", "12");
      text.setAttribute("fill", "#1e293b");
      
      // Add interactivity
      g.dataset.id = node.id;
      g.onclick = () => {
        setSelectedNode({
          id: node.id,
          label: node.label,
          group: node.group
        });
      };
      
      g.appendChild(circle);
      g.appendChild(text);
      
      // Position the entire group
      g.setAttribute("transform", `translate(${x}, ${y})`);
      svg.appendChild(g);
    });
    
    // Plot links (before nodes to ensure nodes are on top)
    mockGraphData.links.forEach(link => {
      const sourceNode = mockGraphData.nodes.find(n => n.id === link.source);
      const targetNode = mockGraphData.nodes.find(n => n.id === link.target);
      
      if (sourceNode && targetNode) {
        const sourceIdx = mockGraphData.nodes.indexOf(sourceNode);
        const targetIdx = mockGraphData.nodes.indexOf(targetNode);
        
        const sourceAngle = (sourceIdx / mockGraphData.nodes.length) * Math.PI * 2;
        const targetAngle = (targetIdx / mockGraphData.nodes.length) * Math.PI * 2;
        
        const radius = Math.min(width, height) * 0.35;
        const sourceX = width / 2 + Math.cos(sourceAngle) * radius;
        const sourceY = height / 2 + Math.sin(sourceAngle) * radius;
        const targetX = width / 2 + Math.cos(targetAngle) * radius;
        const targetY = height / 2 + Math.sin(targetAngle) * radius;
        
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", sourceX.toString());
        line.setAttribute("y1", sourceY.toString());
        line.setAttribute("x2", targetX.toString());
        line.setAttribute("y2", targetY.toString());
        line.setAttribute("stroke", "#cbd5e1");
        line.setAttribute("stroke-width", (link.value / 2).toString());
        line.setAttribute("opacity", "0.6");
        
        // Insert at beginning to ensure lines are behind nodes
        svg.insertBefore(line, svg.firstChild.nextSibling);
      }
    });
    
    // Clear and append
    graphRef.current.innerHTML = "";
    graphRef.current.appendChild(svg);
  };
  
  const handleSearch = () => {
    // In a real implementation, this would filter the graph
    // or highlight matching nodes
    console.log("Searching for:", searchTerm);
  };
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
    // Would actually apply zoom to visualization
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
    // Would actually apply zoom to visualization
  };
  
  const handleReset = () => {
    setZoomLevel(1);
    setSelectedNode(null);
    // Would reset the visualization
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
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
        
        <div className="flex items-center space-x-2">
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
      
      <Tabs defaultValue="graph" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="graph">الرسم التفاعلي</TabsTrigger>
          <TabsTrigger value="paths">المسارات المعرفية</TabsTrigger>
        </TabsList>
        <TabsContent value="graph" className="p-0">
          <Card>
            <CardContent className="p-0 overflow-hidden">
              {isLoading ? (
                <div className="flex items-center justify-center h-[400px] bg-gray-50">
                  <div className="text-center">
                    <Spinner size="lg" className="mx-auto mb-4" />
                    <p className="text-gray-500">جاري تحميل شبكة المعرفة...</p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div 
                    ref={graphRef} 
                    className="w-full h-[400px] bg-gray-50"
                    style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
                  ></div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="paths">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">المسارات المعرفية قريباً</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  نعمل على تطوير مسارات معرفية تساعدك على فهم العلوم الإسلامية بطريقة منظمة ومتدرجة.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {selectedNode && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-right">
              <h3 className="text-lg font-medium mb-2">{selectedNode.label}</h3>
              <p className="text-gray-500 mb-4">
                {selectedNode.group === "primary" && "مصدر تشريعي أساسي"}
                {selectedNode.group === "secondary" && "علم شرعي"}
                {selectedNode.group === "madhab" && "مذهب فقهي"}
                {selectedNode.group === "scholar" && "عالم إسلامي"}
              </p>
              <Button variant="outline" className="text-right mt-2">
                استكشاف المزيد
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KnowledgeGraph;
