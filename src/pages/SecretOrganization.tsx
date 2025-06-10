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
  Crown,
  Sword,
  Shield,
  Eye,
  Briefcase,
  Star,
  UserPlus,
  FileCode,
  Database,
  Key
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import dataService from '@/services/DataService';
import { Collections } from '@/types/collections';
import { Project, Profile, Resource, Meeting } from '@/types/models';

const SecretOrganization = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<Profile[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await dataService.getCurrentUser();
        if (user && user.role === 'premium') {
          setIsAuthenticated(true);
        } else {
          toast({ title: "Access Denied", description: "You must be a premium member to view this page.", variant: "destructive" });
          navigate('/login');
        }
      } catch (error) {
        toast({ title: "Authentication Error", description: "Please log in to continue.", variant: "destructive" });
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, toast]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      setIsDataLoading(true);
      try {
        const [rawProjects, rawMembers, rawResources, rawMeetings] = await Promise.all([
          dataService.listDocuments<any>(Collections.SCHOLAR_TECHNOLOGIST_PROJECTS),
          dataService.listDocuments<any>(Collections.PROFILES, { role: 'premium' }),
          dataService.listDocuments<any>(Collections.CONTENT_ITEMS, { is_secret: true }),
          dataService.listDocuments<any>(Collections.EVENTS, { is_secret: true }),
        ]);

        const projects = rawProjects.map((p: any): Project => ({
          id: p.id,
          title: p.title || 'Untitled Project',
          progress: p.progress || 0,
          members: p.members_count || 0,
          priority: p.priority || 'متوسط',
          deadline: p.deadline ? new Date(p.deadline).toLocaleDateString('ar-SA') : 'غير محدد',
        }));

        const members = rawMembers.map((m: any): Profile => ({
          id: m.id,
          name: m.full_name || m.name || 'عضو غير معروف',
          role: m.role || 'عضو',
          expertise: m.expertise || 'غير محدد',
          status: m.status || 'غير متصل',
          avatar: m.avatar_url || '',
        }));

        const resources = rawResources.map((r: any): Resource => ({
          id: r.id,
          title: r.title || 'Untitled Resource',
          type: r.type || 'غير محدد',
          access: r.access_level || 'مقيد',
          lastUpdated: r.updated_at ? new Date(r.updated_at).toLocaleDateString('ar-SA') : 'غير محدد',
        }));

        const meetings = rawMeetings.map((m: any): Meeting => ({
          id: m.id,
          title: m.title || 'Untitled Meeting',
          date: m.event_date ? new Date(m.event_date).toLocaleString('ar-SA') : 'غير محدد',
          participants: m.participants_count || 0,
        }));

        setProjects(projects);
        setMembers(members);
        setResources(resources);
        setMeetings(meetings);

      } catch (error) {
        console.error("Failed to load organization data:", error);
        toast({ title: "Data Error", description: "Failed to load organization data.", variant: "destructive" });
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, toast]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await dataService.logout();
      toast({
        title: "تم تسجيل الخروج بنجاح",
        description: "إلى اللقاء!",
        variant: "default",
      });
      navigate('/login');
    } catch (error) {
      toast({ title: "Logout Failed", description: "An error occurred during logout.", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirect is handled in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-900/10 to-purple-900/10 dark:from-indigo-950 dark:to-purple-950">
      <Navbar />
      <main className="flex-grow pt-20 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Secret Organization Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="rounded-xl overflow-hidden mb-8 bg-gradient-to-r from-indigo-700 to-purple-700 p-1 shadow-lg"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5 bg-[url('/pattern-bg.png')]"></div>
              
              <div className="relative flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  {/* Logo with glowing effect */}
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-lg"></div>
                    <div className="relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-full">
                      <Shield className="h-8 w-8 md:h-10 md:w-10 text-white" />
                    </div>
                  </div>
                  
                  <div className="mr-4 text-right">
                    <h1 className="text-2xl md:text-3xl font-bold text-indigo-700 dark:text-indigo-400 font-arabic">المنظمة السرية</h1>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <Key className="h-4 w-4 text-purple-500" />
                      <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm">
                        منطقة محمية
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-purple-600 hover:to-indigo-600 text-white border-2 border-indigo-400/30 shadow-lg"
                    onClick={() => navigate('/collaborative-workspace')}
                  >
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>مساحة العمل المشتركة</span>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="border-indigo-500 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950"
                    onClick={handleLogout}
                  >
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      <span>تسجيل الخروج</span>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="md:col-span-2 space-y-6">
              {/* Projects Section */}
              <Card className="border-indigo-200 dark:border-indigo-900 shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-right text-lg font-bold text-indigo-700 dark:text-indigo-400">
                      المشاريع السرية
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="text-indigo-600 dark:text-indigo-400">
                      <FileText className="h-4 w-4 mr-1" /> عرض الكل
                    </Button>
                  </div>
                  <CardDescription className="text-right text-muted-foreground">
                    المشاريع الجارية في المنظمة
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isDataLoading ? <p>Loading projects...</p> : projects.map(project => (
                      <div key={project.id} className="border border-indigo-100 dark:border-indigo-900 rounded-lg p-4 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div className="px-2 py-1 text-xs rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                            {project.priority === "عالي" ? (
                              <span className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-amber-500" fill="#f59e0b" />
                                عالي
                              </span>
                            ) : project.priority === "متوسط" ? (
                              <span>متوسط</span>
                            ) : (
                              <span>منخفض</span>
                            )}
                          </div>
                          <h3 className="font-bold text-right">{project.title}</h3>
                        </div>
                        <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
                          <span>{project.deadline}</span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {project.members} أعضاء
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>{project.progress}%</span>
                            <span>التقدم</span>
                          </div>
                          <Progress value={project.progress} className="h-2 bg-indigo-100 dark:bg-indigo-950">
                            <div 
                              className={`h-full ${project.progress > 66 ? 'bg-green-500' : project.progress > 33 ? 'bg-amber-500' : 'bg-red-500'}`}
                              style={{ width: `${project.progress}%` }}
                            />
                          </Progress>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Resources Section */}
              <Card className="border-indigo-200 dark:border-indigo-900 shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-right text-lg font-bold text-indigo-700 dark:text-indigo-400">
                      الموارد السرية
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="text-indigo-600 dark:text-indigo-400">
                      <Database className="h-4 w-4 mr-1" /> عرض الكل
                    </Button>
                  </div>
                  <CardDescription className="text-right text-muted-foreground">
                    الموارد المتاحة لأعضاء المنظمة فقط
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-indigo-200 dark:border-indigo-800">
                          <th className="py-2 px-2 text-right text-indigo-700 dark:text-indigo-400 font-medium">آخر تحديث</th>
                          <th className="py-2 px-2 text-right text-indigo-700 dark:text-indigo-400 font-medium">مستوى الوصول</th>
                          <th className="py-2 px-2 text-right text-indigo-700 dark:text-indigo-400 font-medium">النوع</th>
                          <th className="py-2 px-2 text-right text-indigo-700 dark:text-indigo-400 font-medium">اسم المورد</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isDataLoading ? <p>Loading resources...</p> : resources.map(resource => (
                          <tr key={resource.id} className="border-b border-indigo-100 dark:border-indigo-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors">
                            <td className="py-3 px-2 text-right text-sm">{resource.lastUpdated}</td>
                            <td className="py-3 px-2 text-right">
                              <span className={`inline-block px-2 py-1 rounded-full text-xs ${resource.access === "كامل" ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'}`}>
                                {resource.access}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-right text-sm">{resource.type}</td>
                            <td className="py-3 px-2 text-right font-medium">{resource.title}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Organization Members */}
              <Card className="border-indigo-200 dark:border-indigo-900 shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-right text-lg font-bold text-indigo-700 dark:text-indigo-400">
                      أعضاء المنظمة
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="text-indigo-600 dark:text-indigo-400">
                      <UserPlus className="h-4 w-4 mr-1" /> دعوة
                    </Button>
                  </div>
                  <CardDescription className="text-right text-muted-foreground">
                    الأعضاء النشطون حالياً
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {isDataLoading ? <p>Loading members...</p> : members.map(member => (
                      <div key={member.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${member.status === "متصل" ? 'bg-green-500' : member.status === "مشغول" ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                          <span className="text-xs text-muted-foreground">{member.role}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-medium">{member.name}</div>
                            <div className="text-xs text-muted-foreground">{member.expertise}</div>
                          </div>
                          <Avatar className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border-2 border-indigo-200 dark:border-indigo-700">
                            <AvatarFallback>{member.avatar}</AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Meetings */}
              <Card className="border-indigo-200 dark:border-indigo-900 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-right text-lg font-bold text-indigo-700 dark:text-indigo-400">
                    الاجتماعات القادمة
                  </CardTitle>
                  <CardDescription className="text-right text-muted-foreground">
                    جدول الاجتماعات للأسبوع الحالي
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {isDataLoading ? <p>Loading meetings...</p> : meetings.map(meeting => (
                      <div key={meeting.id} className="border border-indigo-100 dark:border-indigo-900 rounded-lg p-3 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors">
                        <h3 className="font-medium text-right mb-1">{meeting.title}</h3>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {meeting.participants}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {meeting.date}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" className="w-full border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950">
                    <Calendar className="h-4 w-4 mr-2" />
                    عرض التقويم الكامل
                  </Button>
                </CardFooter>
              </Card>

              {/* Quick Actions */}
              <Card className="border-indigo-200 dark:border-indigo-900 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-right text-lg font-bold text-indigo-700 dark:text-indigo-400">
                    إجراءات سريعة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 h-auto py-3 flex flex-col items-center">
                      <FileCode className="h-5 w-5 mb-1" />
                      <span className="text-xs">إنشاء مشروع</span>
                    </Button>
                    <Button variant="outline" className="border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 h-auto py-3 flex flex-col items-center">
                      <UserPlus className="h-5 w-5 mb-1" />
                      <span className="text-xs">دعوة عضو</span>
                    </Button>
                    <Button variant="outline" className="border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 h-auto py-3 flex flex-col items-center">
                      <MessageCircle className="h-5 w-5 mb-1" />
                      <span className="text-xs">رسالة جديدة</span>
                    </Button>
                    <Button variant="outline" className="border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 h-auto py-3 flex flex-col items-center">
                      <Database className="h-5 w-5 mb-1" />
                      <span className="text-xs">إضافة مورد</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SecretOrganization;