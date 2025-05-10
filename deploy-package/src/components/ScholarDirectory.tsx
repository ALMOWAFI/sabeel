import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { 
  Search, 
  Calendar,
  Globe,
  BookOpen,
  User,
  MapPin,
  Filter,
  BookMarked,
  Clock,
  ArrowUpRight,
  Award,
  Share2,
  Bookmark,
  MessageSquare
} from "lucide-react";

// Mock scholars data
const scholars = [
  {
    id: 1,
    name: "الإمام أبو حامد الغزالي",
    arabicName: "أبو حامد الغزالي",
    englishName: "Abu Hamid Al-Ghazali",
    title: "حجة الإسلام",
    birthYear: 450,
    deathYear: 505,
    birthPlace: "طوس، خراسان (إيران حالياً)",
    specialization: ["فقه", "تصوف", "فلسفة", "أصول الفقه"],
    madhab: "شافعي",
    era: "العصر العباسي",
    contemporaries: [2, 3],
    bio: "الإمام الغزالي هو أبو حامد محمد بن محمد الغزالي الطوسي، فقيه وأصولي ومتكلم وفيلسوف ومتصوف، لُقب بحجة الإسلام وزين الدين. من أبرز علماء عصره وأحد أشهر علماء المسلمين، ألَّف كتبًا عديدة أشهرها إحياء علوم الدين، وتهافت الفلاسفة.",
    mainWorks: ["إحياء علوم الدين", "تهافت الفلاسفة", "المستصفى", "المنقذ من الضلال"],
    influence: 98,
    avatar: "https://via.placeholder.com/150?text=الغزالي",
    imageAttribution: "تخيلية - لا يوجد صور فعلية للإمام الغزالي"
  },
  {
    id: 2,
    name: "الإمام ابن تيمية",
    arabicName: "ابن تيمية",
    englishName: "Ibn Taymiyyah",
    title: "شيخ الإسلام",
    birthYear: 661,
    deathYear: 728,
    birthPlace: "حران (تركيا حالياً)",
    specialization: ["عقيدة", "فقه", "تفسير", "حديث"],
    madhab: "حنبلي",
    era: "العصر المملوكي",
    contemporaries: [3],
    bio: "أحمد بن عبد الحليم بن عبد السلام بن تيمية الحراني، تقي الدين أبو العباس، شيخ الإسلام. من أبرز علماء السنة وأحد مجددي الإسلام. له مؤلفات عديدة في شتى فروع الدين.",
    mainWorks: ["مجموع الفتاوى", "درء تعارض العقل والنقل", "منهاج السنة النبوية", "العقيدة الواسطية"],
    influence: 95,
    avatar: "https://via.placeholder.com/150?text=ابن+تيمية",
    imageAttribution: "تخيلية - لا يوجد صور فعلية لابن تيمية"
  },
  {
    id: 3,
    name: "الإمام ابن القيم",
    arabicName: "ابن قيم الجوزية",
    englishName: "Ibn Qayyim al-Jawziyyah",
    title: "شمس الدين",
    birthYear: 691,
    deathYear: 751,
    birthPlace: "دمشق (سوريا)",
    specialization: ["فقه", "حديث", "تفسير", "عقيدة"],
    madhab: "حنبلي",
    era: "العصر المملوكي",
    contemporaries: [2],
    bio: "محمد بن أبي بكر بن أيوب الزرعي الدمشقي، شمس الدين ابن قيم الجوزية. من تلاميذ ابن تيمية، وأحد كبار العلماء المسلمين. اشتهر بكتاباته الغزيرة في العلوم الشرعية والتربوية.",
    mainWorks: ["زاد المعاد في هدي خير العباد", "مدارج السالكين", "إعلام الموقعين", "الطب النبوي"],
    influence: 93,
    avatar: "https://via.placeholder.com/150?text=ابن+القيم",
    imageAttribution: "تخيلية - لا يوجد صور فعلية لابن القيم"
  },
  {
    id: 4,
    name: "الإمام الشافعي",
    arabicName: "الإمام الشافعي",
    englishName: "Imam Al-Shafi'i",
    title: "المطلبي القرشي",
    birthYear: 150,
    deathYear: 204,
    birthPlace: "غزة (فلسطين)",
    specialization: ["فقه", "أصول الفقه", "حديث", "لغة"],
    madhab: "شافعي (مؤسس)",
    era: "العصر العباسي",
    contemporaries: [],
    bio: "محمد بن إدريس الشافعي، أبو عبد الله. أحد الأئمة الأربعة عند أهل السنة، ومؤسس المذهب الشافعي. كان عالمًا بارعًا في الفقه والحديث واللغة.",
    mainWorks: ["الرسالة", "الأم", "اختلاف الحديث", "مسند الشافعي"],
    influence: 99,
    avatar: "https://via.placeholder.com/150?text=الشافعي",
    imageAttribution: "تخيلية - لا يوجد صور فعلية للإمام الشافعي"
  },
  {
    id: 5,
    name: "الإمام البخاري",
    arabicName: "الإمام البخاري",
    englishName: "Imam Al-Bukhari",
    title: "أمير المؤمنين في الحديث",
    birthYear: 194,
    deathYear: 256,
    birthPlace: "بخارى (أوزبكستان حالياً)",
    specialization: ["حديث", "فقه", "تفسير"],
    madhab: "شافعي",
    era: "العصر العباسي",
    contemporaries: [],
    bio: "محمد بن إسماعيل البخاري، أبو عبد الله. من أئمة علم الحديث، صاحب كتاب الجامع الصحيح (صحيح البخاري) الذي يعد أصح كتاب بعد القرآن الكريم.",
    mainWorks: ["الجامع الصحيح", "التاريخ الكبير", "الأدب المفرد", "خلق أفعال العباد"],
    influence: 99,
    avatar: "https://via.placeholder.com/150?text=البخاري",
    imageAttribution: "تخيلية - لا يوجد صور فعلية للإمام البخاري"
  }
];

