import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { Search, BookOpen, FileText, Users, Bookmark, ArrowRight, Upload, Download, Share2 } from "lucide-react";

const ScholarDashboard: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedSource, setSelectedSource] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [annotations, setAnnotations] = useState<string>('');
  const [savedCollections, setSavedCollections] = useState<any[]>([
    {
      id: 1,
      title: 'أحاديث الصيام',
      description: 'مجموعة من الأحاديث المتعلقة بالصيام وفضله وأحكامه',
      count: 24,
      lastUpdated: '2024-05-01'
    },
    {
      id: 2,
      title: 'آيات الأحكام',
      description: 'آيات قرآنية متعلقة بالأحكام الشرعية وتفسيرها',
      count: 37,
      lastUpdated: '2024-04-27'
    }
  ]);
  
  // Function to handle source search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      // Mock search results
      const results = [
        {
          id: 1,
          title: 'صحيح البخاري - كتاب الصيام',
          type: 'hadith',
          content: 'عن أبي هريرة رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: "من صام رمضان إيماناً واحتساباً غفر له ما تقدم من ذنبه"',
          metadata: {
            source: 'صحيح البخاري',
            book: 'كتاب الصيام',
            number: '1901',
            grade: 'صحيح'
          }
        },
        {
          id: 2,
          title: 'سورة البقرة - آية 183',
          type: 'quran',
          content: 'يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ',
          metadata: {
            surah: 'البقرة',
            ayah: '183',
            juz: '2'
          }
        },
        {
          id: 3,
          title: 'مغني المحتاج - أحكام الصيام',
          type: 'fiqh',
          content: 'ويجب الصوم بأحد أمور ثلاثة: إما برؤية الهلال، أو بإكمال عدة شعبان ثلاثين يوماً، أو بإخبار عدل بالرؤية...',
          metadata: {
            source: 'مغني المحتاج',
            author: 'الشربيني',
            volume: '2',
            page: '152',
            madhab: 'الشافعي'
          }
        }
      ];
      
      setSearchResults(results);
      setLoading(false);
    }, 1500);
  };
  
  // Function to select a source for detailed view
  const handleSelectSource = (source: any) => {
    setSelectedSource(source);
    setAnnotations(''); // Reset annotations
  };
  
  // Function to save annotations
  const handleSaveAnnotations = () => {
    toast({
      title: "تم حفظ الملاحظات",
      description: "تم حفظ ملاحظاتك على هذا المصدر بنجاح"
    });
  };
  
  // Function to add to collection
  const handleAddToCollection = (collectionId: number) => {
    toast({
      title: "تمت الإضافة للمجموعة",
      description: "تمت إضافة المصدر إلى المجموعة بنجاح"
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-sabeel-primary">منصة الباحثين الشرعيين</h1>
      
      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="search">البحث في المصادر</TabsTrigger>
          <TabsTrigger value="collections">المجموعات المحفوظة</TabsTrigger>
          <TabsTrigger value="tools">أدوات البحث العلمي</TabsTrigger>
        </TabsList>
        
        {/* Search Tab */}
        <TabsContent value="search" className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="ابحث في المصادر الإسلامية..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? <Spinner className="mr-2 h-4 w-4" /> : <Search className="mr-2 h-4 w-4" />}
              بحث
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Results */}
            <div className="md:col-span-1 space-y-2">
              <h2 className="text-lg font-semibold mb-2">نتائج البحث</h2>
              
              {loading ? (
                <div className="flex items-center justify-center h-64 border rounded-md bg-muted/30">
                  <Spinner className="h-8 w-8" />
                </div>
              ) : searchResults.length > 0 ? (
                <ScrollArea className="h-[calc(100vh-300px)] border rounded-md p-2">
                  {searchResults.map((result) => (
                    <div 
                      key={result.id}
                      className={`p-3 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                        selectedSource?.id === result.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => handleSelectSource(result)}
                    >
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium">{result.title}</h3>
                        <Badge>{result.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {result.content}
                      </p>
                    </div>
                  ))}
                </ScrollArea>
              ) : searchQuery ? (
                <div className="flex flex-col items-center justify-center h-64 border rounded-md bg-muted/30">
                  <p className="text-muted-foreground">لا توجد نتائج لهذا البحث</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 border rounded-md bg-muted/30">
                  <Search className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">ابحث في القرآن والحديث والفقه والتفسير وغيرها من المصادر الإسلامية</p>
                </div>
              )}
            </div>
            
            {/* Source Details */}
            <div className="md:col-span-2">
              {selectedSource ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{selectedSource.title}</span>
                      <Badge>{selectedSource.type}</Badge>
                    </CardTitle>
                    <CardDescription>
                      {Object.entries(selectedSource.metadata).map(([key, value]: [string, any]) => (
                        <span key={key} className="ml-3 inline-block">
                          {key}: {value}
                        </span>
                      ))}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border rounded-md bg-muted/10 text-lg font-arabic leading-loose text-right">
                      {selectedSource.content}
                    </div>
                    
                    <div>
                      <h3 className="text-md font-semibold mb-2">الملاحظات</h3>
                      <Textarea 
                        placeholder="أضف ملاحظاتك هنا..."
                        value={annotations}
                        onChange={(e) => setAnnotations(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div>
                      <Button variant="outline" onClick={handleSaveAnnotations} className="mr-2">
                        حفظ الملاحظات
                      </Button>
                      <Button onClick={() => handleAddToCollection(1)}>
                        <Bookmark className="mr-2 h-4 w-4" />
                        إضافة للمجموعة
                      </Button>
                    </div>
                    <div>
                      <Button variant="outline" size="icon" className="mr-1">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ) : (
                <div className="flex flex-col items-center justify-center h-full border rounded-md bg-muted/30 p-8">
                  <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">اختر مصدراً لعرضه</h3>
                  <p className="text-center text-muted-foreground">
                    انقر على أحد نتائج البحث لعرض المحتوى وإضافة الملاحظات وحفظه في مجموعاتك
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        {/* Collections Tab */}
        <TabsContent value="collections">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">المجموعات المحفوظة</h2>
              <Button>
                <Bookmark className="mr-2 h-4 w-4" />
                إنشاء مجموعة جديدة
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {savedCollections.map((collection) => (
                <Card key={collection.id}>
                  <CardHeader>
                    <CardTitle>{collection.title}</CardTitle>
                    <CardDescription>
                      {collection.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>عدد المصادر: {collection.count}</span>
                      <span>آخر تحديث: {collection.lastUpdated}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      فتح المجموعة 
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              {/* Create New Collection Card */}
              <Card className="border-dashed bg-muted/20">
                <CardContent className="flex flex-col items-center justify-center h-full py-8">
                  <Bookmark className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-center text-muted-foreground">
                    أنشئ مجموعة جديدة لتنظيم مصادرك البحثية
                  </p>
                  <Button variant="outline" className="mt-4">
                    إنشاء مجموعة جديدة
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Tools Tab */}
        <TabsContent value="tools">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">أدوات البحث العلمي</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Citation Generator */}
              <Card>
                <CardHeader>
                  <CardTitle>مولد الاقتباسات</CardTitle>
                  <CardDescription>
                    إنشاء اقتباسات احترافية من المصادر الإسلامية المختلفة
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    قم بإنشاء اقتباسات بتنسيقات مختلفة (MLA، APA، شيكاغو) للمصادر الإسلامية الخاصة بك.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    فتح الأداة
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Manuscript Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>تحليل المخطوطات</CardTitle>
                  <CardDescription>
                    أدوات للتعرف على النصوص في المخطوطات القديمة
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    استخدم الذكاء الاصطناعي للتعرف على النصوص في المخطوطات الإسلامية القديمة ومعالجتها.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    فتح الأداة
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Comparative Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>التحليل المقارن</CardTitle>
                  <CardDescription>
                    مقارنة الآراء بين المذاهب المختلفة حول المسائل الفقهية
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    أداة للمقارنة بين آراء المذاهب الفقهية المختلفة حول مسألة معينة.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    فتح الأداة
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Research Paper Generator */}
              <Card>
                <CardHeader>
                  <CardTitle>إعداد البحوث العلمية</CardTitle>
                  <CardDescription>
                    أداة مساعدة في إعداد وتنسيق البحوث العلمية الشرعية
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    قم بإنشاء وتنسيق البحوث العلمية مع إدارة المراجع والاقتباسات بشكل احترافي.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    فتح الأداة
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Hadith Verification */}
              <Card>
                <CardHeader>
                  <CardTitle>التحقق من الأحاديث</CardTitle>
                  <CardDescription>
                    أداة للتحقق من صحة الأحاديث ودرجتها
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    أدخل حديثاً للتحقق من صحته ومصادره ودرجته وشروحه من كتب السنة المعتمدة.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    فتح الأداة
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Content Import */}
              <Card>
                <CardHeader>
                  <CardTitle>استيراد المحتوى</CardTitle>
                  <CardDescription>
                    استيراد المصادر والكتب من مصادر خارجية
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    استيراد المصادر من ملفات PDF أو Word أو مواقع ويب أخرى لإضافتها إلى مكتبتك.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    استيراد
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScholarDashboard;
