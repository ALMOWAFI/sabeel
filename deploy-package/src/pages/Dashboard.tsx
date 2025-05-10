import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Book, 
  BookOpen, 
  Users, 
  MessageSquare, 
  FileText, 
  BookMarked,
  Compass,
  PenTool,
  Archive,
  ChevronRight,
  MessageCircle,
  Search,
  Database
} from "lucide-react";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SabeelChatbot from '@/components/SabeelChatbot';
import SimpleKnowledgeExplorer from '@/components/SimpleKnowledgeExplorer';
import IslamicResources from '@/components/IslamicResources';
import ScholarForum from '@/components/ScholarForum';
import { ScrollArea } from "@/components/ui/scroll-area";

const Dashboard = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const [activeTab, setActiveTab] = useState("knowledge");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle>المنصة</CardTitle>
                <CardDescription>أدوات سبيل</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1 px-2 py-3">
                  <Button 
                    variant={activeTab === "knowledge" ? "default" : "ghost"} 
                    className="w-full justify-start text-right" 
                    onClick={() => setActiveTab("knowledge")}
                  >
                    <Database className="ml-2 h-4 w-4" />
                    المعرفة الإسلامية
                  </Button>
                  <Button 
                    variant={activeTab === "resources" ? "default" : "ghost"} 
                    className="w-full justify-start text-right" 
                    onClick={() => setActiveTab("resources")}
                  >
                    <BookOpen className="ml-2 h-4 w-4" />
                    المصادر العلمية
                  </Button>
                  <Button 
                    variant={activeTab === "scholars" ? "default" : "ghost"} 
                    className="w-full justify-start text-right" 
                    onClick={() => setActiveTab("scholars")}
                  >
                    <Users className="ml-2 h-4 w-4" />
                    منتدى العلماء
                  </Button>
                  <Button 
                    variant={activeTab === "projects" ? "default" : "ghost"} 
                    className="w-full justify-start text-right" 
                    onClick={() => setActiveTab("projects")}
                  >
                    <PenTool className="ml-2 h-4 w-4" />
                    المشاريع البحثية
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-5">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-right">
                مرحباً بك في منصة سبيل للمعرفة الإسلامية
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-right">
                استكشف المعرفة الإسلامية، تواصل مع العلماء، وساهم في المشاريع المعرفية.
              </p>
            </div>
            
            {/* Active Tab Content */}
            {activeTab === "knowledge" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-right">استكشاف المعرفة الإسلامية</CardTitle>
                    <CardDescription className="text-right">
                      تصفح وابحث في المصادر والمراجع الإسلامية بتقنيات متقدمة
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SimpleKnowledgeExplorer />
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-right">
                        <span className="flex items-center justify-between">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-1"
                            onClick={() => setShowChatbot(true)}
                          >
                            فتح المساعد <ChevronRight className="h-4 w-4" />
                          </Button>
                          <span>مساعد سبيل الذكي</span>
                        </span>
                      </CardTitle>
                      <CardDescription className="text-right">
                        اطرح أسئلتك واحصل على إجابات مستندة إلى المصادر الإسلامية
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-center">
                        <MessageCircle className="h-12 w-12 mx-auto text-sabeel-primary mb-4" />
                        <h3 className="text-lg font-medium mb-2">تحدث مع مساعد سبيل</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                          يستخدم مساعد سبيل الذكاء الاصطناعي المتوافق مع الشريعة الإسلامية للإجابة على استفساراتك
                        </p>
                        <Button 
                          onClick={() => setShowChatbot(true)}
                          className="bg-sabeel-primary hover:bg-sabeel-primary/90"
                        >
                          ابدأ المحادثة
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-right">بحث متقدم</CardTitle>
                      <CardDescription className="text-right">
                        ابحث في المتون والشروح وكتب التراث الإسلامي
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-center">
                        <Search className="h-12 w-12 mx-auto text-sabeel-primary mb-4" />
                        <h3 className="text-lg font-medium mb-2">استكشاف المراجع</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                          تصفح آلاف المراجع والكتب المحققة بمحرك بحث دلالي متقدم
                        </p>
                        <Button className="bg-sabeel-primary hover:bg-sabeel-primary/90">
                          استكشاف المكتبة
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
            
            {activeTab === "resources" && <IslamicResources />}
            {activeTab === "scholars" && <ScholarForum />}
            {activeTab === "projects" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-right">المشاريع البحثية</CardTitle>
                  <CardDescription className="text-right">
                    تعاون مع الباحثين والعلماء في مشاريع علمية متنوعة
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <PenTool className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium mb-2">قريباً...</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                      نعمل على تطوير منصة المشاريع البحثية. ترقبوا إطلاقها قريباً.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
      
      {/* Chatbot Modal */}
      {showChatbot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl h-[80vh] bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <SabeelChatbot onClose={() => setShowChatbot(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