// Mock timeline periods
const periods = [
  { id: 1, name: "عصر الصحابة", startYear: 1, endYear: 100, color: "#4338ca" },
  { id: 2, name: "عصر التابعين", startYear: 100, endYear: 200, color: "#1d4ed8" },
  { id: 3, name: "العصر العباسي المبكر", startYear: 200, endYear: 400, color: "#0369a1" },
  { id: 4, name: "العصر العباسي المتأخر", startYear: 400, endYear: 600, color: "#059669" },
  { id: 5, name: "عصر المماليك", startYear: 600, endYear: 800, color: "#ca8a04" },
  { id: 6, name: "العصر العثماني", startYear: 800, endYear: 1300, color: "#ea580c" },
  { id: 7, name: "العصر الحديث", startYear: 1300, endYear: 1450, color: "#be123c" },
];

// Field categories
const fieldCategories = [
  { id: "fiqh", name: "الفقه" },
  { id: "tafsir", name: "التفسير" },
  { id: "hadith", name: "الحديث" },
  { id: "aqeedah", name: "العقيدة" },
  { id: "usool", name: "أصول الفقه" },
  { id: "tasawwuf", name: "التصوف" },
  { id: "philosophy", name: "الفلسفة" },
  { id: "language", name: "اللغة" },
];

