import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  MessageSquare, 
  Users,
  Eye,
  ThumbsUp,
  BookOpen,
  Clock,
  Calendar,
  Hash,
  ArrowUpRight,
  BarChart3,
  Sparkles
} from "lucide-react";

// Mock trending topics data
const trendingTopics = [
  {
    id: 1,
    title: "تأملات في الآية 28 من سورة فاطر وعلاقتها بالعلم الحديث",
    category: "تفسير",
    views: 1824,
    likes: 342,
    comments: 78,
    timeAgo: "3 ساعات",
    tags: ["تفسير علمي", "سورة فاطر", "الإعجاز العلمي"],
    author: {
      name: "د. محمد العريفي",
      role: "باحث",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    trending: 98, // Percentage of trending
    excerpt: "نقاش مثير حول الإشارات العلمية في قوله تعالى: (إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاء) وكيف تتوافق مع اكتشافات العلم الحديث..."
  },
  {
    id: 2,
    title: "الذكاء الاصطناعي وأخلاقيات استخدامه من منظور إسلامي",
    category: "قضايا معاصرة",
    views: 2651,
    likes: 526,
    comments: 142,
    timeAgo: "6 ساعات",
    tags: ["الذكاء الاصطناعي", "التقنية والشريعة", "الأخلاق الإسلامية"],
    author: {
      name: "د. أحمد القحطاني",
      role: "أستاذ جامعي",
      avatar: "https://randomuser.me/api/portraits/men/15.jpg"
    },
    trending: 95,
    excerpt: "مناقشة مستفيضة حول الضوابط الشرعية لاستخدام الذكاء الاصطناعي في حياتنا اليومية، وكيف يمكن الاستفادة منه مع الحفاظ على القيم الإسلامية..."
  },
  {
    id: 3,
    title: "أثر علم مصطلح الحديث في تطوير منهجية البحث العلمي المعاصر",
    category: "حديث",
    views: 1482,
    likes: 287,
    comments: 53,
    timeAgo: "يوم",
    tags: ["علم المصطلح", "منهجية البحث", "علوم الحديث"],
    author: {
      name: "د. سعاد الشمري",
      role: "محاضرة",
      avatar: "https://randomuser.me/api/portraits/women/22.jpg"
    },
    trending: 82,
    excerpt: "دراسة تحليلية لآليات التحقق والتثبت في علم الحديث وكيف يمكن الاستفادة منها في تطوير المنهجية العلمية المعاصرة..."
  },
  {
    id: 4,
    title: "تربية الأطفال في العصر الرقمي: تحديات وحلول من المنظور الإسلامي",
    category: "تربية إسلامية",
    views: 1935,
    likes: 412,
    comments: 87,
    timeAgo: "يومان",
    tags: ["التربية الإسلامية", "العصر الرقمي", "الأسرة المسلمة"],
    author: {
      name: "أ. فاطمة العمري",
      role: "مستشارة تربوية",
      avatar: "https://randomuser.me/api/portraits/women/12.jpg"
    },
    trending: 79,
    excerpt: "نصائح عملية للآباء والأمهات حول كيفية تربية الأبناء في ظل التحديات التقنية والرقمية المعاصرة، مع الحفاظ على القيم الإسلامية الأصيلة..."
  },
  {
    id: 5,
    title: "مقاصد الشريعة وتطبيقاتها في الاقتصاد الإسلامي المعاصر",
    category: "فقه ومعاملات",
    views: 1247,
    likes: 231,
    comments: 45,
    timeAgo: "3 أيام",
    tags: ["مقاصد الشريعة", "الاقتصاد الإسلامي", "التمويل الإسلامي"],
    author: {
      name: "د. عبدالله الزهراني",
      role: "أستاذ الاقتصاد الإسلامي",
      avatar: "https://randomuser.me/api/portraits/men/42.jpg"
    },
    trending: 75,
    excerpt: "تحليل لكيفية تطبيق مقاصد الشريعة الإسلامية في المعاملات المالية المعاصرة، وأثر ذلك في تحقيق العدالة الاجتماعية والاقتصادية..."
  }
];

// Mock trending hashtags
const trendingHashtags = [
  { id: 1, name: "الذكاء_الاصطناعي_والإسلام", count: 13420, growth: "+45%" },
  { id: 2, name: "تفسير_القرآن", count: 8765, growth: "+12%" },
  { id: 3, name: "التقنية_في_خدمة_الإسلام", count: 7431, growth: "+28%" },
  { id: 4, name: "الإعجاز_العلمي", count: 6298, growth: "+8%" },
  { id: 5, name: "تراث_إسلامي", count: 5874, growth: "+15%" },
  { id: 6, name: "مقاصد_الشريعة", count: 5321, growth: "+22%" },
  { id: 7, name: "فقه_المعاملات", count: 4752, growth: "+19%" },
  { id: 8, name: "تربية_إسلامية", count: 4123, growth: "+11%" },
  { id: 9, name: "الحضارة_الإسلامية", count: 3845, growth: "+7%" },
  { id: 10, name: "علوم_الحديث", count: 3612, growth: "+14%" }
];

// Mock trending scholars
const trendingScholars = [
  { 
    id: 1, 
    name: "د. أحمد القحطاني", 
    specialty: "الذكاء الاصطناعي والشريعة",
    publications: 32,
    followers: 12500,
    growth: "+22%",
    avatar: "https://randomuser.me/api/portraits/men/15.jpg"
  },
  { 
    id: 2, 
    name: "د. سعاد الشمري", 
    specialty: "علوم الحديث",
    publications: 28,
    followers: 9800,
    growth: "+15%",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg"
  },
  { 
    id: 3, 
    name: "د. عبدالله الزهراني", 
    specialty: "الاقتصاد الإسلامي",
    publications: 47,
    followers: 8200,
    growth: "+18%",
    avatar: "https://randomuser.me/api/portraits/men/42.jpg"
  },
  { 
    id: 4, 
    name: "د. محمد العريفي", 
    specialty: "التفسير والإعجاز العلمي",
    publications: 53,
    followers: 15700,
    growth: "+25%",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  { 
    id: 5, 
    name: "أ. فاطمة العمري", 
    specialty: "التربية الإسلامية",
    publications: 21,
    followers: 7400,
    growth: "+31%",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg"
  }
];

const TrendingTopics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("discussions");
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-right">المواضيع المتداولة</h2>
            <p className="text-gray-500 dark:text-gray-400 text-right">
              استكشف أحدث المواضيع والنقاشات في منصة سبيل
            </p>
          </div>
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="discussions">
                <MessageSquare className="h-4 w-4 ml-2" />
                نقاشات
              </TabsTrigger>
              <TabsTrigger value="hashtags">
                <Hash className="h-4 w-4 ml-2" />
                وسوم
              </TabsTrigger>
              <TabsTrigger value="scholars">
                <Users className="h-4 w-4 ml-2" />
                علماء
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <div className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Spinner size="lg" className="mr-2" />
            <span>جاري تحميل المواضيع المتداولة...</span>
          </div>
        ) : (
          <TabsContent value={activeTab} className="mt-0 flex-1">
            {activeTab === "discussions" && (
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-right flex justify-between items-center">
                      <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 ml-1" />
                        تصفية حسب الفترة
                      </Button>
                      <span>المواضيع الأكثر تداولاً</span>
                    </CardTitle>
                    <CardDescription className="text-right">
                      المواضيع الأكثر مشاهدة ومناقشة في الأيام الأخيرة
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-0">
                    <ScrollArea className="h-[calc(100vh-350px)]">
                      <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {trendingTopics.map(topic => (
                          <div 
                            key={topic.id}
                            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <div className="flex flex-col md:flex-row gap-4">
                              <div className="md:w-16 flex flex-row md:flex-col items-center justify-center gap-2">
                                <div className="text-center">
                                  <TrendingUp className={`h-6 w-6 mx-auto ${
                                    topic.trending > 90 ? 'text-red-500' : 
                                    topic.trending > 80 ? 'text-orange-500' : 
                                    'text-blue-500'
                                  }`} />
                                  <p className="text-xs font-bold mt-1">{topic.trending}%</p>
                                </div>
                                <Badge variant="outline" className="whitespace-nowrap">
                                  {topic.category}
                                </Badge>
                              </div>
                              
                              <div className="flex-1">
                                <h3 className="text-lg font-bold mb-2 text-right">
                                  {topic.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm text-right mb-3">
                                  {topic.excerpt}
                                </p>
                                
                                <div className="flex flex-wrap gap-1 mb-3 justify-end">
                                  {topic.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                
                                <div className="flex flex-wrap justify-between items-center text-sm text-gray-500">
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center">
                                      <Eye className="h-4 w-4 ml-1" />
                                      {topic.views}
                                    </div>
                                    <div className="flex items-center">
                                      <ThumbsUp className="h-4 w-4 ml-1" />
                                      {topic.likes}
                                    </div>
                                    <div className="flex items-center">
                                      <MessageSquare className="h-4 w-4 ml-1" />
                                      {topic.comments}
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <span>{topic.timeAgo}</span>
                                    <Clock className="h-3 w-3" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                  
                  <CardFooter className="p-4 flex justify-center">
                    <Button variant="outline">
                      عرض المزيد من المواضيع
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}
            
            {activeTab === "hashtags" && (
              <div className="space-y-4">
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-right">الوسوم الأكثر استخداماً</CardTitle>
                    <CardDescription className="text-right">
                      الوسوم (الهاشتاغات) الأكثر شيوعاً في المنصة
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-4">
                    <div className="space-y-6">
                      {/* Hashtag Chart (Simplified) */}
                      <div className="h-64 border border-gray-200 dark:border-gray-700 rounded-lg p-4 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BarChart3 className="h-24 w-24 text-gray-200 dark:text-gray-700" />
                        </div>
                        <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                          <p className="text-xs text-gray-500">رسم بياني للوسوم الأكثر تداولاً</p>
                        </div>
                      </div>
                      
                      {/* Trending Hashtags */}
                      <div className="space-y-2">
                        {trendingHashtags.map(hashtag => (
                          <div 
                            key={hashtag.id} 
                            className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          >
                            <div className="flex items-center">
                              <Badge className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                                {hashtag.growth}
                              </Badge>
                              <span className="text-sm text-gray-500">{hashtag.count.toLocaleString()} مشاركة</span>
                            </div>
                            <div className="font-medium text-right">#{hashtag.name}</div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="text-center">
                        <Button variant="outline">
                          استكشاف جميع الوسوم
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {activeTab === "scholars" && (
              <div className="space-y-4">
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-right">العلماء الأكثر متابعة</CardTitle>
                    <CardDescription className="text-right">
                      أكثر العلماء والباحثين تأثيراً وتفاعلاً في منصة سبيل
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {trendingScholars.map(scholar => (
                        <Card key={scholar.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="relative">
                                <img
                                  src={scholar.avatar}
                                  alt={scholar.name}
                                  className="w-16 h-16 rounded-full object-cover"
                                />
                                <div className="absolute -top-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800"></div>
                              </div>
                              
                              <div className="flex-1 text-right">
                                <div className="flex justify-between items-start">
                                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                    {scholar.growth}
                                  </Badge>
                                  <h3 className="font-bold">{scholar.name}</h3>
                                </div>
                                <p className="text-sm text-gray-500 mb-2">{scholar.specialty}</p>
                                
                                <div className="flex justify-end items-center gap-4 text-sm">
                                  <div className="text-right">
                                    <p className="font-medium">{scholar.publications}</p>
                                    <p className="text-xs text-gray-500">منشور</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">{scholar.followers.toLocaleString()}</p>
                                    <p className="text-xs text-gray-500">متابع</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                              <Button variant="outline" size="sm" className="text-xs">
                                <ArrowUpRight className="h-3 w-3 ml-1" />
                                عرض الملف الكامل
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <div className="text-center mt-4">
                      <Button variant="outline">
                        عرض المزيد من العلماء
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        )}
      </div>
      
      {/* Weekly Insight Card */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-indigo-100 dark:border-indigo-800">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-sm">
              <Sparkles className="h-10 w-10 text-indigo-500" />
            </div>
            
            <div className="flex-1 text-center md:text-right">
              <h3 className="text-lg font-bold mb-1">نظرة أسبوعية على المواضيع الإسلامية</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                تتم مراجعة المواضيع الأكثر تأثيراً ومناقشتها أسبوعياً من قبل نخبة من العلماء والباحثين المتخصصين في مختلف المجالات الإسلامية.
              </p>
            </div>
            
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <BookOpen className="h-4 w-4 ml-1" />
              الاطلاع على التقرير
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendingTopics;
