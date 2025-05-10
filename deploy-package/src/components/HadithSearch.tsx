import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { 
  Search, 
  BookOpen, 
  Share2,
  Bookmark,
  Filter,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Info,
  User
} from "lucide-react";

// Mock data for hadith collections
const collections = [
  { id: 'bukhari', name: 'صحيح البخاري', arabicName: 'صحيح البخاري', englishName: 'Sahih al-Bukhari', count: 7563, isAuthentic: true },
  { id: 'muslim', name: 'صحيح مسلم', arabicName: 'صحيح مسلم', englishName: 'Sahih Muslim', count: 7563, isAuthentic: true },
  { id: 'tirmidhi', name: 'جامع الترمذي', arabicName: 'جامع الترمذي', englishName: 'Jami at-Tirmidhi', count: 3956, isAuthentic: true },
  { id: 'abudawud', name: 'سنن أبي داود', arabicName: 'سنن أبي داود', englishName: 'Sunan Abi Dawud', count: 5274, isAuthentic: true },
  { id: 'nasai', name: 'سنن النسائي', arabicName: 'سنن النسائي', englishName: 'Sunan an-Nasa\'i', count: 5758, isAuthentic: true },
  { id: 'ibnmajah', name: 'سنن ابن ماجه', arabicName: 'سنن ابن ماجه', englishName: 'Sunan Ibn Majah', count: 4341, isAuthentic: true },
];

// Mock data for categories
const categories = [
  { id: 'iman', name: 'الإيمان', count: 94 },
  { id: 'taharah', name: 'الطهارة', count: 157 },
  { id: 'salat', name: 'الصلاة', count: 412 },
  { id: 'zakat', name: 'الزكاة', count: 87 },
  { id: 'sawm', name: 'الصوم', count: 153 },
  { id: 'hajj', name: 'الحج', count: 274 },
  { id: 'buyu', name: 'البيوع', count: 237 },
  { id: 'nikah', name: 'النكاح', count: 171 },
  { id: 'adab', name: 'الأدب', count: 256 },
];

// Mock data for authentication levels
const authLevels = [
  { id: 'sahih', name: 'صحيح', color: 'green' },
  { id: 'hasan', name: 'حسن', color: 'blue' },
  { id: 'daif', name: 'ضعيف', color: 'yellow' },
  { id: 'mawdu', name: 'موضوع', color: 'red' },
];

