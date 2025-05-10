import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Book, 
  Users, 
  MessageSquare, 
  FileText, 
  BookMarked,
  Compass,
  PenTool,
  Archive,
  ChevronRight,
  MessageCircle,
  Database,
  Bookmark,
  Calendar,
  GitBranch,
  Grid3X3,
  Globe,
  Lightbulb,
  LayoutGrid,
  Layers,
  Map,
  Play,
  Settings,
  ArrowRight,
  ChevronDown,
  Maximize2,
  HelpCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import SabeelChatbot from '@/components/SabeelChatbot';
import { cn } from "@/lib/utils";

// Knowledge Graph visualization component (using fallback version)
import SimpleKnowledgeExplorer from '@/components/SimpleKnowledgeExplorer';

// Import new Islamic-specific components
import IslamicCalendar from '@/components/IslamicCalendar';
import QiblaFinder from '@/components/QiblaFinder';
import ScholarDirectory from '@/components/ScholarDirectory';
import HadithSearch from '@/components/HadithSearch';
import QuranExplorer from '@/components/QuranExplorer';
import IslamicCourses from '@/components/IslamicCourses';
import ResearchCollaboration from '@/components/ResearchCollaboration';
import TrendingTopics from '@/components/TrendingTopics';

const Portal = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [activeTool, setActiveTool] = useState("knowledge-explorer");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const portalRef = useRef<HTMLDivElement>(null);
  
  // Mock user data
  const user = {
    name: "د. محمد الأنصاري",
    role: "باحث",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    notifications: 5,
    unreadMessages: 3,
    institute: "جامعة الأزهر",
    specialty: "الحديث الشريف والذكاء الاصطناعي"
  };
  
  // Mock recent activities
  const recentActivities = [
    { id: 1, type: "research", title: "تطبيقات الذكاء الاصطناعي في التعرف على أسانيد الحديث", time: "منذ ساعتين" },
    { id: 2, type: "discussion", title: "المشاركة في نقاش حول مسألة المعاملات المالية المعاصرة", time: "منذ 3 ساعات" },
    { id: 3, type: "resource", title: "تنزيل كتاب إحياء علوم الدين", time: "منذ يوم" },
    { id: 4, type: "knowledge", title: "استعراض شبكة المعرفة عن الفقه الإسلامي", time: "منذ يومين" },
  ];
  
  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (portalRef.current?.requestFullscreen) {
        portalRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Implement semantic search across Islamic knowledge sources
  };
  
  // Main navigation items
  const mainNavItems = [
    { id: "knowledge-explorer", icon: <Layers className="h-5 w-5" />, label: "مستكشف المعرفة", description: "استكشاف شبكة المعرفة الإسلامية بشكل ثلاثي الأبعاد" },
    { id: "quran", icon: <Book className="h-5 w-5" />, label: "القرآن الكريم", description: "تصفح القرآن مع التفاسير والتلاوات" },
    { id: "hadith", icon: <MessageCircle className="h-5 w-5" />, label: "الحديث الشريف", description: "بحث متقدم في الأحاديث النبوية وشروحها" },
    { id: "scholars", icon: <Users className="h-5 w-5" />, label: "العلماء", description: "التواصل مع علماء ومتخصصين في مختلف المجالات" },
    { id: "library", icon: <BookMarked className="h-5 w-5" />, label: "المكتبة", description: "آلاف الكتب والمصادر الإسلامية بين يديك" },
    { id: "courses", icon: <Play className="h-5 w-5" />, label: "الدورات العلمية", description: "تعلم وتدرب مع خبراء في العلوم الشرعية" },
    { id: "research", icon: <PenTool className="h-5 w-5" />, label: "الأبحاث والمشاريع", description: "المشاركة في المشاريع البحثية التعاونية" },
  ];
  
  // Tools
  const tools = [
    { id: "qibla", icon: <Compass className="h-5 w-5" />, label: "محدد القبلة", description: "تحديد اتجاه القبلة من أي مكان" },
    { id: "calendar", icon: <Calendar className="h-5 w-5" />, label: "التقويم الهجري", description: "التقويم الإسلامي مع المناسبات والأعياد" },
    { id: "trending", icon: <GitBranch className="h-5 w-5" />, label: "المواضيع المتداولة", description: "أبرز المواضيع والنقاشات في منصة سبيل" },
    { id: "ai-assistant", icon: <Lightbulb className="h-5 w-5" />, label: "المساعد الذكي", description: "مساعد سبيل الذكي للإجابة على استفساراتك" },
  ];
  
  return (
    <div ref={portalRef} className="h-screen flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation */}
      <header className="h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Grid3X3 className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
          
          <div className="mx-4 flex items-center">
            <span className="font-arabic text-xl font-bold text-sabeel-primary ml-1">سَبِيل</span>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">منصة المعرفة الإسلامية</span>
          </div>
        </div>
        
        <form onSubmit={handleSearch} className="flex-1 max-w-3xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="ابحث في المعرفة الإسلامية..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-700 text-right"
            />
          </div>
        </form>
        
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative">
            <MessageSquare className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            {user.unreadMessages > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                {user.unreadMessages}
              </span>
            )}
          </button>
          
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative">
            <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            {user.notifications > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                {user.notifications}
              </span>
            )}
          </button>
          
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <HelpCircle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-2 rtl:space-x-reverse">
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>الملف الشخصي</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>الإعدادات</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>تسجيل الخروج</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence initial={false}>
          {!sidebarCollapsed && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4 text-right">
                  <p className="text-sm font-medium text-indigo-800 dark:text-indigo-300">مرحباً بك في منصة سبيل</p>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
                    استكشف عالم المعرفة الإسلامية بأدوات ذكية ومتطورة
                  </p>
                </div>
              </div>
              
              <ScrollArea className="flex-1">
                <div className="p-3">
                  <div className="mb-6">
                    <h3 className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-2 text-right">
                      الأقسام الرئيسية
                    </h3>
                    <nav className="space-y-1">
                      {mainNavItems.map(item => (
                        <button
                          key={item.id}
                          onClick={() => setActiveTool(item.id)}
                          className={cn(
                            "w-full flex items-center justify-end gap-3 px-3 py-2 rounded-md text-right transition-colors",
                            activeTool === item.id 
                              ? "bg-sabeel-primary/10 text-sabeel-primary" 
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          )}
                        >
                          <div className="flex-1 text-right">
                            <p className="font-medium">{item.label}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
                          </div>
                          {activeTool === item.id ? (
                            <div className="bg-sabeel-primary/20 rounded-md p-1.5">
                              {item.icon}
                            </div>
                          ) : (
                            <div className="p-1.5">
                              {item.icon}
                            </div>
                          )}
                        </button>
                      ))}
                    </nav>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-2 text-right">
                      أدوات مساعدة
                    </h3>
                    <nav className="space-y-1">
                      {tools.map(tool => (
                        <button
                          key={tool.id}
                          onClick={() => tool.id === "ai-assistant" ? setShowChatbot(true) : setActiveTool(tool.id)}
                          className="w-full flex items-center justify-end gap-3 px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-right transition-colors"
                        >
                          <div className="flex-1 text-right">
                            <p className="font-medium">{tool.label}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{tool.description}</p>
                          </div>
                          <div className="p-1.5">
                            {tool.icon}
                          </div>
                        </button>
                      ))}
                    </nav>
                  </div>
                  
                  <div>
                    <h3 className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-2 text-right">
                      النشاطات الأخيرة
                    </h3>
                    <div className="space-y-3">
                      {recentActivities.map(activity => (
                        <div 
                          key={activity.id} 
                          className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 p-3 text-right"
                        >
                          <div className="flex items-start gap-2">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{activity.title}</p>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-xs text-gray-500">{activity.time}</span>
                                <Badge variant="outline" className="text-xs">
                                  {activity.type === "research" && "بحث"}
                                  {activity.type === "discussion" && "نقاش"}
                                  {activity.type === "resource" && "مصدر"}
                                  {activity.type === "knowledge" && "معرفة"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-right">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">متصل</Badge>
                    <p className="font-medium">{user.name}</p>
                  </div>
                  <p className="text-xs text-gray-500">{user.specialty}</p>
                  <p className="text-xs text-gray-500 mt-1">{user.institute}</p>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
        
        {/* Main Content */}
        <main className="flex-1 overflow-hidden flex flex-col bg-gray-100 dark:bg-gray-900">
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="mr-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <Layers className="h-5 w-5" />}
              </button>
              
              <div>
                <h1 className="text-lg font-bold">
                  {mainNavItems.find(item => item.id === activeTool)?.label || tools.find(tool => tool.id === activeTool)?.label}
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={toggleFullscreen}>
                <Maximize2 className="h-4 w-4 mr-1" />
                {isFullscreen ? "إنهاء ملء الشاشة" : "ملء الشاشة"}
              </Button>
              
              <Button variant="default" size="sm" className="bg-sabeel-primary" onClick={() => setShowChatbot(true)}>
                <MessageCircle className="h-4 w-4 mr-1" />
                المساعد الذكي
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTool}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {activeTool === "knowledge-explorer" && <SimpleKnowledgeExplorer />}
                {activeTool === "quran" && <QuranExplorer />}
                {activeTool === "hadith" && <HadithSearch />}
                {activeTool === "scholars" && <ScholarDirectory />}
                {activeTool === "library" && <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <BookMarked className="h-16 w-16 mx-auto text-sabeel-primary mb-4" />
                    <h2 className="text-2xl font-bold mb-2">المكتبة الإسلامية</h2>
                    <p className="text-gray-500 max-w-md">
                      آلاف الكتب والمصادر الإسلامية في مختلف المجالات، مع إمكانية البحث المتقدم والتصفح.
                    </p>
                  </div>
                </div>}
                {activeTool === "courses" && <IslamicCourses />}
                {activeTool === "research" && <ResearchCollaboration />}
                {activeTool === "qibla" && <QiblaFinder />}
                {activeTool === "calendar" && <IslamicCalendar />}
                {activeTool === "trending" && <TrendingTopics />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
      
      {/* Chatbot Modal */}
      {showChatbot && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-2xl h-[80vh] bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-xl"
          >
            <SabeelChatbot onClose={() => setShowChatbot(false)} />
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Missing components import fixes
const Bell = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const User = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const LogOut = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

export default Portal;
