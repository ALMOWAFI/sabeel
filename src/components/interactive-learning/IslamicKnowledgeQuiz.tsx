/**
 * IslamicKnowledgeQuiz.tsx
 * 
 * Interactive quiz system for testing and enhancing Islamic knowledge
 * Supports different difficulty levels, categories, and provides immediate feedback
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { BookOpen, Award, BarChart, Clock, RefreshCcw, Share2, Download } from 'lucide-react';
import QuizQuestion, { QuestionProps } from './QuizQuestion';
import appwriteAuthBridge from '@/services/AppwriteAuthBridge';

// Sample questions for demo purposes
const sampleQuestions: QuestionProps[] = [
  {
    id: "q1",
    question: "What is the first pillar of Islam?",
    questionArabic: "ما هو الركن الأول من أركان الإسلام؟",
    options: [
      { id: "a", text: "Prayer (Salah)", textArabic: "الصلاة" },
      { id: "b", text: "Fasting (Sawm)", textArabic: "الصوم" },
      { id: "c", text: "Declaration of Faith (Shahada)", textArabic: "الشهادة" },
      { id: "d", text: "Charity (Zakat)", textArabic: "الزكاة" }
    ],
    correctOptionId: "c",
    explanation: "The first pillar of Islam is the Declaration of Faith (Shahada): 'There is no god but Allah, and Muhammad is the messenger of Allah.'",
    explanationArabic: "الركن الأول من أركان الإسلام هو الشهادة: 'أشهد أن لا إله إلا الله وأشهد أن محمداً رسول الله'",
    category: "الأركان",
    difficulty: "beginner"
  },
  {
    id: "q2",
    question: "Which of the following is not one of the four Rightly Guided Caliphs?",
    questionArabic: "أي مما يلي ليس من الخلفاء الراشدين الأربعة؟",
    options: [
      { id: "a", text: "Abu Bakr", textArabic: "أبو بكر" },
      { id: "b", text: "Umar ibn Al-Khattab", textArabic: "عمر بن الخطاب" },
      { id: "c", text: "Muawiyah ibn Abi Sufyan", textArabic: "معاوية بن أبي سفيان" },
      { id: "d", text: "Ali ibn Abi Talib", textArabic: "علي بن أبي طالب" }
    ],
    correctOptionId: "c",
    explanation: "The four Rightly Guided Caliphs (Al-Khulafa Al-Rashidun) were Abu Bakr, Umar ibn Al-Khattab, Uthman ibn Affan, and Ali ibn Abi Talib. Muawiyah ibn Abi Sufyan was the first Caliph of the Umayyad dynasty.",
    explanationArabic: "الخلفاء الراشدون الأربعة هم أبو بكر، عمر بن الخطاب، عثمان بن عفان، وعلي بن أبي طالب. أما معاوية بن أبي سفيان فكان أول خليفة في الدولة الأموية.",
    category: "التاريخ الإسلامي",
    difficulty: "intermediate"
  },
  {
    id: "q3",
    question: "Which surah in the Quran is considered the 'heart of the Quran'?",
    questionArabic: "أي سورة في القرآن تعتبر 'قلب القرآن'؟",
    options: [
      { id: "a", text: "Surah Al-Fatiha", textArabic: "سورة الفاتحة" },
      { id: "b", text: "Surah Yasin", textArabic: "سورة يس" },
      { id: "c", text: "Surah Al-Ikhlas", textArabic: "سورة الإخلاص" },
      { id: "d", text: "Surah Al-Baqarah", textArabic: "سورة البقرة" }
    ],
    correctOptionId: "b",
    explanation: "Surah Yasin is often referred to as the 'heart of the Quran' (Qalb Al-Quran) based on hadith narrations.",
    explanationArabic: "سورة يس غالباً ما يشار إليها بـ 'قلب القرآن' بناءً على أحاديث نبوية.",
    category: "القرآن",
    difficulty: "intermediate",
    quranReference: "سورة يس"
  }
];

const categories = [
  { value: "all", label: "جميع الفئات" },
  { value: "الأركان", label: "أركان الإسلام" },
  { value: "القرآن", label: "القرآن الكريم" },
  { value: "الحديث", label: "الحديث الشريف" },
  { value: "الفقه", label: "الفقه" },
  { value: "التاريخ الإسلامي", label: "التاريخ الإسلامي" },
  { value: "العقيدة", label: "العقيدة" }
];

const difficulties = [
  { value: "all", label: "جميع المستويات" },
  { value: "beginner", label: "مبتدئ" },
  { value: "intermediate", label: "متوسط" },
  { value: "advanced", label: "متقدم" }
];

interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  timeTaken: number; // in seconds
  categories: Record<string, { total: number; correct: number }>;
  date: string;
}

const IslamicKnowledgeQuiz: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('quiz');
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<QuestionProps[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<QuestionProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [showArabic, setShowArabic] = useState(true);
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [quizSize, setQuizSize] = useState(5);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [currentResult, setCurrentResult] = useState<QuizResult | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, { selectedOptionId: string; isCorrect: boolean }>>({});
  
  // Load questions
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        // In a real app, fetch from API
        // For demo, use sample questions
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        setQuestions(sampleQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
        toast({
          variant: "destructive",
          title: "خطأ",
          description: "حدث خطأ أثناء تحميل الأسئلة"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuestions();
  }, [toast]);
  
  // Filter questions when category or difficulty changes
  useEffect(() => {
    if (questions.length === 0) return;
    
    let filtered = [...questions];
    
    if (category !== 'all') {
      filtered = filtered.filter(q => q.category === category);
    }
    
    if (difficulty !== 'all') {
      filtered = filtered.filter(q => q.difficulty === difficulty);
    }
    
    // Shuffle and limit to quiz size
    filtered = shuffleArray(filtered).slice(0, quizSize);
    
    setFilteredQuestions(filtered);
  }, [questions, category, difficulty, quizSize]);
  
  // Timer for quiz
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isStarted && startTime && remainingTime !== null) {
      timer = setInterval(() => {
        const remaining = Math.max(0, remainingTime - 1);
        setRemainingTime(remaining);
        
        if (remaining === 0) {
          // Time's up, end quiz
          endQuiz();
        }
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isStarted, startTime, remainingTime]);
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Shuffle array (Fisher-Yates algorithm)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  // Start quiz
  const startQuiz = () => {
    if (filteredQuestions.length === 0) {
      toast({
        variant: "destructive",
        title: "لا توجد أسئلة",
        description: "لا توجد أسئلة متاحة بالمعايير المحددة"
      });
      return;
    }
    
    setIsStarted(true);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setStartTime(Date.now());
    setRemainingTime(quizSize * 60); // 1 minute per question
    
    // Initialize current result
    setCurrentResult({
      totalQuestions: filteredQuestions.length,
      correctAnswers: 0,
      incorrectAnswers: 0,
      timeTaken: 0,
      categories: {},
      date: new Date().toISOString()
    });
  };
  
  // End quiz
  const endQuiz = () => {
    if (!startTime || !currentResult) return;
    
    const timeTaken = remainingTime !== null 
      ? (quizSize * 60) - remainingTime 
      : Math.floor((Date.now() - startTime) / 1000);
    
    const finalResult: QuizResult = {
      ...currentResult,
      timeTaken
    };
    
    setResults(prev => [finalResult, ...prev]);
    setIsStarted(false);
    setStartTime(null);
    setRemainingTime(null);
    
    // Save achievement if applicable
    saveQuizAchievement(finalResult);
    
    toast({
      title: "انتهى الاختبار",
      description: `أجبت على ${finalResult.correctAnswers} من ${finalResult.totalQuestions} بشكل صحيح`
    });
    
    // Switch to results tab
    setActiveTab('results');
  };
  
  // Handle question answer
  const handleAnswer = (questionId: string, selectedOptionId: string, isCorrect: boolean) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { selectedOptionId, isCorrect }
    }));
    
    if (!currentResult) return;
    
    // Update current result
    const question = filteredQuestions.find(q => q.id === questionId);
    if (!question) return;
    
    const category = question.category;
    const categoryStats = currentResult.categories[category] || { total: 0, correct: 0 };
    
    setCurrentResult(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
        incorrectAnswers: !isCorrect ? prev.incorrectAnswers + 1 : prev.incorrectAnswers,
        categories: {
          ...prev.categories,
          [category]: {
            total: categoryStats.total + 1,
            correct: isCorrect ? categoryStats.correct + 1 : categoryStats.correct
          }
        }
      };
    });
    
    // Move to next question after a delay
    setTimeout(() => {
      if (currentQuestionIndex < filteredQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // End of quiz
        endQuiz();
      }
    }, 2000);
  };
  
  // Save achievement for completing quiz
  const saveQuizAchievement = async (result: QuizResult) => {
    try {
      const score = Math.round((result.correctAnswers / result.totalQuestions) * 100);
      
      // Only save achievements for good scores
      if (score < 60) return;
      
      const user = await appwriteAuthBridge.getCurrentUser();
      if (!user || user.isGuest) return;
      
      // Define achievement based on score
      let achievement = {
        name: "Knowledge Seeker",
        nameArabic: "باحث المعرفة",
        description: "Completed an Islamic knowledge quiz",
        descriptionArabic: "أكمل اختبار المعرفة الإسلامية",
        category: "learning",
        points: 5,
        dateEarned: new Date().toISOString()
      };
      
      if (score >= 90) {
        achievement = {
          name: "Islamic Scholar",
          nameArabic: "عالم إسلامي",
          description: "Scored 90% or higher on an Islamic knowledge quiz",
          descriptionArabic: "حصل على 90% أو أكثر في اختبار المعرفة الإسلامية",
          category: "learning",
          points: 20,
          dateEarned: new Date().toISOString()
        };
      } else if (score >= 80) {
        achievement = {
          name: "Knowledge Master",
          nameArabic: "متقن المعرفة",
          description: "Scored 80% or higher on an Islamic knowledge quiz",
          descriptionArabic: "حصل على 80% أو أكثر في اختبار المعرفة الإسلامية",
          category: "learning",
          points: 15,
          dateEarned: new Date().toISOString()
        };
      } else if (score >= 70) {
        achievement = {
          name: "Dedicated Student",
          nameArabic: "طالب مجتهد",
          description: "Scored 70% or higher on an Islamic knowledge quiz",
          descriptionArabic: "حصل على 70% أو أكثر في اختبار المعرفة الإسلامية",
          category: "learning",
          points: 10,
          dateEarned: new Date().toISOString()
        };
      }
      
      await appwriteAuthBridge.addAchievement(achievement);
      
      toast({
        title: `حصلت على إنجاز: ${achievement.nameArabic}`,
        description: achievement.descriptionArabic
      });
    } catch (error) {
      console.error('Error saving achievement:', error);
    }
  };
  
  // Get quiz progress
  const getProgress = (): number => {
    if (!isStarted || filteredQuestions.length === 0) return 0;
    return ((currentQuestionIndex + 1) / filteredQuestions.length) * 100;
  };
  
  // Share quiz results
  const shareResults = () => {
    if (!currentResult) return;
    
    const score = Math.round((currentResult.correctAnswers / currentResult.totalQuestions) * 100);
    const text = `حصلت على ${currentResult.correctAnswers} من ${currentResult.totalQuestions} (${score}%) في اختبار المعرفة الإسلامية على منصة سبيل! #سبيل #المعرفة_الإسلامية`;
    
    if (navigator.share) {
      navigator.share({
        title: 'نتيجة اختبار المعرفة الإسلامية',
        text,
        url: window.location.href
      }).catch(err => console.error('Error sharing:', err));
    } else {
      // Fallback
      navigator.clipboard.writeText(text).then(() => {
        toast({
          title: "تم النسخ",
          description: "تم نسخ النتيجة إلى الحافظة"
        });
      });
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-right">اختبار المعرفة الإسلامية</CardTitle>
        <CardDescription className="text-right">
          اختبر معرفتك بالإسلام وتعلم معلومات جديدة
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="quiz" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quiz" disabled={isStarted}>
              <BookOpen className="mr-2 h-4 w-4" />
              الاختبار
            </TabsTrigger>
            <TabsTrigger value="results" disabled={isStarted}>
              <BarChart className="mr-2 h-4 w-4" />
              النتائج
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="quiz" className="space-y-4 mt-4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Spinner size="lg" />
              </div>
            ) : isStarted ? (
              <div className="space-y-4">
                {/* Progress and timer */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span className="font-mono">{formatTime(remainingTime || 0)}</span>
                  </div>
                  <div className="text-sm">
                    {currentQuestionIndex + 1} / {filteredQuestions.length}
                  </div>
                </div>
                
                <Progress value={getProgress()} className="h-2" />
                
                {/* Current question */}
                {currentQuestionIndex < filteredQuestions.length && (
                  <QuizQuestion
                    question={filteredQuestions[currentQuestionIndex]}
                    onAnswer={handleAnswer}
                    currentIndex={currentQuestionIndex}
                    totalQuestions={filteredQuestions.length}
                    showArabic={showArabic}
                  />
                )}
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={endQuiz}>
                    إنهاء الاختبار
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-right">إعدادات الاختبار</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-right block">الفئة</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="اختر الفئة" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="difficulty" className="text-right block">المستوى</Label>
                      <Select value={difficulty} onValueChange={setDifficulty}>
                        <SelectTrigger id="difficulty">
                          <SelectValue placeholder="اختر المستوى" />
                        </SelectTrigger>
                        <SelectContent>
                          {difficulties.map(diff => (
                            <SelectItem key={diff.value} value={diff.value}>
                              {diff.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="quizSize" className="text-right block">عدد الأسئلة</Label>
                    <div className="flex justify-between items-center">
                      <span>3</span>
                      <input
                        type="range"
                        id="quizSize"
                        min="3"
                        max="10"
                        step="1"
                        value={quizSize}
                        onChange={(e) => setQuizSize(parseInt(e.target.value))}
                        className="flex-1 mx-4"
                      />
                      <span>10</span>
                    </div>
                    <div className="text-center">{quizSize}</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="showArabic">عرض الأسئلة بالعربية</Label>
                      <p className="text-sm text-muted-foreground">
                        عرض الأسئلة والخيارات باللغة العربية إن وجدت
                      </p>
                    </div>
                    <Switch
                      id="showArabic"
                      checked={showArabic}
                      onCheckedChange={setShowArabic}
                    />
                  </div>
                </div>
                
                <div className="text-center">
                  <Button 
                    onClick={startQuiz} 
                    size="lg"
                    disabled={questions.length === 0 || filteredQuestions.length === 0}
                  >
                    بدء الاختبار
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="results" className="mt-4">
            <div className="space-y-6">
              {currentResult && (
                <Card className="bg-primary-50 border-primary-200">
                  <CardHeader>
                    <CardTitle className="text-right">نتيجة آخر اختبار</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="space-y-1">
                        <div className="text-3xl font-bold">
                          {currentResult.correctAnswers}/{currentResult.totalQuestions}
                        </div>
                        <div className="text-sm text-muted-foreground">الإجابات الصحيحة</div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-3xl font-bold">
                          {Math.round((currentResult.correctAnswers / currentResult.totalQuestions) * 100)}%
                        </div>
                        <div className="text-sm text-muted-foreground">نسبة النجاح</div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-3xl font-bold">
                          {formatTime(currentResult.timeTaken)}
                        </div>
                        <div className="text-sm text-muted-foreground">الوقت المستغرق</div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-3xl font-bold">
                          {Object.keys(currentResult.categories).length}
                        </div>
                        <div className="text-sm text-muted-foreground">الفئات</div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium mb-2 text-right">التفاصيل حسب الفئة</h4>
                      <div className="space-y-2">
                        {Object.entries(currentResult.categories).map(([cat, stats]) => (
                          <div key={cat} className="flex justify-between items-center">
                            <div className="font-medium">{cat}</div>
                            <div className="text-right">
                              {stats.correct}/{stats.total} ({Math.round((stats.correct / stats.total) * 100)}%)
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-center space-x-2 mt-6">
                      <Button onClick={shareResults} variant="outline">
                        <Share2 className="mr-2 h-4 w-4" />
                        مشاركة
                      </Button>
                      <Button onClick={() => startQuiz()}>
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        إعادة الاختبار
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-right">سجل الاختبارات السابقة</h3>
                
                {results.length === 0 ? (
                  <div className="text-center py-12 bg-muted rounded-lg">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">لا توجد اختبارات سابقة</h3>
                    <p className="text-muted-foreground mt-2">
                      ابدأ أول اختبار لك وتتبع تقدمك
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {results.map((result, index) => (
                      <Card key={index} className="overflow-hidden">
                        <div className="p-4 flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <div>
                              <div className="font-medium">
                                {Math.round((result.correctAnswers / result.totalQuestions) * 100)}%
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(result.date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div>
                              {result.correctAnswers}/{result.totalQuestions} صحيحة
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {formatTime(result.timeTaken)}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
                
                {results.length > 0 && (
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      تصدير السجل
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-center border-t p-4">
        <div className="flex items-center space-x-2">
          <Award className="h-4 w-4 text-primary" />
          <p className="text-sm text-muted-foreground">
            أكمل الاختبارات لكسب الإنجازات وتتبع تقدمك في المعرفة الإسلامية
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default IslamicKnowledgeQuiz;
