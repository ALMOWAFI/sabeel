import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, ThumbsUp, Eye, Flag, Users, Tag, Bookmark, Clock, Filter, Award } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Mock data for scholar forum
const mockDiscussions = [
  {
    id: "1",
    title: "مناقشة حول مسألة حكم النوازل المعاصرة في المعاملات المالية",
    author: {
      name: "د. علي الحكمي",
      avatar: "https://via.placeholder.com/40",
      credentials: "أستاذ الفقه المقارن بجامعة أم القرى",
      verified: true,
    },
    date: "منذ 3 أيام",
    views: 423,
    likes: 52,
    comments: 18,
    tags: ["فقه المعاملات", "النوازل", "المعاملات المالية"],
    excerpt: "في ظل التطورات المتسارعة في عالم المال والأعمال، ظهرت العديد من المعاملات المالية المستحدثة التي تحتاج إلى دراسة فقهية متأنية. وهنا أطرح للنقاش منهجية التعامل مع هذه النوازل...",
    type: "question",
    isPinned: true,
  },
  {
    id: "2",
    title: "تطبيقات الذكاء الاصطناعي في التعرف على أسانيد الحديث الشريف",
    author: {
      name: "د. محمد الأنصاري",
      avatar: "https://via.placeholder.com/40",
      credentials: "باحث في علوم الحديث والذكاء الاصطناعي",
      verified: true,
    },
    date: "منذ أسبوع",
    views: 387,
    likes: 73,
    comments: 24,
    tags: ["الحديث الشريف", "الذكاء الاصطناعي", "الأسانيد"],
    excerpt: "قمنا بتطوير نموذج للذكاء الاصطناعي يستطيع تحليل أسانيد الأحاديث النبوية واكتشاف العلل فيها بدقة تتجاوز 85%، وذلك باستخدام تقنيات التعلم العميق ومعالجة اللغة الطبيعية...",
    type: "research",
    isPinned: false,
  },
  {
    id: "3",
    title: "استفسار عن منهجية التعليم الشرعي للأطفال باستخدام التقنيات الحديثة",
    author: {
      name: "أ. فاطمة العمري",
      avatar: "https://via.placeholder.com/40",
      credentials: "مطورة مناهج تعليمية إسلامية",
      verified: false,
    },
    date: "منذ أسبوعين",
    views: 246,
    likes: 37,
    comments: 16,
    tags: ["التعليم الشرعي", "الأطفال", "التقنية"],
    excerpt: "أعمل على تطوير منهج لتعليم القرآن والسنة للأطفال باستخدام الواقع المعزز والألعاب التفاعلية، وأود الاستفادة من خبرات العلماء والتربويين في هذا المجال...",
    type: "question",
    isPinned: false,
  },
  {
    id: "4",
    title: "دراسة تحليلية للمصطلحات الفقهية وتطبيقاتها في معالجة اللغة الطبيعية",
    author: {
      name: "د. أحمد القحطاني",
      avatar: "https://via.placeholder.com/40",
      credentials: "أستاذ مشارك في اللسانيات الحاسوبية",
      verified: true,
    },
    date: "منذ 3 أسابيع",
    views: 198,
    likes: 45,
    comments: 11,
    tags: ["المصطلحات الفقهية", "معالجة اللغة", "اللسانيات الحاسوبية"],
    excerpt: "تهدف هذه الدراسة إلى بناء قاموس حاسوبي للمصطلحات الفقهية يمكن استخدامه في تطبيقات الذكاء الاصطناعي ومعالجة اللغة الطبيعية، وقد جمعنا أكثر من 5000 مصطلح فقهي من مختلف المذاهب...",
    type: "research",
    isPinned: false,
  },
  {
    id: "5",
    title: "منهجية الإفتاء الجماعي عبر المنصات الرقمية",
    author: {
      name: "د. عبدالله المالكي",
      avatar: "https://via.placeholder.com/40",
      credentials: "عضو هيئة كبار العلماء",
      verified: true,
    },
    date: "منذ شهر",
    views: 512,
    likes: 98,
    comments: 37,
    tags: ["الإفتاء", "المنصات الرقمية", "الاجتهاد الجماعي"],
    excerpt: "في ظل التحديات المعاصرة وتعقد النوازل، أصبح الاجتهاد الجماعي ضرورة شرعية. أطرح في هذه الورقة تصوراً لمنهجية الإفتاء الجماعي عبر المنصات الرقمية، بما يجمع بين الأصالة والمعاصرة...",
    type: "discussion",
    isPinned: false,
  },
];