const ScholarDirectory: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredScholars, setFilteredScholars] = useState(scholars);
  const [selectedScholar, setSelectedScholar] = useState<any>(null);
  const [activeView, setActiveView] = useState<'grid' | 'timeline'>('grid');
  const [selectedEra, setSelectedEra] = useState<string>('all');
  const [selectedField, setSelectedField] = useState<string>('all');
  
  useEffect(() => {
    // Simulate loading scholar data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    // Filter scholars based on search term and filters
    let result = scholars;
    
    if (searchTerm) {
      result = result.filter(scholar => 
        scholar.name.includes(searchTerm) || 
        scholar.arabicName.includes(searchTerm) || 
        scholar.englishName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedEra !== 'all') {
      result = result.filter(scholar => scholar.era === selectedEra);
    }
    
    if (selectedField !== 'all') {
      result = result.filter(scholar => 
        scholar.specialization.some(field => fieldCategories.find(fc => fc.id === selectedField)?.name === field)
      );
    }
    
    setFilteredScholars(result);
  }, [searchTerm, selectedEra, selectedField]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled in the useEffect above
  };
  
  const handleScholarSelect = (scholar: any) => {
    setSelectedScholar(scholar);
  };
  
  const handleEraFilter = (era: string) => {
    setSelectedEra(era);
  };
  
  const handleFieldFilter = (field: string) => {
    setSelectedField(field);
  };
  
  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="ابحث عن عالم حسب الاسم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 w-full text-right"
              />
            </div>
          </form>
          
          <div className="flex items-center gap-2">
            <Button 
              variant={activeView === 'grid' ? 'default' : 'outline'} 
              onClick={() => setActiveView('grid')}
            >
              العرض الشبكي
            </Button>
            <Button 
              variant={activeView === 'timeline' ? 'default' : 'outline'} 
              onClick={() => setActiveView('timeline')}
            >
              الخط الزمني
            </Button>
          </div>
        </div>
      </div>
      
      {activeView === 'grid' ? (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Filters Panel */}
          <div className="md:col-span-1">
            <Card className="h-full">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-4 text-right">التصفية والبحث</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-right">العصر</h4>
                    <div className="flex flex-wrap gap-2 justify-end">
                      <Badge
                        key="all"
                        variant={selectedEra === 'all' ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleEraFilter('all')}
                      >
                        الكل
                      </Badge>
                      {scholars.map(scholar => scholar.era).filter((era, index, self) => self.indexOf(era) === index).map(era => (
                        <Badge
                          key={era}
                          variant={selectedEra === era ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => handleEraFilter(era)}
                        >
                          {era}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-right">التخصص</h4>
                    <div className="flex flex-wrap gap-2 justify-end">
                      <Badge
                        key="all-fields"
                        variant={selectedField === 'all' ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleFieldFilter('all')}
                      >
                        الكل
                      </Badge>
                      {fieldCategories.map(field => (
                        <Badge
                          key={field.id}
                          variant={selectedField === field.id ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => handleFieldFilter(field.id)}
                        >
                          {field.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button variant="outline" className="w-full">
                      <Filter className="h-4 w-4 ml-2" />
                      تصفية متقدمة
                    </Button>
                  </div>
                  
                  {selectedScholar && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="text-sm font-medium mb-2 text-right">معلومات سريعة</h4>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">{selectedScholar.birthYear} - {selectedScholar.deathYear} هـ</span>
                          <span>المعيشة:</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">{selectedScholar.birthPlace}</span>
                          <span>المولد:</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">{selectedScholar.madhab}</span>
                          <span>المذهب:</span>
                        </div>
                        <div className="flex flex-wrap gap-1 justify-end mt-2">
                          {selectedScholar.specialization.map((spec: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-2">
                          <BookOpen className="h-4 w-4 ml-1" />
                          عرض الملف الكامل
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Scholars Grid */}
          <div className="md:col-span-3">
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-right">العلماء والمفكرون الإسلاميون</CardTitle>
                <CardDescription className="text-right">
                  يُعرض {filteredScholars.length} عالم من أصل {scholars.length}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-4">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <Spinner size="lg" className="mr-2" />
                    <span>جاري تحميل بيانات العلماء...</span>
                  </div>
                ) : filteredScholars.length === 0 ? (
                  <div className="text-center py-12">
                    <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">لم يتم العثور على علماء</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      لم نتمكن من العثور على علماء يطابقون معايير البحث. جرب تعديل البحث أو تغيير التصفية.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredScholars.map(scholar => (
                      <Card 
                        key={scholar.id} 
                        className={`cursor-pointer transition-colors hover:border-sabeel-primary ${
                          selectedScholar?.id === scholar.id ? 'border-2 border-sabeel-primary' : ''
                        }`}
                        onClick={() => handleScholarSelect(scholar)}
                      >
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                            <Avatar className="w-20 h-20">
                              <AvatarImage src={scholar.avatar} alt={scholar.name} />
                              <AvatarFallback>{scholar.arabicName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            
                            <div className="text-center sm:text-right flex-1">
                              <div className="flex items-center justify-center sm:justify-end">
                                <h3 className="text-lg font-semibold">
                                  {scholar.name}
                                </h3>
                                {scholar.influence > 95 && (
                                  <Badge className="mr-2 p-1 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                                    <Award className="h-3 w-3" />
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex flex-wrap justify-center sm:justify-end gap-1 my-1">
                                <Badge variant="outline" className="text-xs">
                                  {scholar.madhab}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {scholar.era}
                                </Badge>
                              </div>
                              
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                                {scholar.bio}
                              </p>
                              
                              <div className="flex flex-wrap justify-center sm:justify-end gap-1 mt-2">
                                {scholar.specialization.slice(0, 3).map((spec, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {spec}
                                  </Badge>
                                ))}
                                {scholar.specialization.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{scholar.specialization.length - 3}
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                                <div className="flex items-center">
                                  <Calendar className="h-3 w-3 ml-1" />
                                  <span>{scholar.birthYear} - {scholar.deathYear} هـ</span>
                                </div>
                                <div className="flex items-center">
                                  <BookMarked className="h-3 w-3 ml-1" />
                                  <span>{scholar.mainWorks.length} مؤلف</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        
                        {selectedScholar?.id === scholar.id && (
                          <CardFooter className="bg-gray-50 dark:bg-gray-800 p-3">
                            <div className="w-full">
                              <h4 className="font-medium text-sm mb-2 text-right">أشهر المؤلفات:</h4>
                              <div className="flex flex-wrap gap-1 justify-end">
                                {scholar.mainWorks.map((work, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {work}
                                  </Badge>
                                ))}
                              </div>
                              
                              <div className="flex justify-between mt-3">
                                <Button variant="ghost" size="sm">
                                  <BookOpen className="h-4 w-4 ml-1" />
                                  المؤلفات
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <ArrowUpRight className="h-4 w-4 ml-1" />
                                  السيرة الكاملة
                                </Button>
                              </div>
                            </div>
                          </CardFooter>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-right">الخط الزمني للعلماء الإسلاميين</CardTitle>
            <CardDescription className="text-right">
              استعراض العلماء حسب العصور والفترات الزمنية
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-4">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Spinner size="lg" className="mr-2" />
                <span>جاري تحميل بيانات الخط الزمني...</span>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline Periods */}
                <div className="mb-8">
                  <div className="flex items-center h-12 relative">
                    {periods.map((period, index) => (
                      <div 
                        key={period.id}
                        className="h-full relative"
                        style={{ 
                          width: `${((period.endYear - period.startYear) / 1450) * 100}%`,
                          backgroundColor: `${period.color}20`
                        }}
                      >
                        <div className="absolute inset-x-0 -top-6 text-center text-xs font-medium">
                          {period.name}
                        </div>
                        <div className="absolute -bottom-6 left-0 text-xs text-gray-500">
                          {period.startYear} هـ
                        </div>
                        {index === periods.length - 1 && (
                          <div className="absolute -bottom-6 right-0 text-xs text-gray-500">
                            {period.endYear} هـ
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Timeline Scholar Points */}
                <div className="relative h-[400px] border-t border-gray-200 dark:border-gray-700">
                  {filteredScholars.map(scholar => {
                    // Calculate position based on birth year
                    const leftPosition = (scholar.birthYear / 1450) * 100;
                    const width = ((scholar.deathYear - scholar.birthYear) / 1450) * 100;
                    
                    return (
                      <div 
                        key={scholar.id}
                        className={`absolute h-20 transition-all ${
                          selectedScholar?.id === scholar.id 
                            ? 'scale-105 z-10' 
                            : 'hover:scale-105'
                        }`}
                        style={{ 
                          left: `${leftPosition}%`,
                          width: `${width}%`,
                          top: `${(scholar.id % 4) * 100}px`
                        }}
                        onClick={() => handleScholarSelect(scholar)}
                      >
                        <div className="absolute top-0 h-1 w-full bg-sabeel-primary/70 rounded-full"></div>
                        <div className="absolute top-2 right-0 bg-white dark:bg-gray-800 shadow-md rounded-lg p-2 border border-gray-200 dark:border-gray-700">
                          <div className="flex items-start gap-2">
                            <div className="text-right">
                              <p className="font-medium text-sm whitespace-nowrap">{scholar.name}</p>
                              <p className="text-xs text-gray-500">{scholar.birthYear} - {scholar.deathYear} هـ</p>
                              <div className="flex flex-wrap gap-1 mt-1 justify-end">
                                {scholar.specialization.slice(0, 2).map((spec, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {spec}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <Avatar className="w-8 h-8 flex-shrink-0">
                              <AvatarImage src={scholar.avatar} alt={scholar.name} />
                              <AvatarFallback>{scholar.arabicName.charAt(0)}</AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ScholarDirectory;
