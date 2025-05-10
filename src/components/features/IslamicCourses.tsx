import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  GraduationCap,
  Users,
  Star,
  Clock,
  Calendar,
  Search,
  Filter,
  Tag,
  ArrowUpRight,
  Play,
  FileText,
  CheckCircle
} from "lucide-react";

// Mock categories
const courseCategories = [
  { id: "quran", name: "علوم القرآن", count: 24 },
  { id: "hadith", name: "علوم الحديث", count: 18 },
  { id: "fiqh", name: "الفقه", count: 32 },
  { id: "aqeedah", name: "العقيدة", count: 15 },
  { id: "seerah", name: "السيرة النبوية", count: 12 },
  { id: "tafseer", name: "التفسير", count: 28 },
  { id: "arabic", name: "اللغة العربية", count: 20 },
  { id: "contemporary", name: "قضايا معاصرة", count: 16 }
];

// Mock courses data
const featuredCourses = [
  {
    id: 1,
    title: "أصول التفسير ومناهج المفسرين",
    instructor: "د. إبراهيم الخليلي",
    category: "التفسير",
    level: "متقدم",
    duration: "12 أسبوع",
    lessons: 36,
    enrollments: 1842,
    rating: 4.8,
    image: "https://source.unsplash.com/random/400x300/?quran",
    price: "مجاني",
    progress: 0,
    featured: true,
    description: "دورة متخصصة في علم أصول التفسير ومناهج العلماء في تفسير القرآن الكريم، من التفسير بالمأثور إلى التفسير بالرأي والاجتهاد."
  },
  {
    id: 2,
    title: "تخريج الأحاديث وعلم الجرح والتعديل",
    instructor: "د. عائشة الرحماني",
    category: "علوم الحديث",
    level: "متوسط",
    duration: "8 أسابيع",
    lessons: 24,
    enrollments: 1245,
    rating: 4.7,
    image: "https://source.unsplash.com/random/400x300/?books",
    price: "مجاني",
    progress: 0,
    featured: true,
    description: "دورة شاملة في تخريج الأحاديث النبوية وعلم الجرح والتعديل، تتضمن المنهجية العلمية في التحقق من صحة الأحاديث وتقييم الرواة."
  },
  {
    id: 3,
    title: "المقاصد الشرعية في الفقه الإسلامي",
    instructor: "د. محمد العمري",
    category: "الفقه",
    level: "متقدم",
    duration: "10 أسابيع",
    lessons: 30,
    enrollments: 975,
    rating: 4.9,
    image: "https://source.unsplash.com/random/400x300/?mosque",
    price: "مجاني",
    progress: 0,
    featured: true,
    description: "دراسة تحليلية لمقاصد الشريعة الإسلامية وتطبيقاتها في الفقه الإسلامي المعاصر، مع التركيز على كيفية تطبيق المقاصد في النوازل المعاصرة."
  }
];

const popularCourses = [
  {
    id: 4,
    title: "مدخل إلى الفقه الإسلامي",
    instructor: "د. أحمد الفقيه",
    category: "الفقه",
    level: "مبتدئ",
    duration: "6 أسابيع",
    lessons: 18,
    enrollments: 3256,
    rating: 4.6,
    image: "https://source.unsplash.com/random/400x300/?islam",
    price: "مجاني",
    progress: 0,
    featured: false,
    description: "مقدمة شاملة في علم الفقه الإسلامي، تتناول تاريخ الفقه وتطوره، والمذاهب الفقهية، وأصول الفقه، والقواعد الفقهية الأساسية."
  },
  {
    id: 5,
    title: "علوم القرآن الكريم",
    instructor: "د. فاطمة الزهراء",
    category: "علوم القرآن",
    level: "مبتدئ",
    duration: "8 أسابيع",
    lessons: 24,
    enrollments: 2874,
    rating: 4.8,
    image: "https://source.unsplash.com/random/400x300/?quran",
    price: "مجاني",
    progress: 0,
    featured: false,
    description: "دورة تأسيسية في علوم القرآن الكريم، تشمل تاريخ القرآن وجمعه وتدوينه، وأسباب النزول، والمكي والمدني، والناسخ والمنسوخ، والمحكم والمتشابه."
  },
  {
    id: 6,
    title: "السيرة النبوية والشمائل المحمدية",
    instructor: "د. خالد المدني",
    category: "السيرة النبوية",
    level: "مبتدئ",
    duration: "12 أسبوع",
    lessons: 36,
    enrollments: 3542,
    rating: 4.9,
    image: "https://source.unsplash.com/random/400x300/?medina",
    price: "مجاني",
    progress: 0,
    featured: false,
    description: "دراسة تفصيلية لسيرة النبي محمد صلى الله عليه وسلم من المولد إلى الوفاة، مع استخلاص الدروس والعبر لتطبيقها في حياتنا المعاصرة."
  }
];

const enrolledCourses = [
  {
    id: 7,
    title: "الإعجاز العلمي في القرآن الكريم",
    instructor: "د. زكريا الرازي",
    category: "علوم القرآن",
    level: "متوسط",
    duration: "8 أسابيع",
    lessons: 24,
    enrollments: 1543,
    rating: 4.7,
    image: "https://source.unsplash.com/random/400x300/?science",
    price: "مجاني",
    progress: 45,
    featured: false,
    description: "استعراض للإشارات العلمية في القرآن الكريم وكيف تتوافق مع الاكتشافات العلمية الحديثة، مع تحليل المنهجية الصحيحة للتعامل مع الإعجاز العلمي."
  },
  {
    id: 8,
    title: "العقيدة الإسلامية: دراسة مقارنة",
    instructor: "د. عمر الحنبلي",
    category: "العقيدة",
    level: "متقدم",
    duration: "10 أسابيع",
    lessons: 30,
    enrollments: 845,
    rating: 4.8,
    image: "https://source.unsplash.com/random/400x300/?faith",
    price: "مجاني",
    progress: 75,
    featured: false,
    description: "دراسة مقارنة للعقيدة الإسلامية مع غيرها من العقائد، مع التركيز على أصول الإيمان والتوحيد والقضاء والقدر والغيبيات في الإسلام."
  }
];

