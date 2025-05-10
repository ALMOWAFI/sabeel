/**
 * CommunityImpactDashboard.tsx
 * 
 * Dashboard for tracking and displaying the collective community impact
 * Shows various metrics, milestones, and visualizations of community activity
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { BarChart3, PieChart, TrendingUp, Users, Share2, Calendar, Milestone } from 'lucide-react';
import CommunityMetrics, { getSampleMetrics } from './CommunityMetrics';
import ImpactTimeline from './ImpactTimeline';
import appwriteAuthBridge from '@/services/AppwriteAuthBridge';

// Mock data for charts (in a real app, this would come from an API)
const monthlyGrowthData = [
  { month: 'Jan', users: 12500, content: 450, interactions: 28000 },
  { month: 'Feb', users: 13200, content: 480, interactions: 31000 },
  { month: 'Mar', users: 14100, content: 510, interactions: 35500 },
  { month: 'Apr', users: 15800, content: 560, interactions: 42000 },
  { month: 'May', users: 17500, content: 610, interactions: 48000 },
  { month: 'Jun', users: 19200, content: 680, interactions: 53000 },
  { month: 'Jul', users: 20800, content: 720, interactions: 58000 },
  { month: 'Aug', users: 22000, content: 760, interactions: 62000 },
  { month: 'Sep', users: 23100, content: 790, interactions: 67000 },
  { month: 'Oct', users: 24500, content: 840, interactions: 71000 }
];

const contentDistributionData = [
  { type: 'القرآن وعلومه', percentage: 28 },
  { type: 'الحديث والسنة', percentage: 22 },
  { type: 'الفقه والشريعة', percentage: 18 },
  { type: 'العقيدة', percentage: 13 },
  { type: 'التاريخ الإسلامي', percentage: 12 },
  { type: 'الأخلاق والآداب', percentage: 7 }
];

const CommunityImpactDashboard: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(getSampleMetrics());
  const [milestones, setMilestones] = useState<any[]>([]);
  const [userContribution, setUserContribution] = useState<any>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real app, fetch data from API
        // For this demo, we'll use sample data and simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Get user contribution data if logged in
        const currentUser = await appwriteAuthBridge.getCurrentUser();
        if (currentUser && !currentUser.isGuest) {
          // Sample user contribution data
          setUserContribution({
            quranPages: 137,
            articlesRead: 24,
            questionsAnswered: 5,
            totalCredits: currentUser.credits || 0,
            rank: 357, // out of all users
            achievements: 12,
            impactScore: 78, // percentage
            recentActivities: [
              { type: 'quran', action: 'completed', detail: 'سورة البقرة', date: '2025-05-08' },
              { type: 'article', action: 'read', detail: 'أساسيات علوم الحديث', date: '2025-05-05' },
              { type: 'question', action: 'answered', detail: 'حول صحة حديث...', date: '2025-05-03' }
            ]
          });
        }
        
        // Sample community milestones
        setMilestones([
          {
            id: 1,
            title: '25,000 مستخدم',
            description: 'الوصول إلى 25 ألف مستخدم على منصة سبيل',
            date: '2025-11-15',
            progress: 97, // percentage
            current: 24583,
            target: 25000,
            icon: <Users className="h-5 w-5" />
          },
          {
            id: 2,
            title: '5,000 ختمة قرآن',
            description: 'إكمال 5 آلاف ختمة للقرآن الكريم في المجتمع',
            date: '2025-12-30',
            progress: 77,
            current: 3827,
            target: 5000,
            icon: <Calendar className="h-5 w-5" />
          },
          {
            id: 3,
            title: '1,000 مقال تعليمي',
            description: 'نشر 1000 مقال تعليمي عن العلوم الإسلامية',
            date: '2025-11-01',
            progress: 84,
            current: 843,
            target: 1000,
            icon: <Milestone className="h-5 w-5" />
          }
        ]);
      } catch (error) {
        console.error('Error fetching impact data:', error);
        toast({
          variant: "destructive",
          title: "خطأ في تحميل البيانات",
          description: "تعذر تحميل بيانات التأثير المجتمعي"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);
  
  // Format number with commas
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Calculate days until milestone completion based on progress rate
  const getDaysUntilMilestone = (milestone: any): number => {
    const remaining = milestone.target - milestone.current;
    const dailyRate = milestone.current / 180; // Assuming constant rate over last 180 days
    return Math.ceil(remaining / dailyRate);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">لوحة الأثر المجتمعي</h1>
          <p className="text-muted-foreground">
            استعراض الأثر الجماعي لمجتمع سبيل في نشر المعرفة الإسلامية
          </p>
        </div>
        
        <Button variant="outline" onClick={() => setActiveTab('share')}>
          <Share2 className="mr-2 h-4 w-4" />
          مشاركة الإنجازات
        </Button>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 lg:w-[400px] mb-4">
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            نظرة عامة
          </TabsTrigger>
          <TabsTrigger value="milestones">
            <Milestone className="h-4 w-4 mr-2" />
            الأهداف
          </TabsTrigger>
          <TabsTrigger value="personal">
            <Users className="h-4 w-4 mr-2" />
            مساهمتك
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              {/* Highlight stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-right text-xl">بيانات المجتمع</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{formatNumber(24583)}</div>
                    <p className="text-muted-foreground">عضو نشط</p>
                    <div className="mt-4 text-sm">
                      <div className="flex justify-between">
                        <span>نمو هذا الشهر</span>
                        <span className="text-green-600">+1483 (6.4%)</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>متوسط وقت القراءة</span>
                        <span>27 دقيقة / يوم</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-right text-xl">نشاط المحتوى</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{formatNumber(71243)}</div>
                    <p className="text-muted-foreground">تفاعل مع المحتوى هذا الشهر</p>
                    <div className="mt-4 text-sm">
                      <div className="flex justify-between">
                        <span>مقالات تم قراءتها</span>
                        <span>{formatNumber(48651)}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>صفحات قرآن تم تلاوتها</span>
                        <span>{formatNumber(22592)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-right text-xl">المحتوى المجتمعي</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{formatNumber(843)}</div>
                    <p className="text-muted-foreground">مساهمة محتوى من المجتمع</p>
                    <div className="mt-4 text-sm">
                      <div className="flex justify-between">
                        <span>تم مراجعتها ونشرها</span>
                        <span>{formatNumber(712)} (84.5%)</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>قيد المراجعة</span>
                        <span>{formatNumber(131)} (15.5%)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Metrics grid */}
              <div>
                <h3 className="text-lg font-medium mb-4">مؤشرات التأثير الرئيسية</h3>
                <CommunityMetrics metrics={metrics} />
              </div>
              
              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-right">النمو الشهري</CardTitle>
                    <CardDescription className="text-right">
                      تطور مستخدمي سبيل والمحتوى المنشور
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex items-center justify-center bg-muted/20 rounded-lg">
                      {/* This would be an actual chart component in a real app */}
                      <TrendingUp className="h-16 w-16 text-muted" />
                      <span className="ml-2 text-muted-foreground">مخطط بياني للنمو</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-right">توزيع أنواع المحتوى</CardTitle>
                    <CardDescription className="text-right">
                      توزيع المحتوى حسب التصنيفات الإسلامية
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex items-center justify-center bg-muted/20 rounded-lg">
                      {/* This would be an actual chart component in a real app */}
                      <PieChart className="h-16 w-16 text-muted" />
                      <span className="ml-2 text-muted-foreground">رسم بياني دائري للتوزيع</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-right">الأحداث المهمة في مجتمع سبيل</CardTitle>
                  <CardDescription className="text-right">
                    الإنجازات والمعالم الهامة التي حققها مجتمعنا
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ImpactTimeline className="max-h-96 overflow-y-auto pr-2" />
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="milestones" className="space-y-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-right">الأهداف المجتمعية</CardTitle>
                  <CardDescription className="text-right">
                    أهداف مجتمع سبيل وتقدمنا نحو تحقيقها
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {milestones.map((milestone) => (
                      <div key={milestone.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            {milestone.icon}
                          </div>
                          <div className="flex-1 mx-4 space-y-1 text-right">
                            <h4 className="font-medium">{milestone.title}</h4>
                            <p className="text-sm text-muted-foreground">{milestone.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold">
                              {milestone.progress}%
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {getDaysUntilMilestone(milestone)} يوم متبقي
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 space-y-2">
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary" 
                              style={{ width: `${milestone.progress}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{formatNumber(milestone.current)} / {formatNumber(milestone.target)}</span>
                            <span>المستهدف بحلول {milestone.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-right">كيف يمكنك المساهمة</CardTitle>
                  <CardDescription className="text-right">
                    طرق للمساعدة في تحقيق أهداف المجتمع
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4 text-center">
                      <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                        <BookOpen className="h-6 w-6 text-blue-600" />
                      </div>
                      <h4 className="font-medium">ختم القرآن</h4>
                      <p className="text-sm text-muted-foreground mt-2">
                        استمر في قراءة القرآن الكريم يومياً للمساهمة في هدفنا الجماعي
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4 text-center">
                      <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                        <Share2 className="h-6 w-6 text-green-600" />
                      </div>
                      <h4 className="font-medium">مشاركة المعرفة</h4>
                      <p className="text-sm text-muted-foreground mt-2">
                        ساهم بكتابة مقالات أو إجابة أسئلة المجتمع
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4 text-center">
                      <div className="mx-auto h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                        <Users className="h-6 w-6 text-amber-600" />
                      </div>
                      <h4 className="font-medium">دعوة الآخرين</h4>
                      <p className="text-sm text-muted-foreground mt-2">
                        ادعُ أصدقاءك وعائلتك للانضمام إلى مجتمع سبيل
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="personal" className="space-y-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner size="lg" />
            </div>
          ) : userContribution ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-right">مساهمتك في المجتمع</CardTitle>
                  <CardDescription className="text-right">
                    تأثيرك الشخصي في نشر المعرفة الإسلامية
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold">{userContribution.quranPages}</div>
                      <p className="text-sm text-muted-foreground mt-1">صفحات قرآن تمت قراءتها</p>
                    </div>
                    
                    <div className="border rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold">{userContribution.articlesRead}</div>
                      <p className="text-sm text-muted-foreground mt-1">مقالات تمت قراءتها</p>
                    </div>
                    
                    <div className="border rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold">{userContribution.totalCredits}</div>
                      <p className="text-sm text-muted-foreground mt-1">نقاط المعرفة المكتسبة</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-right">
                        <h4 className="font-medium">نقاط التأثير المجتمعي</h4>
                        <p className="text-sm text-muted-foreground">تصنيفك ضمن أعلى 15% من المساهمين</p>
                      </div>
                      <div className="text-2xl font-bold">{userContribution.impactScore}</div>
                    </div>
                    
                    <div className="h-4 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${userContribution.impactScore}%` }}
                      />
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium text-right mb-4">نشاطاتك الأخيرة</h4>
                      <div className="space-y-4">
                        {userContribution.recentActivities.map((activity: any, index: number) => (
                          <div key={index} className="flex items-start">
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mr-3">
                              {activity.type === 'quran' ? (
                                <BookOpen className="h-4 w-4" />
                              ) : activity.type === 'article' ? (
                                <BookOpen className="h-4 w-4" />
                              ) : (
                                <MessageSquare className="h-4 w-4" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm">
                                {activity.action === 'completed' ? 'أكملت قراءة' : 
                                  activity.action === 'read' ? 'قرأت' : 'أجبت على'} {' '}
                                <span className="font-medium">{activity.detail}</span>
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(activity.date).toLocaleDateString('ar-SA')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t p-4">
                  <div className="w-full flex justify-end">
                    <Button variant="outline">
                      عرض تقرير التأثير الكامل
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Users className="h-16 w-16 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">قم بتسجيل الدخول لعرض مساهمتك</h3>
                <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                  سجل الدخول أو أنشئ حسابًا للبدء في المساهمة في مجتمع سبيل وتتبع تأثيرك الشخصي
                </p>
                <div className="mt-6">
                  <Button>
                    تسجيل الدخول
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityImpactDashboard;