// Mock hadith data
const mockHadiths = [
  {
    id: 1,
    collection: 'bukhari',
    book: 'الإيمان',
    chapter: 'باب قول النبي صلى الله عليه وسلم: «بني الإسلام على خمس»',
    number: '8',
    text: 'عَنْ ابْنِ عُمَرَ رَضِيَ اللَّهُ عَنْهُمَا، أَنَّ رَسُولَ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ قَالَ: «بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لاَ إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلاَةِ، وَإِيتَاءِ الزَّكَاةِ، وَالحَجِّ، وَصَوْمِ رَمَضَانَ»',
    translation: 'Ibn Umar (RAA) narrated that the Messenger of Allah (ﷺ) said, "Islam is built upon five (pillars): testifying that there is no god but Allah and that Muhammad is the Messenger of Allah, establishing the Salah (prayer), paying the Zakah (obligatory charity), making the Hajj (pilgrimage) to the House, and fasting in Ramadan."',
    narrator: 'ابن عمر',
    authLevel: 'sahih',
    isBookmarked: false,
  },
  {
    id: 2,
    collection: 'bukhari',
    book: 'الإيمان',
    chapter: 'باب من قال إن الإيمان هو العمل',
    number: '42',
    text: 'عَنْ أَبِي هُرَيْرَةَ، قَالَ: قِيلَ: يَا رَسُولَ اللَّهِ، أَيُّ العَمَلِ أَفْضَلُ؟ قَالَ: «إِيمَانٌ بِاللَّهِ وَرَسُولِهِ» قِيلَ: ثُمَّ مَاذَا؟ قَالَ: «الجِهَادُ فِي سَبِيلِ اللَّهِ» قِيلَ ثُمَّ مَاذَا؟ قَالَ: «حَجٌّ مَبْرُورٌ»',
    translation: 'Abu Huraira reported: It was said, "O Messenger of Allah, which deed is best?" The Messenger of Allah, peace and blessings be upon him, said, "Faith in Allah and His Messenger." It was said, "Then what?" The Prophet said, "Jihad in the way of Allah." It was said, "Then what?" The Prophet said, "An accepted pilgrimage."',
    narrator: 'أبو هريرة',
    authLevel: 'sahih',
    isBookmarked: true,
  },
  {
    id: 3,
    collection: 'muslim',
    book: 'الإيمان',
    chapter: 'باب بيان أركان الإسلام ودعائمه العظام',
    number: '16',
    text: 'عَنْ أَبِي عَبْدِ الرَّحْمَنِ عَبْدِ اللهِ بْنِ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللهُ عَنْهُمَا، قَالَ: سَمِعْتُ رَسُولَ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ يَقُولُ: «بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لَا إِلَهَ إِلَّا اللهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللهِ، وَإِقَامِ الصَّلَاةِ، وَإِيتَاءِ الزَّكَاةِ، وَحَجِّ الْبَيْتِ، وَصَوْمِ رَمَضَانَ»',
    translation: 'Abdullah ibn Umar reported: I heard the Messenger of Allah, peace and blessings be upon him, say, "Islam is built upon five: the testimony that there is no god but Allah and Muhammad is the Messenger of Allah, the establishment of prayer, the payment of zakat, the pilgrimage, and fasting in Ramadan."',
    narrator: 'عبد الله بن عمر',
    authLevel: 'sahih',
    isBookmarked: false,
  }
];

