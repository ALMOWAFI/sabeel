import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Book, BookOpen, FileText, Download, BookMarked, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

// Mock data for Islamic resources
const mockBooks = [
  {
    id: "1",
    title: "إحياء علوم الدين",
    author: "أبو حامد الغزالي",
    category: "فقه",
    language: "العربية",
    year: "1097",
    pages: 1000,
    format: "PDF",
    thumbnail: "https://via.placeholder.com/150x200?text=إحياء+علوم+الدين",
    description: "من أشهر كتب الإمام الغزالي في الأخلاق والتزكية، يتناول موضوعات متنوعة من العبادات والمعاملات والأخلاق.",
    popular: true,
  },
  {
    id: "2",
    title: "صحيح البخاري",
    author: "محمد بن إسماعيل البخاري",
    category: "حديث",
    language: "العربية",
    year: "846",
    pages: 3200,
    format: "PDF",
    thumbnail: "https://via.placeholder.com/150x200?text=صحيح+البخاري",
    description: "أصح كتاب بعد كتاب الله، يحتوي على أحاديث النبي ﷺ المنتقاة وفق منهج دقيق في التصحيح.",
    popular: true,
  },
  {
    id: "3",
    title: "تفسير ابن كثير",
    author: "إسماعيل بن عمر بن كثير",
    category: "تفسير",
    language: "العربية",
    year: "1373",
    pages: 2600,
    format: "PDF",
    thumbnail: "https://via.placeholder.com/150x200?text=تفسير+ابن+كثير",
    description: "من أشهر كتب التفسير بالمأثور، يعتمد على تفسير القرآن بالقرآن والسنة وأقوال الصحابة والتابعين.",
    popular: true,
  },
  {
    id: "4",
    title: "المغني",
    author: "ابن قدامة المقدسي",
    category: "فقه",
    language: "العربية",
    year: "1223",
    pages: 4400,
    format: "PDF",
    thumbnail: "https://via.placeholder.com/150x200?text=المغني",
    description: "موسوعة فقهية شاملة على مذهب الإمام أحمد بن حنبل، مع ذكر الخلاف والأدلة.",
    popular: false,
  },
  {
    id: "5",
    title: "الموافقات",
    author: "أبو إسحاق الشاطبي",
    category: "أصول الفقه",
    language: "العربية",
    year: "1388",
    pages: 1200,
    format: "PDF",
    thumbnail: "https://via.placeholder.com/150x200?text=الموافقات",
    description: "كتاب في مقاصد الشريعة وأصول الفقه، يبحث في أسرار التشريع وحِكمه.",
    popular: false,
  },
  {
    id: "6",
    title: "الرحيق المختوم",
    author: "صفي الرحمن المباركفوري",
    category: "سيرة",
    language: "العربية",
    year: "1976",
    pages: 450,
    format: "PDF",
    thumbnail: "https://via.placeholder.com/150x200?text=الرحيق+المختوم",
    description: "كتاب في السيرة النبوية، حاز على جائزة رابطة العالم الإسلامي للسيرة النبوية.",
    popular: true,
  },
  {
    id: "7",
    title: "زاد المعاد",
    author: "ابن قيم الجوزية",
    category: "سيرة",
    language: "العربية",
    year: "1350",
    pages: 1600,
    format: "PDF",
    thumbnail: "https://via.placeholder.com/150x200?text=زاد+المعاد",
    description: "كتاب في فقه السيرة النبوية، يستخرج الفوائد والأحكام من سيرة النبي ﷺ وهديه.",
    popular: false,
  },
  {
    id: "8",
    title: "العقيدة الواسطية",
    author: "ابن تيمية",
    category: "عقيدة",
    language: "العربية",
    year: "1306",
    pages: 120,
    format: "PDF",
    thumbnail: "https://via.placeholder.com/150x200?text=العقيدة+الواسطية",
    description: "رسالة مختصرة في عقيدة أهل السنة والجماعة، كتبها ابن تيمية جواباً لسؤال من أهل واسط.",
    popular: false,
  },
];

