import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Lock, 
  FileText, 
  Calendar, 
  ChartBar, 
  Users, 
  MessageCircle, 
  Inbox, 
  BookText, 
  Trophy,
  Crown
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { motion } from 'framer-motion';

const Members = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [memberType, setMemberType] = useState<'regular' | 'premium' | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user was authenticated through the login page
  useEffect(() => {
    const authSession = sessionStorage.getItem('member-authenticated');
    
    if (authSession === 'premium') {
      setIsAuthenticated(true);
      setMemberType('premium');
    } else if (authSession === 'regular') {
      setIsAuthenticated(true);
      setMemberType('regular');
    } else {
      setIsAuthenticated(false);
      setMemberType(null);
    }
  }, []);

  // Redirect unauthenticated users to login page
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Dummy data for the member dashboard
  const currentTasks = [
    { id: 1, title: "إعداد تقرير عن التقدم الشهري", dueDate: "15 مايو 2025", priority: "عالي" },
    { id: 2, title: "مراجعة الترجمات الجديدة", dueDate: "20 مايو 2025", priority: "متوسط" },
    { id: 3, title: "اجتماع مع فريق التطوير", dueDate: "10 مايو 2025", priority: "عالي" }
  ];

  const teamMembers = [
    { id: 1, name: "أحمد محمد", role: "مطور واجهات", status: "متصل" },
    { id: 2, name: "سارة أحمد", role: "مصممة تجربة المستخدم", status: "غير متصل" },
    { id: 3, name: "محمد علي", role: "مهندس ذكاء اصطناعي", status: "مشغول" }
  ];

  const premiumFeatures = [
    "الوصول إلى المواد التعليمية المتقدمة",
    "تدريب شخصي مع خبراء المجال",
    "المشاركة في الاجتماعات الشهرية الخاصة"
  ];

  const reminders = [
    "لا تنسى الاجتماع الأسبوعي يوم الخميس القادم الساعة 2 ظهراً",
    "موعد تسليم التقرير الشهري: 30 مايو 2025",
    "تذكير: تحديث قاعدة البيانات قبل نهاية الأسبوع"
  ];

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem('member-authenticated');
    toast({
      title: "تم تسجيل الخروج بنجاح",
      description: "إلى اللقاء!",
      variant: "default",
    });
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null; // Redirect will happen based on useEffect
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sabeel-primary/5 to-sabeel-accent/5">
      <Navbar />
      <main className="flex-grow pt-20 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Logo & Header Area with Islamic Design */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="rounded-xl overflow-hidden mb-8 bg-gradient-to-r from-sabeel-primary to-sabeel-accent p-1 shadow-lg"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5 bg-[url('/pattern-bg.png')]"></div>
              
              <div className="relative flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  {/* Logo with glowing effect */}
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-sabeel-accent/20 blur-lg"></div>
                    <div className="relative">
                      <img 
                        src="/lovable-uploads/a5fcac1b-54eb-4860-bfd4-5ec4efa83444.png" 
                        alt="Prime Logo" 
                        className="h-20 md:h-24"
                      />
                    </div>
                  </div>
                  
                  <div className="mr-4 text-right">
                    <h1 className="text-2xl md:text-3xl font-bold text-sabeel-primary font-arabic">منطقة العمل الخاصة</h1>
                    {memberType === 'premium' ? (
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <Crown className="h-4 w-4 text-yellow-500" />
                        <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-sm">
                          عضوية بريميوم
                        </div>
                      </div>
                    ) : (
                      <div className="inline-block px-3 py-1 rounded-full bg-sabeel-primary text-white text-sm mt-1">
                        عضوية قياسية
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="text-lg font-semibold text-sabeel-primary">أحمد محمد</div>
                  <div className="text-gray-600 dark:text-gray-300">مطور واجهات</div>
                  <div className="flex items-center mt-1">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                    <span className="text-sm text-green-500">متصل الآن</span>
                  </div>
                  <Button 
                    onClick={handleLogout} 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 text-sabeel-primary border-sabeel-primary hover:bg-sabeel-primary/10"
                  >
                    تسجيل الخروج
                  </Button>
                </div>
              </div>
              
              {/* Islamic Pattern Divider */}
              {memberType === 'premium' && (
                <div className="mt-4 flex justify-center">
                  <div className="h-8 w-full max-w-[240px]" style={{ backgroundImage: "url('/pattern-divider.svg')" }}></div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Premium Member Special Banner - Only shown for premium members */}
          {memberType === 'premium' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-8 bg-gradient-to-r from-yellow-600/20 to-amber-500/20 p-0.5 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="bg-gradient-to-r from-yellow-600/10 to-amber-500/10 rounded-lg p-4 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 bg-[url('/pattern-bg.png')]"></div>
                
                <div className="relative flex flex-col md:flex-row items-center gap-4 text-center md:text-right">
                  <div className="flex-shrink-0 bg-gradient-to-r from-yellow-500 to-amber-600 p-3 rounded-full">
                    <Crown className="h-8 w-8 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-yellow-700 dark:text-amber-400 font-arabic mb-2">
                      مرحباً بك في منطقة العضوية المميزة!
                    </h3>
                    <p className="text-amber-800/70 dark:text-amber-300/80">
                      تمتع بميزات حصرية للأعضاء المميزين، بما في ذلك المحتوى المتقدم والفعاليات الخاصة والدعم الشخصي.
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 grid md:grid-cols-3 gap-3">
                  {premiumFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 bg-white/40 dark:bg-amber-900/20 p-2 rounded-lg">
                      <div className="h-2 w-2 bg-yellow-600 rounded-full"></div>
                      <span className="text-sm text-amber-900 dark:text-amber-200">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Main Content Area - Tabs */}
          <Tabs defaultValue="current-work" className="w-full" dir="rtl">
            <TabsList className="w-full flex justify-around mb-6 bg-white dark:bg-gray-800 p-1 rounded-lg border-2 border-sabeel-accent/20 shadow-md">
              <TabsTrigger value="current-work" className="flex-1 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-sabeel-primary data-[state=active]:to-sabeel-secondary data-[state=active]:text-white">
                <div className="flex flex-col items-center gap-2">
                  <Inbox size={20} />
                  <span>العمل الحالي</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="team" className="flex-1 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-sabeel-primary data-[state=active]:to-sabeel-secondary data-[state=active]:text-white">
                <div className="flex flex-col items-center gap-2">
                  <Users size={20} />
                  <span>المجموعة</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex-1 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-sabeel-primary data-[state=active]:to-sabeel-secondary data-[state=active]:text-white">
                <div className="flex flex-col items-center gap-2">
                  <Calendar size={20} />
                  <span>المهام</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="tips" className="flex-1 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-sabeel-primary data-[state=active]:to-sabeel-secondary data-[state=active]:text-white">
                <div className="flex flex-col items-center gap-2">
                  <BookText size={20} />
                  <span>النصائح</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="ideas" className="flex-1 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-sabeel-primary data-[state=active]:to-sabeel-secondary data-[state=active]:text-white">
                <div className="flex flex-col items-center gap-2">
                  <Trophy size={20} />
                  <span>الإنتاج والأفكار</span>
                </div>
              </TabsTrigger>
            </TabsList>

            {/* Tab Contents - Keeping functionality from the existing implementation */}
            <TabsContent value="current-work" className="px-4">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-2 border-sabeel-primary/20 shadow-md bg-gradient-to-br from-white to-sabeel-primary/5">
                  <CardHeader className="bg-gradient-to-r from-sabeel-primary/20 to-sabeel-accent/10 pb-2">
                    <CardTitle className="flex items-center gap-2 text-sabeel-primary font-arabic">
                      <Inbox size={20} /> 
                      المشاريع الحالية
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      {currentTasks.map(task => (
                        <div key={task.id} className="border-b border-sabeel-primary/20 pb-3 last:border-0 last:pb-0">
                          <div className="flex justify-between">
                            <h3 className="font-semibold">{task.title}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              task.priority === "عالي" 
                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" 
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            تاريخ التسليم: {task.dueDate}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-sabeel-primary/20 shadow-md bg-gradient-to-br from-white to-sabeel-primary/5">
                  <CardHeader className="bg-gradient-to-r from-sabeel-primary/20 to-sabeel-accent/10 pb-2">
                    <CardTitle className="flex items-center gap-2 text-sabeel-primary font-arabic">
                      <ChartBar size={20} /> 
                      تقدم العمل
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>تطوير واجهة المستخدم</span>
                          <span>75%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-sabeel-primary to-sabeel-accent h-full rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                      
                      {/* Keep other progress bars */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>تصميم قاعدة البيانات</span>
                          <span>90%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-sabeel-primary to-sabeel-accent h-full rounded-full" style={{ width: '90%' }}></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>اختبار الأداء</span>
                          <span>45%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-sabeel-primary to-sabeel-accent h-full rounded-full" style={{ width: '45%' }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Team Tab - Keeping functionality from existing implementation */}
            <TabsContent value="team" className="px-4">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-2 border-sabeel-primary/20 shadow-md bg-gradient-to-br from-white to-sabeel-primary/5">
                  <CardHeader className="bg-gradient-to-r from-sabeel-primary/20 to-sabeel-accent/10 pb-2">
                    <CardTitle className="flex items-center gap-2 text-sabeel-primary font-arabic">
                      <Users size={20} /> 
                      أعضاء الفريق
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      {teamMembers.map(member => (
                        <div key={member.id} className="flex items-center justify-between border-b border-sabeel-primary/20 pb-3 last:border-0 last:pb-0">
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{member.role}</div>
                          </div>
                          <div className="flex items-center">
                            <div className={`h-2 w-2 rounded-full mr-1 ${
                              member.status === "متصل" ? "bg-green-500" : 
                              member.status === "مشغول" ? "bg-orange-500" : "bg-gray-500"
                            }`}></div>
                            <span className="text-sm">{member.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-sabeel-primary/20 shadow-md bg-gradient-to-br from-white to-sabeel-primary/5">
                  <CardHeader className="bg-gradient-to-r from-sabeel-primary/20 to-sabeel-accent/10 pb-2">
                    <CardTitle className="flex items-center gap-2 text-sabeel-primary font-arabic">
                      <MessageCircle size={20} /> 
                      رسالة للفريق
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <Textarea 
                        placeholder="اكتب رسالتك للفريق هنا..." 
                        className="min-h-[120px] border-sabeel-primary/30 focus:border-sabeel-primary focus:ring-1 focus:ring-sabeel-primary"
                      />
                      <Button className="w-full bg-gradient-to-r from-sabeel-primary to-sabeel-secondary hover:from-sabeel-secondary hover:to-sabeel-primary text-white">
                        إرسال الرسالة
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tasks Tab - Keeping functionality from existing implementation */}
            <TabsContent value="tasks" className="px-4">
              <Card className="border-2 border-sabeel-primary/20 shadow-md bg-gradient-to-br from-white to-sabeel-primary/5">
                <CardHeader className="bg-gradient-to-r from-sabeel-primary/20 to-sabeel-accent/10 pb-2">
                  <CardTitle className="flex items-center gap-2 text-sabeel-primary font-arabic">
                    <Calendar size={20} /> 
                    المهام والمواعيد
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b-2 border-sabeel-accent/30">
                          <th className="py-2 px-4 text-right text-sabeel-primary">المهمة</th>
                          <th className="py-2 px-4 text-right text-sabeel-primary">المسؤول</th>
                          <th className="py-2 px-4 text-right text-sabeel-primary">تاريخ التسليم</th>
                          <th className="py-2 px-4 text-right text-sabeel-primary">الحالة</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-sabeel-primary/10 hover:bg-sabeel-primary/5">
                          <td className="py-3 px-4">تطوير واجهة الصفحة الرئيسية</td>
                          <td className="py-3 px-4">أحمد محمد</td>
                          <td className="py-3 px-4">15 مايو 2025</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full dark:bg-yellow-900/30 dark:text-yellow-300">قيد التنفيذ</span>
                          </td>
                        </tr>
                        <tr className="border-b border-sabeel-primary/10 hover:bg-sabeel-primary/5">
                          <td className="py-3 px-4">تصميم قاعدة البيانات</td>
                          <td className="py-3 px-4">سارة أحمد</td>
                          <td className="py-3 px-4">20 مايو 2025</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full dark:bg-green-900/30 dark:text-green-300">مكتمل</span>
                          </td>
                        </tr>
                        <tr className="border-b border-sabeel-primary/10 hover:bg-sabeel-primary/5">
                          <td className="py-3 px-4">اختبار الأداء</td>
                          <td className="py-3 px-4">محمد علي</td>
                          <td className="py-3 px-4">10 مايو 2025</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full dark:bg-red-900/30 dark:text-red-300">متأخر</span>
                          </td>
                        </tr>
                        <tr className="border-b border-sabeel-primary/10 hover:bg-sabeel-primary/5">
                          <td className="py-3 px-4">تحديث المحتوى</td>
                          <td className="py-3 px-4">ليلى خالد</td>
                          <td className="py-3 px-4">25 مايو 2025</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full dark:bg-blue-900/30 dark:text-blue-300">قريباً</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tips Tab - Keeping functionality from existing implementation */}
            <TabsContent value="tips" className="px-4">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-2 border-sabeel-primary/20 shadow-md bg-gradient-to-br from-white to-sabeel-primary/5">
                  <CardHeader className="bg-gradient-to-r from-sabeel-primary/20 to-sabeel-accent/10 pb-2">
                    <CardTitle className="flex items-center gap-2 text-sabeel-primary font-arabic">
                      <BookText size={20} /> 
                      تذكيرات ونصائح
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      {reminders.map((reminder, index) => (
                        <div key={index} className="p-3 bg-sabeel-primary/5 rounded-md border-r-4 border-sabeel-accent shadow">
                          <p className="text-gray-700 dark:text-gray-300">{reminder}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-sabeel-primary/20 shadow-md bg-gradient-to-br from-white to-sabeel-primary/5">
                  <CardHeader className="bg-gradient-to-r from-sabeel-primary/20 to-sabeel-accent/10 pb-2">
                    <CardTitle className="flex items-center gap-2 text-sabeel-primary font-arabic">
                      <FileText size={20} /> 
                      اقتباسات ملهمة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <blockquote className="border-r-4 border-sabeel-accent p-4 bg-gradient-to-r from-sabeel-primary/10 to-sabeel-accent/5 rounded-md shadow">
                        <p className="font-arabic text-lg">"لا نرضى أن يُقال لنا يوم القيامة: كان بين أيديكم طريق، ولم تمشوا فيه…"</p>
                      </blockquote>
                      <blockquote className="border-r-4 border-sabeel-accent p-4 bg-gradient-to-r from-sabeel-primary/10 to-sabeel-accent/5 rounded-md shadow">
                        <p className="font-arabic text-lg">"من لم يكن في زيادة فهو في نقصان"</p>
                        <footer className="text-left text-sm text-gray-500 dark:text-gray-400 mt-2">- الإمام الشافعي</footer>
                      </blockquote>
                      <blockquote className="border-r-4 border-sabeel-accent p-4 bg-gradient-to-r from-sabeel-primary/10 to-sabeel-accent/5 rounded-md shadow">
                        <p className="font-arabic text-lg">"العلم ما نفع، والجهل ما ضر"</p>
                        <footer className="text-left text-sm text-gray-500 dark:text-gray-400 mt-2">- الإمام الشافعي</footer>
                      </blockquote>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Ideas Tab - Keeping functionality from existing implementation */}
            <TabsContent value="ideas" className="px-4">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-2 border-sabeel-primary/20 shadow-md bg-gradient-to-br from-white to-sabeel-primary/5">
                  <CardHeader className="bg-gradient-to-r from-sabeel-primary/20 to-sabeel-accent/10 pb-2">
                    <CardTitle className="flex items-center gap-2 text-sabeel-primary font-arabic">
                      <Trophy size={20} /> 
                      أفكار ومقترحات
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <Textarea 
                        placeholder="شارك أفكارك الجديدة هنا..." 
                        className="min-h-[120px] border-sabeel-primary/30 focus:border-sabeel-primary focus:ring-1 focus:ring-sabeel-primary"
                      />
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" className="border-sabeel-primary/30 text-sabeel-primary hover:bg-sabeel-primary/10">حفظ كمسودة</Button>
                        <Button className="bg-gradient-to-r from-sabeel-primary to-sabeel-secondary hover:from-sabeel-secondary hover:to-sabeel-primary text-white">إرسال الفكرة</Button>
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      <h3 className="font-semibold text-sabeel-primary text-lg font-arabic">أحدث الأفكار المطروحة</h3>
                      <div className="p-4 bg-white dark:bg-gray-700/50 rounded-lg border-2 border-sabeel-primary/20 hover:shadow-md transition-all">
                        <div className="flex justify-between items-start">
                          <div className="font-medium">دمج تقنيات الذكاء الاصطناعي في التفسير</div>
                          <div className="text-xs text-gray-500">قبل 2 أيام</div>
                        </div>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                          أقترح أن نستخدم الذكاء الاصطناعي لتسهيل البحث في كتب التفسير وتقديمها بصورة تفاعلية حديثة تناسب جيل الشباب.
                        </p>
                        <div className="mt-2 flex gap-2">
                          <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full dark:bg-green-900/30 dark:text-green-300">
                            ذكاء اصطناعي
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900/30 dark:text-blue-300">
                            تفسير
                          </span>
                        </div>
                        <div className="mt-3 text-sabeel-primary text-sm cursor-pointer hover:text-sabeel-accent">3 تعليقات</div>
                      </div>
                      
                      <div className="p-4 bg-white dark:bg-gray-700/50 rounded-lg border-2 border-sabeel-primary/20 hover:shadow-md transition-all">
                        <div className="flex justify-between items-start">
                          <div className="font-medium">تطبيق ل��phones الذكية</div>
                          <div className="text-xs text-gray-500">قبل 5 أيام</div>
                        </div>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                          أقترح تطوير تطبيق للهواتف الذكية يمكن من خلاله الوصول إلى محتوى المشروع بسهولة، مع إمكانية البحث والتصفح دون اتصال بالإنترنت.
                        </p>
                        <div className="mt-2 flex gap-2">
                          <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full dark:bg-purple-900/30 dark:text-purple-300">
                            تطبيقات الجوال
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full dark:bg-yellow-900/30 dark:text-yellow-300">
                            تطوير
                          </span>
                        </div>
                        <div className="mt-3 text-sabeel-primary text-sm cursor-pointer hover:text-sabeel-accent">7 تعليقات</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-sabeel-primary/20 shadow-md bg-gradient-to-br from-white to-sabeel-primary/5">
                  <CardHeader className="bg-gradient-to-r from-sabeel-primary/20 to-sabeel-accent/10 pb-2">
                    <CardTitle className="flex items-center gap-2 text-sabeel-primary font-arabic">
                      <ChartBar size={20} /> 
                      التقدم العام للمشروع
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="rounded-lg bg-gradient-to-br from-sabeel-primary to-sabeel-accent p-6 text-white mb-4 shadow-md">
                      <div className="text-center mb-3">
                        <div className="text-4xl font-bold">65%</div>
                        <div className="text-sm opacity-80">التقدم العام في المشروع</div>
                      </div>
                      <div className="w-full h-4 bg-white/30 rounded-full overflow-hidden">
                        <div className="bg-white h-full rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>التطوير التقني</span>
                        <span className="font-semibold">80%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-sabeel-primary to-sabeel-secondary h-full rounded-full" style={{ width: '80%' }}></div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>المحتوى العلمي</span>
                        <span className="font-semibold">60%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-sabeel-accent to-sabeel-primary h-full rounded-full" style={{ width: '60%' }}></div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>التصميم والواجهات</span>
                        <span className="font-semibold">75%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-sabeel-secondary to-sabeel-accent h-full rounded-full" style={{ width: '75%' }}></div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>الأبحاث والتطوير</span>
                        <span className="font-semibold">45%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-sabeel-primary to-sabeel-accent h-full rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Islamic Pattern Footer */}
          <div className="mt-8 h-3 bg-gradient-to-r from-sabeel-primary via-sabeel-accent to-sabeel-secondary rounded-full opacity-70 shadow"></div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Members;