const HadithSearch: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedHadith, setSelectedHadith] = useState<any>(null);
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAuthLevel, setSelectedAuthLevel] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('search');
  
  useEffect(() => {
    // Simulate loading hadith data
    const timer = setTimeout(() => {
      setSearchResults(mockHadiths);
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate search
    setTimeout(() => {
      if (!searchTerm) {
        setSearchResults(mockHadiths);
      } else {
        const results = mockHadiths.filter(hadith => 
          hadith.text.includes(searchTerm) || 
          hadith.translation.includes(searchTerm)
        );
        setSearchResults(results);
      }
      setLoading(false);
    }, 800);
  };
  
  const handleCollectionChange = (value: string) => {
    setSelectedCollection(value);
    setLoading(true);
    
    // Simulate filtering
    setTimeout(() => {
      if (value === 'all') {
        setSearchResults(mockHadiths);
      } else {
        const results = mockHadiths.filter(hadith => hadith.collection === value);
        setSearchResults(results);
      }
      setLoading(false);
    }, 500);
  };
  
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    // In a real app, this would filter hadiths by category
  };
  
  const handleAuthLevelChange = (value: string) => {
    setSelectedAuthLevel(value);
    // In a real app, this would filter hadiths by authentication level
  };
  
  const handleHadithSelect = (hadith: any) => {
    setSelectedHadith(hadith);
  };
  
  const toggleBookmark = (id: number) => {
    setSearchResults(prev => 
      prev.map(hadith => 
        hadith.id === id 
          ? { ...hadith, isBookmarked: !hadith.isBookmarked }
          : hadith
      )
    );
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="search">
              <Search className="h-4 w-4 ml-2" />
              البحث في الحديث
            </TabsTrigger>
            <TabsTrigger value="collections">
              <BookOpen className="h-4 w-4 ml-2" />
              مصادر الحديث
            </TabsTrigger>
            <TabsTrigger value="advanced">
              <Filter className="h-4 w-4 ml-2" />
              بحث متقدم
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Filters Panel */}
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardContent className="p-4">
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="ابحث في الحديث الشريف..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 w-full text-right"
                  />
                </div>
                <Button type="submit" className="w-full mt-2 bg-sabeel-primary">
                  بحث
                </Button>
              </form>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2 text-right">المصدر</h4>
                  <Select value={selectedCollection} onValueChange={handleCollectionChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر المصدر" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع المصادر</SelectItem>
                      {collections.map(collection => (
                        <SelectItem key={collection.id} value={collection.id}>
                          {collection.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2 text-right">التصنيف</h4>
                  <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر التصنيف" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع التصنيفات</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name} ({category.count})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2 text-right">درجة الحديث</h4>
                  <div className="flex flex-wrap gap-2 justify-end">
                    {authLevels.map(level => (
                      <Badge
                        key={level.id}
                        variant={selectedAuthLevel === level.id ? "default" : "outline"}
                        className={`cursor-pointer ${
                          level.id === 'sahih' ? 'hover:bg-green-100 hover:text-green-800' :
                          level.id === 'hasan' ? 'hover:bg-blue-100 hover:text-blue-800' :
                          level.id === 'daif' ? 'hover:bg-yellow-100 hover:text-yellow-800' :
                          'hover:bg-red-100 hover:text-red-800'
                        }`}
                        onClick={() => handleAuthLevelChange(level.id)}
                      >
                        {level.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button variant="outline" className="w-full">
                    <Filter className="h-4 w-4 ml-2" />
                    تصفية متقدمة
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Search Results */}
        <div className="md:col-span-3 flex flex-col">
          <Card className="flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-right">نتائج البحث</CardTitle>
              <CardDescription className="text-right">
                {loading ? 'جاري البحث...' : `تم العثور على ${searchResults.length} حديث`}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Spinner size="lg" className="mr-2" />
                  <span>جاري البحث في الأحاديث...</span>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">لم يتم العثور على أحاديث</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    لم نتمكن من العثور على أحاديث تطابق معايير البحث. جرب تعديل البحث أو تغيير المصدر.
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[calc(100vh-350px)]">
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {searchResults.map(hadith => (
                      <div 
                        key={hadith.id}
                        className={`p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${
                          selectedHadith?.id === hadith.id ? 'bg-sabeel-primary/5 border-r-4 border-sabeel-primary' : ''
                        }`}
                        onClick={() => handleHadithSelect(hadith)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className={hadith.isBookmarked ? 'text-yellow-500' : 'text-gray-400'}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleBookmark(hadith.id);
                              }}
                            >
                              <Bookmark className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center">
                            <Badge className="ml-2" variant="outline">
                              {collections.find(c => c.id === hadith.collection)?.name}
                            </Badge>
                            <Badge 
                              className={`
                                ${hadith.authLevel === 'sahih' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : ''}
                                ${hadith.authLevel === 'hasan' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' : ''}
                                ${hadith.authLevel === 'daif' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' : ''}
                                ${hadith.authLevel === 'mawdu' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' : ''}
                              `}
                            >
                              {authLevels.find(a => a.id === hadith.authLevel)?.name}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-right text-gray-500 text-sm">
                            {hadith.book} - {hadith.chapter} - حديث رقم {hadith.number}
                          </p>
                          
                          <p className="text-right text-lg font-arabic leading-relaxed" dir="rtl">
                            {hadith.text}
                          </p>
                          
                          <div className="flex items-center justify-end text-sm text-gray-500">
                            <User className="h-3 w-3 ml-1" />
                            <span>{hadith.narrator}</span>
                          </div>
                          
                          {selectedHadith?.id === hadith.id && (
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                              <p className="text-gray-700 dark:text-gray-300 text-right">
                                {hadith.translation}
                              </p>
                              
                              <div className="flex justify-end mt-4 space-x-2 rtl:space-x-reverse">
                                <Button variant="outline" size="sm">
                                  <Info className="h-4 w-4 ml-1" />
                                  تخريج الحديث
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Share2 className="h-4 w-4 ml-1" />
                                  مشاركة
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HadithSearch;