const categories = [
  "الكل",
  "فقه",
  "حديث",
  "تفسير",
  "عقيدة",
  "أصول الفقه",
  "سيرة",
  "تزكية",
];

const IslamicResources: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("books");
  
  const filteredBooks = mockBooks.filter(book => {
    const matchesSearch = searchTerm === "" || 
      book.title.includes(searchTerm) || 
      book.author.includes(searchTerm) || 
      book.description.includes(searchTerm);
      
    const matchesCategory = selectedCategory === "الكل" || book.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const handleSearch = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-right">المكتبة الإسلامية</CardTitle>
          <CardDescription className="text-right">
            اكتشف آلاف الكتب والمصادر الإسلامية المحققة والموثقة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 rtl:space-x-reverse">
            <div className="flex w-full items-center space-x-2 rtl:space-x-reverse">
              <Input
                type="text"
                placeholder="ابحث عن كتاب، مؤلف، أو موضوع..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 text-right"
              />
              <Button type="submit" onClick={handleSearch} disabled={loading}>
                {loading ? <Spinner size="sm" className="mr-2" /> : <Search className="h-4 w-4 ml-2" />}
                بحث
              </Button>
            </div>
            
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="التصنيف" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="books">
            <Book className="h-4 w-4 ml-2" />
            الكتب
          </TabsTrigger>
          <TabsTrigger value="articles">
            <FileText className="h-4 w-4 ml-2" />
            المقالات
          </TabsTrigger>
          <TabsTrigger value="manuscripts">
            <BookMarked className="h-4 w-4 ml-2" />
            المخطوطات
          </TabsTrigger>
          <TabsTrigger value="audio">
            <svg className="h-4 w-4 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v14a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v4a7 7 0 0 1-14 0v-4" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
            الصوتيات
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="books">
          {filteredBooks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <Book className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">لم يتم العثور على كتب</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                لم نتمكن من العثور على كتب تطابق معايير البحث. جرب تعديل البحث أو تصفية النتائج.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map(book => (
                <Card key={book.id} className="overflow-hidden">
                  <div className="aspect-[2/3] relative bg-gray-100 flex items-center justify-center">
                    <img 
                      src={book.thumbnail} 
                      alt={book.title} 
                      className="object-cover w-full h-full"
                    />
                    {book.popular && (
                      <Badge className="absolute top-2 right-2 bg-sabeel-primary">
                        شائع
                      </Badge>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-right text-lg">{book.title}</CardTitle>
                    <CardDescription className="text-right">
                      {book.author} - {book.year}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-gray-600 text-right line-clamp-3">
                      {book.description}
                    </p>
                    <div className="flex justify-end mt-2 space-x-2 rtl:space-x-reverse">
                      <Badge variant="outline">{book.category}</Badge>
                      <Badge variant="outline">{book.pages} صفحة</Badge>
                      <Badge variant="outline">{book.format}</Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="flex w-full justify-between items-center">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 ml-1" />
                        تحميل
                      </Button>
                      <Button variant="default" size="sm" className="bg-sabeel-primary hover:bg-sabeel-primary/90">
                        <BookOpen className="h-4 w-4 ml-1" />
                        قراءة
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="articles">
          <div className="text-center py-12 bg-white rounded-lg">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">قريباً</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              نعمل على إضافة آلاف المقالات العلمية والبحوث المحكمة في مختلف العلوم الإسلامية. ترقبوا الإصدار القادم.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="manuscripts">
          <div className="text-center py-12 bg-white rounded-lg">
            <BookMarked className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">قريباً</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              مشروع رقمنة وإتاحة المخطوطات النادرة قيد التطوير. سيتم إطلاقه في المرحلة القادمة من المشروع.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="audio">
          <div className="text-center py-12 bg-white rounded-lg">
            <svg className="h-16 w-16 text-gray-300 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v14a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v4a7 7 0 0 1-14 0v-4" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
            <h3 className="text-xl font-medium mb-2">قريباً</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              قسم الصوتيات سيضم دروساً علمية ومحاضرات ومتون مسموعة بأصوات مشايخ معتبرين. سيتوفر قريباً.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IslamicResources;
