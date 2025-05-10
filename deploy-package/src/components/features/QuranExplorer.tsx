import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { 
  Search, 
  BookOpen, 
  Play,
  BookMarked,
  Download,
  Share2,
  Heart,
  Bookmark,
  Volume2,
  VolumeX
} from "lucide-react";

// Mock Quran data
const mockSurahs = [
  { id: 1, name: "الفاتحة", arabicName: "الفاتحة", englishName: "Al-Fatiha", verses: 7, type: "مكية" },
  { id: 2, name: "البقرة", arabicName: "البقرة", englishName: "Al-Baqarah", verses: 286, type: "مدنية" },
  { id: 3, name: "آل عمران", arabicName: "آل عمران", englishName: "Ali 'Imran", verses: 200, type: "مدنية" },
  { id: 4, name: "النساء", arabicName: "النساء", englishName: "An-Nisa", verses: 176, type: "مدنية" },
  { id: 5, name: "المائدة", arabicName: "المائدة", englishName: "Al-Ma'idah", verses: 120, type: "مدنية" },
  // Example data for first 5 surahs, in production this would be all 114
];

// Mock Al-Fatiha text
const fatihaVerses = [
  { id: 1, text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful." },
  { id: 2, text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", translation: "All praise is due to Allah, Lord of the worlds." },
  { id: 3, text: "الرَّحْمَٰنِ الرَّحِيمِ", translation: "The Entirely Merciful, the Especially Merciful." },
  { id: 4, text: "مَالِكِ يَوْمِ الدِّينِ", translation: "Sovereign of the Day of Recompense." },
  { id: 5, text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", translation: "It is You we worship and You we ask for help." },
  { id: 6, text: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", translation: "Guide us to the straight path." },
  { id: 7, text: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", translation: "The path of those upon whom You have bestowed favor, not of those who have earned [Your] anger or of those who are astray." },
];

// Mock reciters data
const mockReciters = [
  { id: 1, name: "عبد الباسط عبد الصمد", style: "مرتل" },
  { id: 2, name: "محمود خليل الحصري", style: "مرتل" },
  { id: 3, name: "محمد صديق المنشاوي", style: "مرتل" },
  { id: 4, name: "ماهر المعيقلي", style: "مرتل" },
  { id: 5, name: "سعد الغامدي", style: "مرتل" },
];

// Mock tafsir data
const mockTafsirs = [
  { id: 1, name: "تفسير ابن كثير", author: "ابن كثير", language: "العربية" },
  { id: 2, name: "تفسير الطبري", author: "الطبري", language: "العربية" },
  { id: 3, name: "تفسير القرطبي", author: "القرطبي", language: "العربية" },
  { id: 4, name: "تفسير السعدي", author: "السعدي", language: "العربية" },
  { id: 5, name: "Tafsir Ibn Kathir (English)", author: "Ibn Kathir", language: "الإنجليزية" },
];

const QuranExplorer: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [selectedReciter, setSelectedReciter] = useState<number>(1);
  const [selectedTafsir, setSelectedTafsir] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState<'reading' | 'tafsir' | 'translation' | 'wordByWord'>('reading');
  const [displayLanguage, setDisplayLanguage] = useState<'arabic' | 'both'>('both');
  
  useEffect(() => {
    // Simulate loading Quran data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
    // In production this would perform a semantic search across the Quran
  };
  
  const handleSurahChange = (surahId: string) => {
    setSelectedSurah(parseInt(surahId));
    setSelectedVerse(null);
  };
  
  const handleVerseClick = (verseId: number) => {
    setSelectedVerse(verseId);
  };
  
  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
    // In production this would control the audio playback
  };
  
  const handleReciterChange = (reciterId: string) => {
    setSelectedReciter(parseInt(reciterId));
    setIsPlaying(false);
  };
  
  const handleTafsirChange = (tafsirId: string) => {
    setSelectedTafsir(parseInt(tafsirId));
  };
  
  const handleViewModeChange = (mode: string) => {
    setViewMode(mode as 'reading' | 'tafsir' | 'translation' | 'wordByWord');
  };
  
  const handleLanguageChange = (lang: string) => {
    setDisplayLanguage(lang as 'arabic' | 'both');
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
                placeholder="ابحث في القرآن الكريم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 w-full text-right"
              />
            </div>
          </form>
          
          <div className="flex flex-wrap items-center gap-2">
            <Select value={selectedSurah.toString()} onValueChange={handleSurahChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="اختر سورة" />
              </SelectTrigger>
              <SelectContent>
                {mockSurahs.map(surah => (
                  <SelectItem key={surah.id} value={surah.id.toString()}>
                    {surah.id}. {surah.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={viewMode} onValueChange={handleViewModeChange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="طريقة العرض" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reading">القراءة</SelectItem>
                <SelectItem value="tafsir">التفسير</SelectItem>
                <SelectItem value="translation">الترجمة</SelectItem>
                <SelectItem value="wordByWord">كلمة بكلمة</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant={isPlaying ? "default" : "outline"} onClick={toggleAudio}>
              {isPlaying ? <Volume2 className="h-4 w-4 ml-2" /> : <VolumeX className="h-4 w-4 ml-2" />}
              {isPlaying ? "إيقاف التلاوة" : "الاستماع"}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Surah List */}
        <div className="md:col-span-1 order-2 md:order-1">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-right text-lg">سور القرآن الكريم</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-250px)]">
                <div className="p-4 space-y-1">
                  {mockSurahs.map(surah => (
                    <button
                      key={surah.id}
                      onClick={() => handleSurahChange(surah.id.toString())}
                      className={`w-full flex justify-between items-center py-2 px-3 rounded-md transition-colors ${
                        selectedSurah === surah.id 
                          ? 'bg-sabeel-primary/10 text-sabeel-primary' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs">
                          {surah.id}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{surah.name}</div>
                        <div className="text-xs text-gray-500">
                          {surah.type} - {surah.verses} آية
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Quran Display */}
        <div className="md:col-span-3 order-1 md:order-2">
          <Card className="h-full">
            <CardContent className="p-4 h-full">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <Spinner size="lg" className="mx-auto" />
                  <span className="mr-2">جاري تحميل القرآن الكريم...</span>
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  <div className="mb-4 text-center">
                    <h2 className="text-2xl font-bold mb-1">
                      سورة {mockSurahs.find(s => s.id === selectedSurah)?.name}
                    </h2>
                    <p className="text-gray-500 text-sm">
                      {mockSurahs.find(s => s.id === selectedSurah)?.type} - {mockSurahs.find(s => s.id === selectedSurah)?.verses} آية
                    </p>
                    
                    {selectedSurah === 1 && (
                      <div className="mt-4 mb-2 border-y border-gray-200 dark:border-gray-700 py-4">
                        <h3 className="text-xl font-quran text-center mb-2">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</h3>
                      </div>
                    )}
                  </div>
                  
                  <ScrollArea className="flex-1">
                    <div className="space-y-6">
                      {selectedSurah === 1 && viewMode === 'reading' && (
                        <div className="text-center leading-loose">
                          <p className="text-2xl font-quran mb-8" style={{ lineHeight: 2.5 }}>
                            {fatihaVerses.map((verse, idx) => (
                              <span
                                key={verse.id}
                                onClick={() => handleVerseClick(verse.id)}
                                className={`mx-1 cursor-pointer hover:text-sabeel-primary transition-colors ${
                                  selectedVerse === verse.id ? 'text-sabeel-primary' : ''
                                }`}
                              >
                                {verse.text} 
                                <span className="inline-block mx-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs align-top">
                                  {verse.id}
                                </span>
                              </span>
                            ))}
                          </p>
                        </div>
                      )}
                      
                      {selectedSurah === 1 && viewMode === 'translation' && (
                        <div className="space-y-6">
                          {fatihaVerses.map(verse => (
                            <div 
                              key={verse.id}
                              className={`p-4 rounded-lg border ${
                                selectedVerse === verse.id 
                                  ? 'border-sabeel-primary/20 bg-sabeel-primary/5' 
                                  : 'border-gray-200 dark:border-gray-700'
                              }`}
                              onClick={() => handleVerseClick(verse.id)}
                            >
                              {displayLanguage === 'both' && (
                                <p className="text-xl font-quran text-right mb-2" dir="rtl">
                                  {verse.text}
                                  <span className="inline-block mr-2 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs align-top">
                                    {verse.id}
                                  </span>
                                </p>
                              )}
                              <p className="text-gray-700 dark:text-gray-300">
                                {verse.translation}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {selectedSurah === 1 && viewMode === 'tafsir' && (
                        <div className="space-y-6">
                          {selectedVerse ? (
                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                              <div className="mb-4 text-right">
                                <p className="text-xl font-quran mb-2" dir="rtl">
                                  {fatihaVerses.find(v => v.id === selectedVerse)?.text}
                                  <span className="inline-block mr-2 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs align-top">
                                    {selectedVerse}
                                  </span>
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">
                                  {fatihaVerses.find(v => v.id === selectedVerse)?.translation}
                                </p>
                              </div>
                              
                              <div className="mt-4">
                                <h3 className="font-bold text-lg text-right mb-2">
                                  {mockTafsirs.find(t => t.id === selectedTafsir)?.name}
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 text-right" dir="rtl">
                                  {selectedVerse === 1 && "بسم الله الرحمن الرحيم من أسماء الله تعالى، وهي من صفات الله سبحانه، وفيها دلالة على أن الله سبحانه وتعالى هو المتصف بالرحمة الواسعة العامة لجميع الخلق في الدنيا..."}
                                  {selectedVerse === 2 && "الْحَمْدُ للَّهِ رَبِّ الْعَالَمِينَ: الحمد هو الثناء على الله بصفاته التي هي صفات الكمال، وبنعمه الظاهرة والباطنة الدينية والدنيوية. والرب هو المربي جميع خلقه بتدبير أمورهم..."}
                                  {selectedVerse > 2 && "هنا سيكون تفسير الآية المختارة من تفسير المختار..."}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center p-8">
                              <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                              <h3 className="text-lg font-medium mb-2">اختر آية لعرض تفسيرها</h3>
                              <p className="text-gray-500">
                                يرجى النقر على أي آية من السورة لعرض تفسيرها المفصل
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {selectedSurah === 1 && viewMode === 'wordByWord' && (
                        <div className="space-y-8">
                          {fatihaVerses.map(verse => (
                            <div 
                              key={verse.id}
                              className={`p-4 rounded-lg border ${
                                selectedVerse === verse.id 
                                  ? 'border-sabeel-primary/20 bg-sabeel-primary/5' 
                                  : 'border-gray-200 dark:border-gray-700'
                              }`}
                              onClick={() => handleVerseClick(verse.id)}
                            >
                              <div className="flex flex-wrap gap-4 justify-center mb-4">
                                {verse.text.split(' ').map((word, idx) => (
                                  <div key={idx} className="flex flex-col items-center text-center">
                                    <span className="text-lg font-quran">{word}</span>
                                    <span className="text-xs text-gray-500 mt-1">
                                      {/* Word translation would go here */}
                                      {verse.id === 1 && idx === 0 && "باسم"}
                                      {verse.id === 1 && idx === 1 && "الله"}
                                      {verse.id === 1 && idx === 2 && "الرحمن"}
                                      {verse.id === 1 && idx === 3 && "الرحيم"}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-2">
                                {verse.translation}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {selectedSurah !== 1 && (
                        <div className="text-center p-12">
                          <BookMarked className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                          <h3 className="text-xl font-medium mb-2">سيتم إضافة باقي سور القرآن قريباً</h3>
                          <p className="text-gray-500 max-w-md mx-auto">
                            حالياً يمكنك الاطلاع على سورة الفاتحة كنموذج. في النسخة الكاملة سيتوفر القرآن الكريم كاملاً.
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                  
                  {/* Audio controls will be displayed when audio is playing */}
                  {isPlaying && (
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-sabeel-primary h-1 w-24 rounded-full overflow-hidden">
                          <div className="bg-white h-full w-1/3"></div>
                        </div>
                        <span className="text-xs text-gray-500 ml-2">01:23 / 03:45</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium ml-2">
                          {mockReciters.find(r => r.id === selectedReciter)?.name}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Settings and Controls */}
        <div className="md:col-span-1 order-3">
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-right text-lg">الإعدادات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2 text-right">القارئ</h4>
                  <Select value={selectedReciter.toString()} onValueChange={handleReciterChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر القارئ" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockReciters.map(reciter => (
                        <SelectItem key={reciter.id} value={reciter.id.toString()}>
                          {reciter.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {viewMode === 'tafsir' && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-right">التفسير</h4>
                    <Select value={selectedTafsir.toString()} onValueChange={handleTafsirChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر التفسير" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockTafsirs.map(tafsir => (
                          <SelectItem key={tafsir.id} value={tafsir.id.toString()}>
                            {tafsir.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {viewMode === 'translation' && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-right">لغة العرض</h4>
                    <Select value={displayLanguage} onValueChange={handleLanguageChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="لغة العرض" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="arabic">العربية فقط</SelectItem>
                        <SelectItem value="both">العربية والترجمة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="pt-2 space-y-2">
                  <Button variant="outline" className="w-full">
                    <Bookmark className="h-4 w-4 ml-2" />
                    حفظ الموضع الحالي
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 ml-2" />
                    تنزيل السورة
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Share2 className="h-4 w-4 ml-2" />
                    مشاركة
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {selectedVerse && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-right text-lg">الآية {selectedVerse}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-right">
                    <p className="text-lg font-quran mb-2">
                      {fatihaVerses.find(v => v.id === selectedVerse)?.text}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {fatihaVerses.find(v => v.id === selectedVerse)?.translation}
                    </p>
                    
                    <div className="flex justify-end mt-4 space-x-2 rtl:space-x-reverse">
                      <Button variant="ghost" size="sm">
                        <Heart className="h-4 w-4 ml-1" />
                        إضافة للمفضلة
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Play className="h-4 w-4 ml-1" />
                        استماع
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuranExplorer;