const IslamicCourses: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("featured");
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter courses based on search term
  const filterCourses = (courses: any[]) => {
    if (!searchTerm) return courses;
    return courses.filter(course => 
      course.title.includes(searchTerm) || 
      course.instructor.includes(searchTerm) || 
      course.category.includes(searchTerm)
    );
  };
  
  // Render course card
  const renderCourseCard = (course: any) => (
    <Card key={course.id} className="overflow-hidden">
      <div className="relative h-48">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        {course.featured && (
          <Badge className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-amber-700">
            مميز
          </Badge>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-4">
            <Badge variant="secondary" className="mb-2">
              {course.category}
            </Badge>
            <h3 className="text-lg font-bold text-white mb-1 text-right">
              {course.title}
            </h3>
            <p className="text-sm text-gray-200 text-right">
              {course.instructor}
            </p>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="text-right mb-3">
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {course.description}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="text-right">
            <p className="text-xs text-gray-500">المستوى</p>
            <p className="text-sm font-medium">{course.level}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">المدة</p>
            <p className="text-sm font-medium">{course.duration}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">عدد الدروس</p>
            <p className="text-sm font-medium">{course.lessons} درس</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">المسجلون</p>
            <p className="text-sm font-medium">{course.enrollments.toLocaleString()}</p>
          </div>
        </div>
        
        {course.progress > 0 && (
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500">{course.progress}%</span>
              <span className="text-xs text-gray-500">إكمال الدورة</span>
            </div>
            <Progress value={course.progress} className="h-2" />
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            <span className="text-sm font-medium ml-1">{course.rating}</span>
          </div>
          <Badge variant={course.price === "مجاني" ? "outline" : "default"}>
            {course.price}
          </Badge>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-end">
        {course.progress > 0 ? (
          <Button className="w-full">
            <Play className="h-4 w-4 ml-1" />
            متابعة الدورة
          </Button>
        ) : (
          <Button variant="outline" className="w-full">
            <GraduationCap className="h-4 w-4 ml-1" />
            التسجيل في الدورة
          </Button>
        )}
      </CardFooter>
    </Card>
  );
  
  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-right">الدورات الإسلامية</h2>
            <p className="text-gray-500 dark:text-gray-400 text-right">
              استكشف دورات تعليمية في مختلف العلوم الإسلامية
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="البحث عن دورة..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sabeel-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Categories Sidebar */}
        <div className="col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-right">التصنيفات</CardTitle>
            </CardHeader>
            
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-400px)]">
                <div className="px-4 py-2">
                  {courseCategories.map(category => (
                    <div 
                      key={category.id}
                      className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer"
                    >
                      <Badge variant="outline">{category.count}</Badge>
                      <span className="font-medium">{category.name}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
            
            <CardFooter className="p-4">
              <Button variant="outline" className="w-full">
                <Tag className="h-4 w-4 ml-1" />
                عرض جميع التصنيفات
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Courses Content */}
        <div className="col-span-1 md:col-span-3">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <TabsList className="grid grid-cols-3 w-full md:w-auto">
                <TabsTrigger value="featured">دورات مميزة</TabsTrigger>
                <TabsTrigger value="popular">الأكثر شيوعاً</TabsTrigger>
                <TabsTrigger value="enrolled">دوراتي</TabsTrigger>
              </TabsList>
              
              <Button variant="ghost" size="sm" className="hidden md:flex">
                <ArrowUpRight className="h-4 w-4 ml-1" />
                عرض جميع الدورات
              </Button>
            </div>
            
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <Spinner size="lg" className="mr-2" />
                <span>جاري تحميل الدورات...</span>
              </div>
            ) : (
              <>
                <TabsContent value="featured" className="flex-1 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filterCourses(featuredCourses).map(renderCourseCard)}
                  </div>
                </TabsContent>
                
                <TabsContent value="popular" className="flex-1 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filterCourses(popularCourses).map(renderCourseCard)}
                  </div>
                </TabsContent>
                
                <TabsContent value="enrolled" className="flex-1 mt-0">
                  {enrolledCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filterCourses(enrolledCourses).map(renderCourseCard)}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8">
                      <GraduationCap className="h-16 w-16 text-gray-300 mb-4" />
                      <h3 className="text-xl font-bold mb-2">لم تسجل في أي دورة بعد</h3>
                      <p className="text-gray-500 text-center mb-4">
                        استكشف الدورات المتاحة وابدأ رحلة التعلم الإسلامي
                      </p>
                      <Button>استكشاف الدورات</Button>
                    </div>
                  )}
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </div>
      
      {/* Course Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">154</p>
              <p className="text-sm text-gray-500">دورة متاحة</p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">84</p>
              <p className="text-sm text-gray-500">معلم ومحاضر</p>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">32,568</p>
              <p className="text-sm text-gray-500">طالب مسجل</p>
            </div>
            <GraduationCap className="h-8 w-8 text-amber-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">8,452</p>
              <p className="text-sm text-gray-500">شهادة ممنوحة</p>
            </div>
            <FileText className="h-8 w-8 text-purple-500" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IslamicCourses;
