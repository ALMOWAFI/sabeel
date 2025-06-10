import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
  Database,
  Edit,
  Briefcase,
  Phone,
  AlertCircle
} from "lucide-react";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SabeelChatbot from '@/components/SabeelChatbot';
import SimpleKnowledgeExplorer from '@/components/SimpleKnowledgeExplorer';
import IslamicResources from '@/components/IslamicResources';
import ScholarForum from '@/components/ScholarForum';
import ContentCreationStudio from '@/components/content-creator/ContentCreationStudio';
import JobOpeningsBoard from '@/components/community/JobOpeningsBoard';
import WhatsAppGroupJoin from '@/components/community/WhatsAppGroupJoin';
// import AppwriteConnectionCheck from '@/components/AppwriteConnectionCheck'; // Component file seems to be missing
import SupabaseConnectionTest from '@/components/SupabaseConnectionTest';
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
                  
                  <Button 
                    variant={activeTab === "content" ? "default" : "ghost"} 
                    className="w-full justify-start text-right" 
                    onClick={() => setActiveTab("content")}
                  >
                    <Edit className="ml-2 h-4 w-4" />
                    إنشاء المحتوى
                  </Button>
                  
                  <Button 
                    variant={activeTab === "community" ? "default" : "ghost"} 
                    className="w-full justify-start text-right" 
                    onClick={() => setActiveTab("community")}
                  >
                    <Briefcase className="ml-2 h-4 w-4" />
                    المجتمع
                  </Button>
                  
                  <Button 
                    variant={activeTab === "system" ? "default" : "ghost"} 
                    className="w-full justify-start text-right mt-8 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900 dark:hover:bg-amber-800" 
                    onClick={() => setActiveTab("system")}
                  >
                    <AlertCircle className="ml-2 h-4 w-4" />
                    حالة النظام
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
            
            {/* Supabase Connection Test - for debugging */}
            <div className="mb-6">
              <SupabaseConnectionTest />
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
                    شارك في مشاريع بحثية تعاونية في مجال الدراسات الإسلامية والتقنية
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-300 text-right">
                      قريباً... سيتم إطلاق منصة المشاريع البحثية التعاونية
                    </p>
                    
                    <Button disabled className="w-full">
                      استكشاف المشاريع
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {activeTab === "content" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-right">إنشاء المحتوى الإسلامي</CardTitle>
                  <CardDescription className="text-right">
                    أنشئ محتوى إسلامي جديد باستخدام أدوات الذكاء الاصطناعي المتوافقة مع الشريعة
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ContentCreationStudio />
                </CardContent>
              </Card>
            )}
            
            {activeTab === "community" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-right">فرص العمل</CardTitle>
                    <CardDescription className="text-right">
                      استعرض وتقدم لفرص العمل في المؤسسات والمنظمات الإسلامية
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <JobOpeningsBoard />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-right">مجموعات واتساب</CardTitle>
                    <CardDescription className="text-right">
                      انضم إلى مجموعات واتساب المجتمعية للتواصل والتعلم
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <WhatsAppGroupJoin />
                  </CardContent>
                </Card>
              </div>
            )}
            
            {activeTab === "system" && (
              <div className="space-y-6">
                <Alert className="bg-amber-50 dark:bg-amber-900 mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>System Status Diagnostic</AlertTitle>
                  <AlertDescription>
                    This panel helps diagnose connectivity issues with backend services.
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card for AppwriteConnectionCheck removed as the component file is missing */}
                  {/*
                  <Card>
                    <CardHeader>
                      <CardTitle>Appwrite Connection</CardTitle>
                      <CardDescription>
                        Check connection to Appwrite services
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AppwriteConnectionCheck />
                    </CardContent>
                  </Card>
                  */}
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Supabase Connection</CardTitle>
                      <CardDescription>
                        Check connection to Supabase services
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <SupabaseConnectionTest />
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Project Structure Analysis</CardTitle>
                    <CardDescription>
                      Information about how your project is structured
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Multiple Frontend Implementations</h3>
                        <p>This project contains multiple competing frontend implementations:</p>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                          <li>React/Vite app in <code>src/</code> directory (current view)</li>
                          <li>HTML templates in <code>web_interface/templates/</code></li>
                          <li>Various integration components in <code>integration/</code></li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Backend Services</h3>
                        <p>The project has implementations for multiple backend services:</p>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                          <li>Appwrite (via <code>integration/appwrite/</code>)</li>
                          <li>Supabase (via <code>src/lib/supabaseConfig.ts</code>)</li>
                        </ul>
                      </div>
                      
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Resolution</AlertTitle>
                        <AlertDescription>
                          To fix the integration issues, focus on one backend implementation (Appwrite or Supabase)
                          and ensure all components use the same service consistently.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                </Card>
              </div>
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