// Mock data for scholars
const mockScholars = [
  {
    id: "1",
    name: "د. علي الحكمي",
    avatar: "https://via.placeholder.com/60",
    credentials: "أستاذ الفقه المقارن بجامعة أم القرى",
    specialization: "الفقه والأصول",
    contributions: 67,
    followers: 342,
    memberSince: "2023",
    verified: true,
  },
  {
    id: "2",
    name: "د. محمد الأنصاري",
    avatar: "https://via.placeholder.com/60",
    credentials: "باحث في علوم الحديث والذكاء الاصطناعي",
    specialization: "الحديث الشريف",
    contributions: 43,
    followers: 267,
    memberSince: "2023",
    verified: true,
  },
  {
    id: "3",
    name: "د. عبدالله المالكي",
    avatar: "https://via.placeholder.com/60",
    credentials: "عضو هيئة كبار العلماء",
    specialization: "العقيدة والفقه",
    contributions: 92,
    followers: 520,
    memberSince: "2022",
    verified: true,
  },
  {
    id: "4",
    name: "د. سارة الزهراني",
    avatar: "https://via.placeholder.com/60",
    credentials: "أستاذة الدراسات القرآنية",
    specialization: "علوم القرآن",
    contributions: 38,
    followers: 184,
    memberSince: "2023",
    verified: true,
  },
];

// Forum tags
const forumTags = [
  "الفقه", "العقيدة", "التفسير", "الحديث", "السيرة",
  "الأصول", "الفقه المقارن", "النوازل", "المعاملات المالية",
  "التربية الإسلامية", "الإعجاز العلمي", "التقنية والشريعة",
  "القضايا المعاصرة", "الأخلاق", "التزكية"
];

