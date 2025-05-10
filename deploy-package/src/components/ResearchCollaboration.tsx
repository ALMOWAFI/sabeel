import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  FileText, 
  Users,
  BookOpen,
  MessageSquare,
  Search,
  CheckCircle2,
  Clock,
  Link,
  PenTool,
  Briefcase,
  Calendar,
  Globe,
  ArrowUpRight,
  PlusCircle,
  ScrollText,
  LucideLayoutDashboard
} from "lucide-react";

// Mock research areas
const researchAreas = [
  { id: "tafsir", name: "التفسير وعلوم القرآن", projects: 85, researchers: 324 },
  { id: "hadith", name: "الحديث وعلومه", projects: 64, researchers: 256 },
  { id: "fiqh", name: "الفقه وأصوله", projects: 92, researchers: 412 },
  { id: "aqeedah", name: "العقيدة", projects: 43, researchers: 187 },
  { id: "seerah", name: "السيرة والتاريخ الإسلامي", projects: 36, researchers: 153 },
  { id: "ethics", name: "الأخلاق والتزكية", projects: 28, researchers: 124 },
  { id: "technology", name: "التقنية والعلوم الإسلامية", projects: 47, researchers: 231 },
  { id: "contemporary", name: "القضايا المعاصرة", projects: 72, researchers: 318 }
];

// Mock active projects
const activeProjects = [
  {
    id: 1,
    title: "تطوير معجم شامل للمصطلحات القرآنية",
    area: "التفسير وعلوم القرآن",
    status: "قيد التنفيذ",
    completion: 65,
    members: 8,
    leadResearcher: {
      name: "د. محمد عبدالله",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      institution: "جامعة الأزهر"
    },
    startDate: "2024-01-15",
    endDate: "2025-03-30",
    lastUpdated: "قبل يومين",
    description: "مشروع بحثي لإنشاء معجم شامل للمصطلحات القرآنية يجمع بين التفسير اللغوي والاصطلاحي والسياقي، مع ربط المصطلحات بالدراسات المعاصرة."
  },
  {
    id: 2,
    title: "تحليل الأحاديث النبوية باستخدام تقنيات الذكاء الاصطناعي",
    area: "الحديث وعلومه",
    status: "قيد التنفيذ",
    completion: 42,
    members: 6,
    leadResearcher: {
      name: "د. أحمد الزهراني",
      avatar: "https://randomuser.me/api/portraits/men/42.jpg",
      institution: "جامعة الملك عبدالعزيز"
    },
    startDate: "2023-11-10",
    endDate: "2024-12-31",
    lastUpdated: "قبل أسبوع",
    description: "دراسة تطبيقية لاستخدام تقنيات الذكاء الاصطناعي في تصنيف وتحليل متون الأحاديث النبوية وأسانيدها، وتطوير نماذج للكشف عن العلل والشذوذ."
  },
  {
    id: 3,
    title: "النوازل الفقهية في العصر الرقمي",
    area: "الفقه وأصوله",
    status: "قيد التنفيذ",
    completion: 78,
    members: 12,
    leadResearcher: {
      name: "د. فاطمة المالكي",
      avatar: "https://randomuser.me/api/portraits/women/22.jpg",
      institution: "جامعة القرويين"
    },
    startDate: "2023-09-05",
    endDate: "2024-08-30",
    lastUpdated: "قبل 3 أيام",
    description: "بحث تأصيلي في النوازل الفقهية المتعلقة بالتقنيات الحديثة مثل العملات الرقمية والذكاء الاصطناعي والواقع الافتراضي، وتأصيلها وفق القواعد الأصولية."
  },
  {
    id: 4,
    title: "الأخلاق الإسلامية وتطبيقاتها في تطوير تقنيات الذكاء الاصطناعي",
    area: "الأخلاق والتزكية",
    status: "قيد التنفيذ",
    completion: 35,
    members: 9,
    leadResearcher: {
      name: "د. عمر الحسيني",
      avatar: "https://randomuser.me/api/portraits/men/15.jpg",
      institution: "جامعة الإمام محمد بن سعود"
    },
    startDate: "2024-02-20",
    endDate: "2025-06-15",
    lastUpdated: "أمس",
    description: "دراسة أخلاقية تأصيلية لوضع معايير إسلامية لتطوير تقنيات الذكاء الاصطناعي، وتطبيق القيم الإسلامية في عمليات اتخاذ القرار الآلي."
  }
];

