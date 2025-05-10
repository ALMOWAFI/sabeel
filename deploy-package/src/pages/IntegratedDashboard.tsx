import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GraduationCap,
  BookText,
  Video,
  Puzzle,
  Code,
  Network,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Database,
  Braces,
  Brain,
  CircuitBoard
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Helper function to get status badge variant
const getStatusBadgeVariant = (status: 'online' | 'offline' | 'maintenance') => {
  switch(status) {
    case 'online':
      return 'default' as const;
    case 'maintenance':
      return 'secondary' as const;
    case 'offline':
      return 'destructive' as const;
    default:
      return 'outline' as const;
  }
};

// Helper function to get status icon
const getStatusIcon = (status: 'online' | 'offline' | 'maintenance') => {
  switch(status) {
    case 'online':
      return <CheckCircle className="h-4 w-4" />;
    case 'maintenance':
      return <AlertTriangle className="h-4 w-4" />;
    case 'offline':
      return <XCircle className="h-4 w-4" />;
    default:
      return null;
  }
};

// Helper function to get system icon
const getSystemIcon = (id: string) => {
  switch(id) {
    case 'edx':
      return <GraduationCap className="h-6 w-6" />;
    case 'canvas':
      return <BookText className="h-6 w-6" />;
    case 'peertube':
      return <Video className="h-6 w-6" />;
    case 'h5p':
      return <Puzzle className="h-6 w-6" />;
    case 'jupyter':
      return <Code className="h-6 w-6" />;
    case 'kingraph':
      return <Network className="h-6 w-6" />;
    case 'appwrite':
      return <Database className="h-6 w-6" />;
    case 'tensorflow':
      return <Brain className="h-6 w-6" />;
    default:
      return <GraduationCap className="h-6 w-6" />;
  }
};

// Types definition
interface SystemStats {
  users: number;
  content: number;
  activity: number;
}

interface SystemStatus {
  status: 'online' | 'offline' | 'maintenance';
  message: string;
  lastUpdated: string;
}

interface IntegrationSystem {
  id: string;
  name: string;
  description: string;
  stats: SystemStats;
  status: SystemStatus;
  url: string;
  color: string;
}

/**
 * IntegratedDashboard Component
 * 
 * A unified dashboard that integrates all educational systems of the Sabeel platform
 */
