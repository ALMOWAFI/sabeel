/**
 * CollaborativeWorkspace.tsx
 * 
 * A comprehensive workspace that bridges the gap between Islamic scholars and technologists,
 * facilitating collaboration on projects that leverage technology to serve Islamic knowledge.
 * This component replaces the previous OrganizersArena with a more focused implementation
 * of the core Sabeel vision.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import {
  BookOpen,
  Code,
  Users,
  FileText,
  MessageSquare,
  Compass,
  Lightbulb,
  Book,
  CheckCircle
} from 'lucide-react';

// Import services
import DataService from '@/services/DataService';
import NAMIService, { ContentCategory } from '@/services/NAMIService';
import { User } from '@/types/user';

// Import sub-components
import ProjectsList from './ProjectsList';
import ScholarDashboard from './ScholarDashboard';
import TechnologistDashboard from './TechnologistDashboard';
import KnowledgeProtection from './KnowledgeProtection';
import TrainingResources from './TrainingResources';

// Define role types
type UserRole = 'scholar' | 'technologist' | 'both' | 'observer';

const CollaborativeWorkspace: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>('observer');
  const [activeTab, setActiveTab] = useState('projects');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch current user and determine role
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const user = await DataService.getCurrentUser();
        
        if (!user) {
          // Redirect to login if not authenticated
          toast({
            title: "تم تسجيل الخروج",
            description: "يرجى تسجيل الدخول للوصول إلى مساحة العمل المشتركة",
            variant: "destructive"
          });
          navigate('/login');
          return;
        }
        
        setCurrentUser(user);
        
        // Determine user role based on profile data
        if (user.role === 'scholar' && user.scholarRank) {
          setUserRole('scholar');
        } else if (user.specializations?.includes('technology') || user.technologistLevel) {
          setUserRole(user.role === 'scholar' ? 'both' : 'technologist');
        } else {
          setUserRole('observer');
        }
        
        // Set initial active tab based on role
        if (user.role === 'scholar') {
          setActiveTab('scholar-dashboard');
        } else if (user.specializations?.includes('technology')) {
          setActiveTab('tech-dashboard');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "خطأ في تحميل البيانات",
          description: "حدث خطأ أثناء تحميل بيانات المستخدم",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate, toast]);

  // Role-specific interfaces and capabilities
  const getRoleContent = () => {
    switch (userRole) {
      case 'scholar':
        return (
          <Card className="mb-6 border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-600" />
                <span>مرحباً بك في مساحة العلماء التعاونية</span>
              </CardTitle>
              <CardDescription>
                كعالم، يمكنك الإشراف على المشاريع التقنية الإسلامية والتحقق من المحتوى والمساهمة بمعرفتك
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center justify-center p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
                  <CheckCircle className="h-10 w-10 text-emerald-600 mb-2" />
                  <h3 className="text-lg font-semibold">التحقق من المحتوى</h3>
                  <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                    {currentUser?.scholarRank === 'guardian' ? '12' : '5'} محتوى ينتظر التحقق
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
                  <Book className="h-10 w-10 text-amber-600 mb-2" />
                  <h3 className="text-lg font-semibold">المشاريع النشطة</h3>
                  <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                    {userRole === 'both' ? '8' : '3'} مشاريع تشارك فيها حالياً
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
                  <Lightbulb className="h-10 w-10 text-blue-600 mb-2" />
                  <h3 className="text-lg font-semibold">أفكار جديدة</h3>
                  <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                    {userRole === 'both' ? '15' : '7'} فكرة بحاجة إلى تقييم علمي
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
        
      case 'technologist':
        return (
          <Card className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-blue-600" />
                <span>مرحباً بك في مساحة التقنيين التعاونية</span>
              </CardTitle>
              <CardDescription>
                كتقني، يمكنك العمل على المشاريع التي تخدم المعرفة الإسلامية والتعاون مع العلماء
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center justify-center p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
                  <BookOpen className="h-10 w-10 text-blue-600 mb-2" />
                  <h3 className="text-lg font-semibold">المشاريع المفتوحة</h3>
                  <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                    25 مشروع تقني بانتظار المساهمة
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
                  <Users className="h-10 w-10 text-purple-600 mb-2" />
                  <h3 className="text-lg font-semibold">العلماء المتعاونون</h3>
                  <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                    18 عالم يبحث عن شركاء تقنيين
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
                  <Compass className="h-10 w-10 text-teal-600 mb-2" />
                  <h3 className="text-lg font-semibold">فرص تعليمية</h3>
                  <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                    12 دورة لفهم أساسيات المعرفة الإسلامية
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
        
      case 'both':
        return (
          <Card className="mb-6 border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                <Code className="h-5 w-5 text-purple-600" />
                <span>مرحباً بك في المساحة المشتركة</span>
              </CardTitle>
              <CardDescription>
                بصفتك عالماً وتقنياً، يمكنك الاستفادة من خبراتك المزدوجة لقيادة المشاريع وتوجيه المساهمين
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
                  <Lightbulb className="h-10 w-10 text-amber-600 mb-2" />
                  <h3 className="text-lg font-semibold">مشاريع مقترحة</h3>
                  <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                    إنشاء 3 مشاريع جديدة بانتظار الموافقة
                  </p>
                  <Button variant="outline" className="mt-4" size="sm">
                    إدارة المقترحات
                  </Button>
                </div>
                <div className="flex flex-col items-center justify-center p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
                  <MessageSquare className="h-10 w-10 text-teal-600 mb-2" />
                  <h3 className="text-lg font-semibold">طلبات الاستشارة</h3>
                  <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                    7 استشارات من تقنيين وعلماء بانتظار ردك
                  </p>
                  <Button variant="outline" className="mt-4" size="sm">
                    عرض الطلبات
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
        
      default:
        return (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>مساحة العمل المشتركة</CardTitle>
              <CardDescription>
                مساحة تعاونية للعلماء والتقنيين للعمل معاً على مشاريع تخدم المعرفة الإسلامية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                أنت الآن في وضع المراقب. للمشاركة في المشاريع، يرجى تحديث ملفك الشخصي
                لتحديد دورك كعالم أو تقني.
              </p>
              <Button 
                onClick={() => navigate('/profile')} 
                className="mt-4"
              >
                تحديث الملف الشخصي
              </Button>
            </CardContent>
          </Card>
        );
    }
  };

  // If still loading, show skeleton
  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="h-24 w-full rounded-lg bg-gray-200 animate-pulse mb-6"></div>
        <div className="h-12 w-full rounded-lg bg-gray-200 animate-pulse mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 rounded-lg bg-gray-200 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 rtl"
    >
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 text-primary">
          مساحة العمل المشتركة
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          منصة تجمع بين العلماء والتقنيين لتسخير التكنولوجيا في خدمة المعرفة الإسلامية
          وحماية التراث الإسلامي في عصر الذكاء الاصطناعي
        </p>
      </div>

      {/* Role-specific content */}
      {getRoleContent()}

      {/* Main tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full mb-6">
          <TabsTrigger value="projects" className="text-base">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>المشاريع</span>
            </div>
          </TabsTrigger>
          
          <TabsTrigger value="scholar-dashboard" className="text-base" disabled={userRole !== 'scholar' && userRole !== 'both'}>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>واجهة العلماء</span>
            </div>
          </TabsTrigger>
          
          <TabsTrigger value="tech-dashboard" className="text-base" disabled={userRole !== 'technologist' && userRole !== 'both'}>
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              <span>واجهة التقنيين</span>
            </div>
          </TabsTrigger>
          
          <TabsTrigger value="knowledge-protection" className="text-base">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>حماية المعرفة</span>
            </div>
          </TabsTrigger>
          
          <TabsTrigger value="training" className="text-base">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span>التدريب</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="mt-4">
          <ProjectsList userRole={userRole} />
        </TabsContent>
        
        <TabsContent value="scholar-dashboard" className="mt-4">
          <ScholarDashboard />
        </TabsContent>
        
        <TabsContent value="tech-dashboard" className="mt-4">
          <TechnologistDashboard />
        </TabsContent>
        
        <TabsContent value="knowledge-protection" className="mt-4">
          <KnowledgeProtection />
        </TabsContent>
        
        <TabsContent value="training" className="mt-4">
          <TrainingResources userRole={userRole} />
        </TabsContent>
      </Tabs>
      
      {/* Footer with Islamic knowledge quote */}
      <div className="mt-16 text-center border-t pt-8">
        <p className="text-gray-600 dark:text-gray-400 italic">
          "من سلك طريقا يلتمس فيه علما سهل الله له به طريقا إلى الجنة"
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          صحيح مسلم
        </p>
      </div>
    </motion.div>
  );
};

export default CollaborativeWorkspace;