// Mock recommended projects
const recommendedProjects = [
  {
    id: 5,
    title: "تطوير منهجية مقترحة لدراسة مقاصد السور القرآنية",
    area: "التفسير وعلوم القرآن",
    status: "يبحث عن باحثين",
    completion: 0,
    members: 2,
    leadResearcher: {
      name: "د. سعيد المقدسي",
      avatar: "https://randomuser.me/api/portraits/men/62.jpg",
      institution: "جامعة أم القرى"
    },
    startDate: "قريباً",
    endDate: "غير محدد",
    lastUpdated: "قبل 5 أيام",
    description: "مشروع بحثي لتطوير منهجية متكاملة لدراسة مقاصد السور القرآنية وعلاقتها بترتيب السور ووحدتها الموضوعية، مع تطبيقات عملية على سور مختارة."
  },
  {
    id: 6,
    title: "بناء قاعدة بيانات ذكية للفتاوى المعاصرة",
    area: "الفقه وأصوله",
    status: "يبحث عن باحثين",
    completion: 0,
    members: 3,
    leadResearcher: {
      name: "د. خالد العنزي",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      institution: "جامعة الكويت"
    },
    startDate: "قريباً",
    endDate: "غير محدد",
    lastUpdated: "قبل أسبوع",
    description: "مشروع تقني لبناء قاعدة بيانات ذكية للفتاوى المعاصرة مع تصنيفها وتبويبها وربطها بالأدلة الشرعية والقواعد الفقهية، وتوفير خوارزميات بحث متقدمة."
  }
];

// Mock completed projects
const completedProjects = [
  {
    id: 7,
    title: "أثر وسائل التواصل الاجتماعي على الخطاب الديني المعاصر",
    area: "القضايا المعاصرة",
    status: "مكتمل",
    completion: 100,
    members: 7,
    leadResearcher: {
      name: "د. عائشة الزبيدي",
      avatar: "https://randomuser.me/api/portraits/women/42.jpg",
      institution: "جامعة محمد الخامس"
    },
    startDate: "2022-06-10",
    endDate: "2023-08-15",
    lastUpdated: "قبل شهرين",
    description: "دراسة تحليلية لتأثير منصات التواصل الاجتماعي على تشكيل الخطاب الديني المعاصر، وتحليل الاتجاهات الجديدة وأساليب التأثير والانتشار.",
    results: "تم نشر الدراسة في مجلة الدراسات الإسلامية المعاصرة، وإصدار كتاب بعنوان 'الدين في العصر الرقمي'."
  },
  {
    id: 8,
    title: "تطوير معجم إلكتروني لمصطلحات الحديث النبوي",
    area: "الحديث وعلومه",
    status: "مكتمل",
    completion: 100,
    members: 5,
    leadResearcher: {
      name: "د. عبدالرحمن الشافعي",
      avatar: "https://randomuser.me/api/portraits/men/52.jpg",
      institution: "الجامعة الإسلامية بالمدينة المنورة"
    },
    startDate: "2022-03-25",
    endDate: "2023-12-10",
    lastUpdated: "قبل 3 أشهر",
    description: "إنشاء معجم إلكتروني تفاعلي لمصطلحات علوم الحديث مع شروحات مفصلة وأمثلة تطبيقية وربط بالمصادر الأصلية.",
    results: "تم إطلاق المعجم الإلكتروني على موقع مستقل، وتطوير تطبيق للهواتف الذكية، وإتاحته مجاناً للباحثين والطلاب."
  }
];