const IntegratedDashboard: React.FC = () => {
  const [systemsData, setSystemsData] = useState<IntegrationSystem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  
  // In a real application, we would fetch data from an API
  // For now, we'll simulate this with a timeout
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API fetch delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Normally we would fetch from an API like:
        // const response = await fetch('/api/integration/status');
        // const data = await response.json();
        // setSystemsData(data.systems);
        
        // For now, use default data
        setSystemsData(defaultSystemsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching integration status:', error);
        toast({
          title: "خطأ في تحميل البيانات",
          description: "تعذر الاتصال بواجهة برمجة التطبيقات. تم تحميل البيانات الافتراضية.",
          variant: "destructive",
        });
        setSystemsData(defaultSystemsData);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Default systems data
  const defaultSystemsData: IntegrationSystem[] = [
    {
      id: 'edx',
      name: 'مساقات سبيل التعليمية',
      description: 'منصة مساقات متكاملة للتعليم المفتوح لأحدث الدورات الإسلامية',
      stats: { users: 2547, content: 83, activity: 92 },
      status: { status: 'online', message: 'All systems operational', lastUpdated: '2025-05-10T04:30:00Z' },
      url: '/learn/edx',
      color: '#B91C1C'
    },
    {
      id: 'canvas',
      name: 'بيئة التعليم التفاعلية',
      description: 'نظام إدارة التعلم مع تخصيصات للمحتوى الإسلامي والتراث العلمي',
      stats: { users: 1893, content: 67, activity: 78 },
      status: { status: 'online', message: 'All systems operational', lastUpdated: '2025-05-10T04:30:00Z' },
      url: '/learn/canvas',
      color: '#B45309'
    },
    {
      id: 'peertube',
      name: 'قناة سبيل الفيديو',
      description: 'منصة فيديو مفتوحة المصدر للمحاضرات والخطب والدروس الإسلامية',
      stats: { users: 3152, content: 412, activity: 89 },
      status: { status: 'maintenance', message: 'Scheduled maintenance', lastUpdated: '2025-05-10T03:15:00Z' },
      url: '/media/videos',
      color: '#047857'
    },
    {
      id: 'h5p',
      name: 'محتوى سبيل التفاعلي',
      description: 'محتوى تعليمي تفاعلي متخصص للدراسات الإسلامية والقرآنية',
      stats: { users: 1420, content: 159, activity: 84 },
      status: { status: 'online', message: 'All systems operational', lastUpdated: '2025-05-10T04:30:00Z' },
      url: '/learn/interactive',
      color: '#6D28D9'
    },
    {
      id: 'jupyter',
      name: 'مختبر البحوث الإسلامية',
      description: 'منصة للبحوث العلمية والتحليل الإحصائي للنصوص الإسلامية',
      stats: { users: 843, content: 71, activity: 62 },
      status: { status: 'online', message: 'All systems operational', lastUpdated: '2025-05-10T04:15:00Z' },
      url: '/research/lab',
      color: '#1D4ED8'
    },
    {
      id: 'kingraph',
      name: 'شبكة المعرفة الإسلامية',
      description: 'رسم بياني تفاعلي للعلاقات بين العلماء والكتب والمفاهيم الإسلامية',
      stats: { users: 1256, content: 3824, activity: 76 },
      status: { status: 'online', message: 'All systems operational', lastUpdated: '2025-05-10T04:30:00Z' },
      url: '/research/knowledge-graph',
      color: '#0E7490'
    },
    {
      id: 'appwrite',
      name: 'خدمات المنصة المتكاملة',
      description: 'خدمات التخزين والمصادقة وقواعد البيانات التي تعزز تجربة المستخدم وتضمن أمان البيانات',
      stats: { users: 5874, content: 9650, activity: 98 },
      status: { status: 'online', message: 'All systems operational', lastUpdated: '2025-05-10T07:55:00Z' },
      url: '/system/appwrite',
      color: '#DB2777'
    },
    {
      id: 'tensorflow',
      name: 'مساعد الذكاء الاصطناعي',
      description: 'منظومة الذكاء الاصطناعي المتخصصة في تحليل النصوص الإسلامية وتعزيز شبكة المعرفة',
      stats: { users: 3241, content: 452, activity: 95 },
      status: { status: 'online', message: 'All systems operational', lastUpdated: '2025-05-10T07:55:00Z' },
      url: '/research/ai',
      color: '#4F46E5'
    }
  ];

  // Filter systems based on active category
  const filteredSystems = activeCategory === 'all' 
    ? systemsData 
    : systemsData.filter(system => {
        if (activeCategory === 'learning' && ['edx', 'canvas', 'h5p'].includes(system.id)) return true;
        if (activeCategory === 'research' && ['jupyter', 'kingraph'].includes(system.id)) return true;
        if (activeCategory === 'media' && ['peertube'].includes(system.id)) return true;
        return false;
      });

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'الكل' },
    { id: 'learning', name: 'التعلم' },
    { id: 'research', name: 'البحث العلمي' },
    { id: 'media', name: 'الوسائط' }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">لوحة التحكم الموحدة</h1>
        <p className="text-muted-foreground mb-6">
          استكشف جميع أنظمة منصة سبيل التعليمية المتكاملة في مكان واحد
        </p>
        
        {/* Category filters */}
        <Tabs defaultValue={activeCategory} onValueChange={setActiveCategory} className="mb-6">
          <TabsList className="grid grid-cols-4 max-w-md">
            {categories.map(category => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Systems overview */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">نظرة عامة على الأنظمة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSystems.map(system => (
            <Card key={system.id} className="overflow-hidden transition-all hover:translate-y-[-4px] hover:shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div
                    className="p-3 rounded-full"
                    style={{ backgroundColor: system.color, color: 'white' }}
                  >
                    {getSystemIcon(system.id)}
                  </div>
                  <Badge variant={getStatusBadgeVariant(system.status.status)}>
                    {system.status.status === 'online' ? 'متصل' : 
                     system.status.status === 'maintenance' ? 'صيانة' : 'غير متصل'}
                  </Badge>
                </div>
                <CardTitle className="mt-4">{system.name}</CardTitle>
                <CardDescription className="min-h-[4rem]">
                  {system.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-xl font-bold text-primary">{system.stats.users}</p>
                    <p className="text-xs text-muted-foreground">المستخدمون</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-primary">{system.stats.content}</p>
                    <p className="text-xs text-muted-foreground">المحتويات</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-primary">{system.stats.activity}%</p>
                    <p className="text-xs text-muted-foreground">النشاط</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full" style={{ backgroundColor: system.color }}>
                  <Link to={system.url}>استكشاف</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent activities across systems */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">أحدث الأنشطة</h2>
        <Card>
          <CardContent className="py-6">
            <p className="text-center text-muted-foreground">
              سيتم عرض أحدث الأنشطة من جميع الأنظمة المتكاملة هنا عند توفر بيانات API
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Integration status summary */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">حالة التكامل</h2>
        <Card>
          <CardContent className="py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {systemsData.map(system => (
                <div key={`status-${system.id}`} className="mb-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10" style={{ backgroundColor: system.color }}>
                      <AvatarFallback>{system.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{system.name}</p>
                      <Badge variant={getStatusBadgeVariant(system.status.status)} className="mt-1">
                        {getStatusIcon(system.status.status)}
                        <span className="ml-1">
                          {system.status.status === 'online' ? 'متصل' : 
                           system.status.status === 'maintenance' ? 'صيانة' : 'غير متصل'}
                        </span>
                      </Badge>
                    </div>
                  </div>
                  <Separator className="my-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IntegratedDashboard;