const ScholarForum: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("discussions");
  const [replyText, setReplyText] = useState("");
  
  const filteredDiscussions = mockDiscussions.filter(discussion => {
    return searchTerm === "" || 
      discussion.title.includes(searchTerm) || 
      discussion.author.name.includes(searchTerm) ||
      discussion.tags.some(tag => tag.includes(searchTerm));
  });
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-right">منتدى العلماء والباحثين</CardTitle>
          <CardDescription className="text-right">
            منصة للتعاون وتبادل الخبرات بين العلماء والباحثين في مختلف التخصصات الإسلامية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 rtl:space-x-reverse">
            <div className="flex w-full items-center space-x-2 rtl:space-x-reverse">
              <Input
                type="text"
                placeholder="ابحث في المناقشات والمواضيع..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 text-right"
              />
              <Button type="submit" className="bg-sabeel-primary hover:bg-sabeel-primary/90">
                بحث
              </Button>
            </div>
            
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Button variant="outline" className="gap-1">
                <Filter className="h-4 w-4" />
                تصفية
              </Button>
              
              <Button className="gap-1">
                <MessageSquare className="h-4 w-4" />
                موضوع جديد
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="discussions">
            <MessageSquare className="h-4 w-4 ml-2" />
            المناقشات
          </TabsTrigger>
          <TabsTrigger value="scholars">
            <Users className="h-4 w-4 ml-2" />
            العلماء والباحثون
          </TabsTrigger>
          <TabsTrigger value="tags">
            <Tag className="h-4 w-4 ml-2" />
            التصنيفات
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="discussions">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredDiscussions.map((discussion) => (
                  <div key={discussion.id} className={`p-4 ${discussion.isPinned ? 'bg-amber-50 dark:bg-amber-950/20' : ''}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <Avatar>
                          <AvatarImage src={discussion.author.avatar} alt={discussion.author.name} />
                          <AvatarFallback>{discussion.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="text-right">
                          <div className="flex items-center">
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {discussion.author.name}
                            </p>
                            {discussion.author.verified && (
                              <Badge variant="outline" className="ml-2 p-1">
                                <Award className="h-3 w-3 text-blue-500" />
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{discussion.author.credentials}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 inline mr-1" />
                        {discussion.date}
                        {discussion.isPinned && (
                          <Badge variant="secondary" className="mr-2">
                            مثبت
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="mr-12">
                      <h3 className="text-lg font-semibold mb-2 text-right">
                        {discussion.title}
                      </h3>
                      
                      <div className="mb-2 text-right">
                        {discussion.type === "question" && (
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                            سؤال
                          </Badge>
                        )}
                        {discussion.type === "research" && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            بحث علمي
                          </Badge>
                        )}
                        {discussion.type === "discussion" && (
                          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                            مناقشة
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-3 text-right">
                        {discussion.excerpt}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-3 justify-end">
                        {discussion.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <Button variant="ghost" size="sm">
                          عرض التفاصيل
                        </Button>
                        
                        <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-500">
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 inline ml-1" />
                            {discussion.views}
                          </div>
                          <div className="flex items-center">
                            <ThumbsUp className="h-4 w-4 inline ml-1" />
                            {discussion.likes}
                          </div>
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 inline ml-1" />
                            {discussion.comments}
                          </div>
                          <Button variant="ghost" size="sm" className="p-0">
                            <Bookmark className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center p-6">
              <Button variant="outline">المزيد من المناقشات</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="scholars">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockScholars.map((scholar) => (
              <Card key={scholar.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={scholar.avatar} alt={scholar.name} />
                      <AvatarFallback>{scholar.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="text-center sm:text-right flex-1">
                      <div className="flex items-center justify-center sm:justify-end">
                        <h3 className="text-lg font-semibold">
                          {scholar.name}
                        </h3>
                        {scholar.verified && (
                          <Badge variant="outline" className="mr-2 p-1">
                            <Award className="h-3 w-3 text-blue-500" />
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mb-1">{scholar.credentials}</p>
                      <Badge variant="secondary" className="mb-3">
                        {scholar.specialization}
                      </Badge>
                      
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="font-semibold">{scholar.contributions}</p>
                          <p className="text-gray-500">مساهمة</p>
                        </div>
                        <div>
                          <p className="font-semibold">{scholar.followers}</p>
                          <p className="text-gray-500">متابع</p>
                        </div>
                        <div>
                          <p className="font-semibold">{scholar.memberSince}</p>
                          <p className="text-gray-500">عضو منذ</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 dark:bg-gray-800">
                  <div className="w-full flex justify-between">
                    <Button variant="ghost" size="sm">
                      عرض الملف
                    </Button>
                    <Button size="sm" className="bg-sabeel-primary hover:bg-sabeel-primary/90">
                      متابعة
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="mt-6 flex justify-center">
            <Button variant="outline">عرض المزيد من العلماء</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="tags">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-3 justify-center">
                {forumTags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    className="text-sm py-2 px-4 cursor-pointer hover:bg-sabeel-primary hover:text-white"
                    variant="outline"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-right">الأكثر نشاطاً</CardTitle>
              <CardDescription className="text-right">
                المواضيع والتصنيفات الأكثر تفاعلاً في المنتدى
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-right">المواضيع الأكثر مشاهدة</h3>
                  <ScrollArea className="h-64 rounded-md border">
                    <div className="p-4 text-right">
                      {mockDiscussions.sort((a, b) => b.views - a.views).map((discussion, index) => (
                        <div key={index} className="mb-4">
                          <p className="font-medium hover:text-sabeel-primary cursor-pointer">
                            {discussion.title}
                          </p>
                          <div className="flex justify-between text-sm text-gray-500 mt-1">
                            <span>
                              <Eye className="h-4 w-4 inline ml-1" />
                              {discussion.views}
                            </span>
                            <span>{discussion.author.name}</span>
                          </div>
                          <Separator className="my-2" />
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-right">التصنيفات الأكثر نشاطاً</h3>
                  <ScrollArea className="h-64 rounded-md border">
                    <div className="p-4">
                      <div className="space-y-3">
                        {forumTags.slice(0, 10).map((tag, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <Badge variant="outline">{20 - index}</Badge>
                            <span className="font-medium">{tag}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Quick Reply Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">المشاركة السريعة</CardTitle>
          <CardDescription className="text-right">
            شارك برأيك أو استفسارك في المناقشات الحالية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="اكتب مشاركتك هنا..."
            className="mb-4 min-h-[100px] text-right"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <div className="flex justify-between">
            <Button variant="outline">إرفاق ملف</Button>
            <Button 
              disabled={!replyText.trim()} 
              className="bg-sabeel-primary hover:bg-sabeel-primary/90"
            >
              نشر المشاركة
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Call to Join */}
      <Card className="bg-gradient-to-r from-sabeel-primary/10 to-purple-500/10">
        <CardContent className="pt-6">
          <div className="text-center py-6">
            <h3 className="text-2xl font-bold mb-2">انضم إلى مجتمع العلماء والباحثين</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              شارك في بناء منصة سبيل وساهم في نشر المعرفة الإسلامية الصحيحة، وتطوير تطبيقات الذكاء الاصطناعي المتوافقة مع الشريعة الإسلامية.
            </p>
            <Button size="lg" className="bg-sabeel-primary hover:bg-sabeel-primary/90">
              سجل كعالم أو باحث
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScholarForum;