// Mock research events
const upcomingEvents = [
  {
    id: 1,
    title: "المؤتمر الدولي للدراسات القرآنية المعاصرة",
    date: "2024-10-15",
    location: "الرياض، المملكة العربية السعودية",
    organizer: "جامعة الملك سعود",
    type: "مؤتمر",
    virtual: false,
    description: "مؤتمر دولي يجمع العلماء والباحثين لمناقشة أحدث الدراسات والأبحاث في مجال الدراسات القرآنية المعاصرة."
  },
  {
    id: 2,
    title: "ورشة عمل: منهجية البحث في التراث الإسلامي",
    date: "2024-07-05",
    location: "عبر الإنترنت",
    organizer: "مؤسسة سبيل للدراسات الإسلامية",
    type: "ورشة عمل",
    virtual: true,
    description: "ورشة عمل تفاعلية حول منهجية البحث العلمي في التراث الإسلامي وأساليب التحقيق والتوثيق."
  },
  {
    id: 3,
    title: "ندوة: الذكاء الاصطناعي والدراسات الإسلامية",
    date: "2024-08-20",
    location: "القاهرة، مصر",
    organizer: "جامعة الأزهر",
    type: "ندوة",
    virtual: false,
    description: "ندوة علمية تناقش تطبيقات الذكاء الاصطناعي في خدمة الدراسات الإسلامية والتحديات والفرص المستقبلية."
  }
];

