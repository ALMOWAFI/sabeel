import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';
import { 
  Sword, 
  BookOpen, 
  Users, 
  Calendar, 
  Settings, 
  FileText, 
  MessageCircle, 
  Moon, 
  Star,
  Shield,
  Award,
  Scroll
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppwriteService } from '@/services/AppwriteService';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type OrganizerTool = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  type: 'administrative' | 'educational' | 'operational';
  new?: boolean;
};

const OrganizersArena = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [organizerRank, setOrganizerRank] = useState<'apprentice' | 'commander' | 'guardian'>('apprentice');
  const [authCode, setAuthCode] = useState("");
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [toolsData, setToolsData] = useState<OrganizerTool[]>([]);
  const [announcements, setAnnouncements] = useState([
    {
      id: '1',
      title: 'اجتماع المنظمين الشهري',
      date: '15 مايو 2025',
      content: 'سيتم عقد الاجتماع الشهري للمنظمين عبر زوم. الرجاء الاطلاع على جدول الأعمال المرفق.'
    },
    {
      id: '2',
      title: 'تحديث منصة التعلم',
      date: '10 مايو 2025',
      content: 'تم إطلاق النسخة الجديدة من منصة التعلم الإسلامي. يرجى مراجعة التغييرات والإبلاغ عن أي مشاكل.'
    }
  ]);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const appwriteService = new AppwriteService();

  // Tools that will be available to organizers
  const toolsList: OrganizerTool[] = [
    {
      id: 'calendar-management',
      name: 'إدارة التقويم الإسلامي',
      description: 'أضف وعدّل المناسبات الإسلامية والفعاليات القادمة',
      icon: <Calendar className="h-6 w-6 text-emerald-600" />,
      path: '/admin/islamic-events',
      type: 'administrative'
    },
    {
      id: 'member-management',
      name: 'إدارة الأعضاء',
      description: 'إدارة المستخدمين والصلاحيات وبيانات العضوية',
      icon: <Users className="h-6 w-6 text-blue-600" />,
      path: '/admin/members',
      type: 'administrative'
    },
    {
      id: 'content-moderation',
      name: 'مراقبة المحتوى',
      description: 'مراجعة وإدارة المحتوى المنشور على المنصة',
      icon: <FileText className="h-6 w-6 text-purple-600" />,
      path: '/admin/content',
      type: 'administrative'
    },
    {
      id: 'quran-session',
      name: 'إدارة جلسات القرآن',
      description: 'إنشاء وتنظيم جلسات تلاوة وتفسير القرآن',
      icon: <BookOpen className="h-6 w-6 text-amber-600" />,
      path: '/admin/quran-sessions',
      type: 'educational',
      new: true
    },
    {
      id: 'community-chat',
      name: 'محادثات المجتمع',
      description: 'إدارة مجموعات النقاش والمحادثات للمجتمع',
      icon: <MessageCircle className="h-6 w-6 text-teal-600" />,
      path: '/admin/community-chat',
      type: 'operational'
    },
    {
      id: 'platform-settings',
      name: 'إعدادات المنصة',
      description: 'تخصيص وضبط إعدادات المنصة والمظهر',
      icon: <Settings className="h-6 w-6 text-gray-600" />,
      path: '/admin/settings',
      type: 'operational'
    },
    {
      id: 'prayer-times',
      name: 'مواقيت الصلاة',
      description: 'إدارة وتحديث مواقيت الصلاة للمناطق المختلفة',
      icon: <Moon className="h-6 w-6 text-indigo-600" />,
      path: '/admin/prayer-times',
      type: 'educational'
    },
    {
      id: 'strategic-planning',
      name: 'التخطيط الاستراتيجي',
      description: 'وضع وتتبع الخطط الاستراتيجية للمنظمة الإسلامية',
      icon: <Scroll className="h-6 w-6 text-red-600" />,
      path: '/admin/planning',
      type: 'operational',
      new: true
    },
    {
      id: 'awards-badges',
      name: 'الأوسمة والشارات',
      description: 'إدارة نظام المكافآت والتقدير للأعضاء',
      icon: <Award className="h-6 w-6 text-yellow-600" />,
      path: '/admin/awards',
      type: 'operational'
    }
  ];

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if authenticated in session storage
        const authSession = sessionStorage.getItem('member-authenticated');
        
        if (authSession === 'premium') {
          setIsAuthenticated(true);
          
          // Try to get organizer rank from storage
          const storedRank = localStorage.getItem('organizer-rank');
          if (storedRank && ['apprentice', 'commander', 'guardian'].includes(storedRank)) {
            setOrganizerRank(storedRank as 'apprentice' | 'commander' | 'guardian');
          }
          
          // Filter tools by rank
          filterToolsByRank(storedRank as 'apprentice' | 'commander' | 'guardian' || 'apprentice');
        } else {
          setIsAuthenticated(false);
          navigate('/login');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        setIsAuthenticated(false);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Filter tools based on organizer rank
  const filterToolsByRank = (rank: 'apprentice' | 'commander' | 'guardian') => {
    let filteredTools: OrganizerTool[] = [];

    switch (rank) {
      case 'guardian':
        // Guardians get access to all tools
        filteredTools = toolsList;
        break;
      case 'commander':
        // Commanders get administrative and educational tools
        filteredTools = toolsList.filter(tool => 
          tool.type === 'administrative' || tool.type === 'educational'
        );
        break;
      case 'apprentice':
      default:
        // Apprentices only get educational tools
        filteredTools = toolsList.filter(tool => tool.type === 'educational');
        break;
    }

    setToolsData(filteredTools);
  };

  // Validate special access code
  const validateAccessCode = (code: string) => {
    // Special access codes for different organizer ranks
    const rankCodes = {
      apprentice: '123456',
      commander: '789012',
      guardian: '345678'
    };

    if (code === rankCodes.guardian) {
      setOrganizerRank('guardian');
      localStorage.setItem('organizer-rank', 'guardian');
      filterToolsByRank('guardian');
      setIsCodeValid(true);
      toast({
        title: "تم التحقق بنجاح",
        description: "مرحباً بك يا حارس سبيل. تم منحك صلاحيات كاملة.",
        variant: "default",
      });
      return true;
    } else if (code === rankCodes.commander) {
      setOrganizerRank('commander');
      localStorage.setItem('organizer-rank', 'commander');
      filterToolsByRank('commander');
      setIsCodeValid(true);
      toast({
        title: "تم التحقق بنجاح",
        description: "مرحباً بك يا قائد سبيل. تم منحك صلاحيات متقدمة.",
        variant: "default",
      });
      return true;
    } else if (code === rankCodes.apprentice) {
      setOrganizerRank('apprentice');
      localStorage.setItem('organizer-rank', 'apprentice');
      filterToolsByRank('apprentice');
      setIsCodeValid(true);
      toast({
        title: "تم التحقق بنجاح",
        description: "مرحباً بك يا متدرب سبيل. تم منحك الصلاحيات الأساسية.",
        variant: "default",
      });
      return true;
    }
    
    return false;
  };

  const handleCodeComplete = (code: string) => {
    setAuthCode(code);
    const isValid = validateAccessCode(code);
    
    if (!isValid) {
      toast({
        title: "رمز غير صالح",
        description: "الرجاء التأكد من الرمز وإعادة المحاولة",
        variant: "destructive",
      });
    }
  };

  // Handle tool selection
  const handleToolSelect = (tool: OrganizerTool) => {
    // Navigate to the selected tool's path
    navigate(tool.path);
  };
  
  // If still loading, show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sabeel-primary"></div>
          <p className="mt-4 text-sabeel-primary font-arabic text-lg">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, return null (redirect will happen via useEffect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[url('/pattern-bg.png')] bg-opacity-5 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
        {/* Header with logo inspired by the image */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-8 rounded-lg overflow-hidden"
        >
          <div className="relative p-6 text-center">
            {/* Background with Islamic pattern */}
            <div className="absolute inset-0 bg-teal-800 rounded-lg">
              <div className="absolute inset-0 opacity-30 bg-[url('/pattern-bg.png')]"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-teal-900/90 to-teal-800/90 rounded-lg"></div>
            </div>

            {/* Red border with calligraphy - inspired by the image */}
            <div className="absolute inset-x-0 top-0 h-16 bg-red-800 opacity-90 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[url('/pattern-bg.png')]"></div>
              <p className="text-gold-500 text-xl font-arabic relative z-10 px-4 text-amber-300">
                إِنَّ اللَّهَ يُحِبُّ الَّذِينَ يُقَاتِلُونَ فِي سَبِيلِهِ صَفًّا كَأَنَّهُم بُنْيَانٌ مَّرْصُوصٌ
              </p>
            </div>
            
            {/* Red border at bottom  - inspired by the image */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-red-800 opacity-90 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[url('/pattern-bg.png')]"></div>
              <p className="text-gold-500 text-xl font-arabic relative z-10 px-4 text-amber-300">
                فَضْلُ الْعَالِمِ عَلَى الْعَابِدِ كَفَضْلِي عَلَى أَدْنَاكُمْ
              </p>
            </div>

            {/* Content */}
            <div className="relative z-10 py-20">
              {/* Star and Crescent */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Moon className="h-14 w-14 text-amber-300 rotate-[230deg]" />
                  <Star className="h-6 w-6 text-amber-300 absolute top-0 right-0" />
                </div>
              </div>

              {/* Title in Arabic - Sabeel */}
              <h1 className="text-6xl font-bold text-amber-300 font-arabic mb-4">سبيل</h1>
              
              {/* Crossed swords */}
              <div className="flex justify-center mt-2">
                <Sword className="h-10 w-10 text-amber-300 rotate-45" />
                <Sword className="h-10 w-10 text-amber-300 -rotate-45 -ml-4" />
              </div>
              
              {/* Subtitle */}
              <h2 className="text-2xl font-medium text-white mt-4 mb-8 font-arabic">منطقة المنظمين</h2>

              {/* Access verification - only show if code is not yet validated */}
              {!isCodeValid && (
                <div className="max-w-md mx-auto bg-white/95 dark:bg-gray-800/95 p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-sabeel-primary mb-4 font-arabic">
                    رمز الوصول
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    الرجاء إدخال رمز الوصول الخاص بك للدخول إلى منطقة المنظمين
                  </p>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="access-code" className="block text-right">الرمز</Label>
                      <InputOTP
                        maxLength={6}
                        onComplete={handleCodeComplete}
                        render={({ slots }) => (
                          <InputOTPGroup>
                            {slots.map((slot, index) => (
                              <InputOTPSlot
                                key={index}
                                {...slot}
                                className={cn(
                                  "rounded-md border-sabeel-primary/30 focus:border-sabeel-primary focus:ring-1 focus:ring-sabeel-primary"
                                )}
                              />
                            ))}
                          </InputOTPGroup>
                        )}
                      />
                    </div>
                    
                    {/* Display codes for testing */}
                    <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 p-2 rounded">
                      <p>للاختبار، استخدم أحد الرموز التالية:</p>
                      <ul className="list-disc list-inside space-y-1 mt-1">
                        <li>متدرب: 123456</li>
                        <li>قائد: 789012</li>
                        <li>حارس: 345678</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Only show organizer tools if code is validated */}
        {isCodeValid && (
          <div className="space-y-8">
            {/* Rank Display */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {organizerRank === 'guardian' && (
                    <Shield className="h-8 w-8 text-amber-500 mr-2" />
                  )}
                  {organizerRank === 'commander' && (
                    <Award className="h-8 w-8 text-amber-500 mr-2" />
                  )}
                  {organizerRank === 'apprentice' && (
                    <BookOpen className="h-8 w-8 text-amber-500 mr-2" />
                  )}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {organizerRank === 'guardian' && 'حارس سبيل'}
                      {organizerRank === 'commander' && 'قائد سبيل'}
                      {organizerRank === 'apprentice' && 'متدرب سبيل'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {organizerRank === 'guardian' && 'لديك صلاحيات كاملة للإدارة والتحكم'}
                      {organizerRank === 'commander' && 'لديك صلاحيات متقدمة للإدارة والتعليم'}
                      {organizerRank === 'apprentice' && 'لديك صلاحيات أساسية للتعليم'}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => setIsCodeValid(false)}
                  className="border-sabeel-primary text-sabeel-primary hover:bg-sabeel-primary/10"
                >
                  تغيير الرتبة
                </Button>
              </div>
            </div>

            {/* Tabs for different sections */}
            <Tabs defaultValue="tools" className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-14 bg-sabeel-primary/10 rounded-lg">
                <TabsTrigger value="tools" className="rounded-md data-[state=active]:bg-sabeel-primary data-[state=active]:text-white">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>الأدوات</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="announcements" className="rounded-md data-[state=active]:bg-sabeel-primary data-[state=active]:text-white">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>الإعلانات</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="messages" className="rounded-md data-[state=active]:bg-sabeel-primary data-[state=active]:text-white">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    <span>التواصل</span>
                  </div>
                </TabsTrigger>
              </TabsList>

              {/* Tools Tab */}
              <TabsContent value="tools" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {toolsData.map((tool) => (
                    <div
                      key={tool.id}
                      onClick={() => handleToolSelect(tool)}
                      className="cursor-pointer group"
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-2 border-transparent group-hover:border-sabeel-primary transition-all"
                      >
                        <div className="p-4 flex items-start gap-4 h-full">
                          <div className="bg-sabeel-primary/10 p-3 rounded-full flex-shrink-0">
                            {tool.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-lg text-gray-900 dark:text-gray-100">
                                {tool.name}
                              </h3>
                              {tool.new && (
                                <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                                  جديد
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {tool.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Announcements Tab */}
              <TabsContent value="announcements" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-sabeel-primary" />
                      إعلانات المنظمين
                    </CardTitle>
                    <CardDescription>
                      أحدث الإعلانات والتحديثات للمنظمين
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {announcements.map((announcement) => (
                        <div 
                          key={announcement.id} 
                          className="p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                        >
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-gray-900 dark:text-gray-100">
                              {announcement.title}
                            </h3>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {announcement.date}
                            </span>
                          </div>
                          <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
                            {announcement.content}
                          </p>
                        </div>
                      ))}

                      <div className="pt-4">
                        <Button 
                          variant="outline" 
                          className="w-full border-sabeel-primary text-sabeel-primary"
                        >
                          عرض كل الإعلانات
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Messages Tab */}
              <TabsContent value="messages" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-sabeel-primary" />
                      التواصل مع المنظمين
                    </CardTitle>
                    <CardDescription>
                      أرسل رسالة إلى فريق المنظمين أو المشرفين
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="message-subject" className="block text-right">
                          الموضوع
                        </Label>
                        <input
                          id="message-subject"
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sabeel-primary dark:bg-gray-700"
                          placeholder="أدخل عنوان الرسالة"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message-content" className="block text-right">
                          محتوى الرسالة
                        </Label>
                        <Textarea
                          id="message-content"
                          className="min-h-[150px] w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sabeel-primary dark:bg-gray-700"
                          placeholder="اكتب رسالتك هنا..."
                        />
                      </div>
                      
                      <div className="flex justify-end pt-2">
                        <Button className="bg-sabeel-primary hover:bg-sabeel-primary/90 text-white">
                          إرسال الرسالة
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizersArena;