const ResearchCollaboration: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter projects based on search term
  const filterProjects = (projects: any[]) => {
    if (!searchTerm) return projects;
    return projects.filter(project => 
      project.title.includes(searchTerm) || 
      project.area.includes(searchTerm) || 
      project.description.includes(searchTerm)
    );
  };
  
  // Render project card
  const renderProjectCard = (project: any) => (
    <Card key={project.id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge 
            className={`${
              project.status === "مكتمل" ? "bg-green-100 text-green-800" : 
              project.status === "قيد التنفيذ" ? "bg-blue-100 text-blue-800" : 
              "bg-amber-100 text-amber-800"
            }`}
          >
            {project.status}
          </Badge>
          <CardTitle className="text-right text-lg">{project.title}</CardTitle>
        </div>
        <CardDescription className="text-right flex justify-between items-center">
          <span className="text-xs">{project.lastUpdated}</span>
          <span>{project.area}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="text-right mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
            {project.description}
          </p>
        </div>
        
        {project.completion > 0 && (
          <div className="mb-4 bg-gray-100 dark:bg-gray-800 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                project.completion === 100 ? "bg-green-600" : "bg-blue-600"
              }`}
              style={{ width: `${project.completion}%` }}
            ></div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{project.completion}% مكتمل</span>
              <div className="flex items-center">
                <Clock className="h-3 w-3 ml-1" />
                <span>{project.startDate} - {project.endDate}</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Users className="h-4 w-4 ml-1 text-gray-500" />
            <span className="text-sm text-gray-600">{project.members} باحثين</span>
          </div>
          
          <div className="flex items-center">
            <div className="flex -space-x-2 rtl:space-x-reverse ml-2">
              <Avatar className="h-6 w-6 border-2 border-white dark:border-gray-800">
                <AvatarImage src={project.leadResearcher.avatar} alt={project.leadResearcher.name} />
                <AvatarFallback>{project.leadResearcher.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {project.members > 1 && (
                <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs">
                  +{project.members - 1}
                </div>
              )}
            </div>
            <span className="text-sm font-medium">{project.leadResearcher.name}</span>
          </div>
        </div>
        
        {project.results && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-right">
            <div className="flex items-center justify-end mb-1">
              <span className="font-medium">نتائج البحث</span>
              <CheckCircle2 className="h-4 w-4 mr-1 text-green-600" />
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {project.results}
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-end">
        {project.status === "يبحث عن باحثين" ? (
          <Button>
            <PlusCircle className="h-4 w-4 ml-1" />
            انضم للمشروع
          </Button>
        ) : project.status === "مكتمل" ? (
          <Button variant="outline">
            <FileText className="h-4 w-4 ml-1" />
            عرض النتائج
          </Button>
        ) : (
          <Button variant="outline">
            <LucideLayoutDashboard className="h-4 w-4 ml-1" />
            لوحة المشروع
          </Button>
        )}
      </CardFooter>
    </Card>
  );
  
  // Render event card
  const renderEventCard = (event: any) => (
    <Card key={event.id}>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-16 h-16 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
            <span className="text-lg font-bold">
              {new Date(event.date).getDate()}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(event.date).toLocaleDateString('ar-EG', { month: 'short' })}
            </span>
          </div>
          
          <div className="flex-1 text-right">
            <div className="flex justify-between items-start">
              <Badge variant={event.virtual ? "outline" : "default"}>
                {event.type}
              </Badge>
              <h3 className="font-bold mb-1">{event.title}</h3>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {event.description}
            </p>
            
            <div className="flex flex-wrap justify-between text-sm">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 ml-1 text-gray-500" />
                <span>{new Date(event.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              
              <div className="flex items-center">
                {event.virtual ? (
                  <>
                    <Globe className="h-4 w-4 ml-1 text-gray-500" />
                    <span>{event.location}</span>
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4 ml-1 text-gray-500" />
                    <span>{event.location}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
  
  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-right">التعاون البحثي</h2>
            <p className="text-gray-500 dark:text-gray-400 text-right">
              اكتشف المشاريع البحثية وتعاون مع العلماء والباحثين من حول العالم
            </p>
          </div>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="البحث عن مشاريع..."
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sabeel-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Research Areas Sidebar */}
        <div className="col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-right">مجالات البحث</CardTitle>
              <CardDescription className="text-right">
                استكشف مجالات البحث في العلوم الإسلامية
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-400px)]">
                <div className="px-4 py-2">
                  {researchAreas.map(area => (
                    <div 
                      key={area.id}
                      className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer"
                    >
                      <div className="text-xs text-gray-500">
                        <div>{area.projects} مشروع</div>
                        <div>{area.researchers} باحث</div>
                      </div>
                      <span className="font-medium text-right">{area.name}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
            
            <CardFooter className="p-4">
              <Button variant="outline" className="w-full">
                <PenTool className="h-4 w-4 ml-1" />
                اقتراح مجال بحث جديد
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Projects Content */}
        <div className="col-span-1 md:col-span-3">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <TabsList className="grid grid-cols-3 w-full md:w-auto">
                <TabsTrigger value="active">مشاريع نشطة</TabsTrigger>
                <TabsTrigger value="recommended">موصى بها</TabsTrigger>
                <TabsTrigger value="completed">مكتملة</TabsTrigger>
              </TabsList>
              
              <Button variant="outline" size="sm" className="hidden md:flex">
                <PlusCircle className="h-4 w-4 ml-1" />
                إنشاء مشروع بحثي
              </Button>
            </div>
            
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <Spinner size="lg" className="mr-2" />
                <span>جاري تحميل المشاريع البحثية...</span>
              </div>
            ) : (
              <>
                <TabsContent value="active" className="flex-1 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filterProjects(activeProjects).map(renderProjectCard)}
                  </div>
                </TabsContent>
                
                <TabsContent value="recommended" className="flex-1 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filterProjects(recommendedProjects).map(renderProjectCard)}
                  </div>
                </TabsContent>
                
                <TabsContent value="completed" className="flex-1 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filterProjects(completedProjects).map(renderProjectCard)}
                  </div>
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </div>
      
      {/* Upcoming Events */}
      <div>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-right">الفعاليات البحثية القادمة</CardTitle>
            <CardDescription className="text-right">
              مؤتمرات وندوات وورش عمل قادمة في مجالات البحث الإسلامي
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {upcomingEvents.map(renderEventCard)}
            </div>
          </CardContent>
          
          <CardFooter className="p-4 flex justify-center">
            <Button variant="outline">
              <Calendar className="h-4 w-4 ml-1" />
              عرض جميع الفعاليات
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Research Resources */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg p-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-sm">
            <Briefcase className="h-10 w-10 text-blue-600" />
          </div>
          
          <div className="flex-1 text-center md:text-right">
            <h3 className="text-lg font-bold mb-1">موارد البحث العلمي</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              موارد متخصصة للباحثين في العلوم الإسلامية، تشمل قواعد بيانات وأدوات بحثية ونماذج وإرشادات منهجية.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline">
              <Link className="h-4 w-4 ml-1" />
              قواعد البيانات
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <ScrollText className="h-4 w-4 ml-1" />
              دليل الباحث
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchCollaboration;

// Missing MapPin component, adding it here for the code to compile
const MapPin = ({ className }: { className?: string }) => {
  return <div className={className}>📍</div>;
};
