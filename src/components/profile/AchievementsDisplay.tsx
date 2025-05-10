/**
 * AchievementsDisplay.tsx
 * 
 * Component to display user achievements and progress in the Sabeel platform
 * Focuses on Islamic knowledge exploration achievements
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import appwriteAuthBridge, { Achievement } from '@/services/AppwriteAuthBridge';
import { Award, Star, BookOpen, Heart, Users, Trophy } from 'lucide-react';

interface AchievementsDisplayProps {
  userId: string;
}

// Interface for achievement progress data
interface AchievementProgress {
  totalCredits: number;
  level: number;
  nextLevelCredits: number;
  recentAchievements: Achievement[];
}

export const AchievementsDisplay: React.FC<AchievementsDisplayProps> = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<AchievementProgress | null>(null);
  const [filter, setFilter] = useState<'all' | 'learning' | 'contribution' | 'engagement' | 'special'>('all');
  
  useEffect(() => {
    const fetchAchievements = async () => {
      setLoading(true);
      try {
        const progressData = await appwriteAuthBridge.getAchievementProgress(userId);
        setProgress(progressData);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAchievements();
  }, [userId]);
  
  // Filter achievements based on selected category
  const getFilteredAchievements = () => {
    if (!progress) return [];
    
    if (filter === 'all') {
      return progress.recentAchievements;
    }
    
    return progress.recentAchievements.filter(achievement => achievement.category === filter);
  };
  
  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'learning':
        return <BookOpen className="h-4 w-4" />;
      case 'contribution':
        return <Heart className="h-4 w-4" />;
      case 'engagement':
        return <Users className="h-4 w-4" />;
      case 'special':
        return <Star className="h-4 w-4" />;
      default:
        return <Award className="h-4 w-4" />;
    }
  };
  
  // Calculate progress percentage
  const getProgressPercentage = () => {
    if (!progress) return 0;
    
    const { totalCredits, level, nextLevelCredits } = progress;
    const previousLevelCredits = (level - 1) * 100;
    const currentLevelCredits = totalCredits - previousLevelCredits;
    
    return Math.min(100, (currentLevelCredits / 100) * 100);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (!progress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-right">الإنجازات</CardTitle>
          <CardDescription className="text-right">
            تعذر تحميل الإنجازات. يرجى المحاولة مرة أخرى.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center justify-end">
            <Trophy className="h-5 w-5 ml-2" />
            <span>مستوى {progress.level}</span>
          </CardTitle>
          <CardDescription className="text-right">
            {progress.totalCredits} نقطة من أصل {progress.nextLevelCredits} للمستوى التالي
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={getProgressPercentage()} className="h-2" />
          
          <div className="mt-4 text-right">
            <p className="text-sm text-muted-foreground">
              اكمل المهام وشارك المحتوى لكسب المزيد من النقاط والوصول للمستوى التالي
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-right">الإنجازات الأخيرة</CardTitle>
          <CardDescription className="text-right">
            إنجازاتك في منصة سبيل للمعرفة الإسلامية
          </CardDescription>
          
          <Tabs defaultValue="all" dir="rtl" className="mt-4">
            <TabsList className="grid grid-cols-5">
              <TabsTrigger value="all" onClick={() => setFilter('all')}>
                الكل
              </TabsTrigger>
              <TabsTrigger value="learning" onClick={() => setFilter('learning')}>
                <BookOpen className="h-4 w-4 ml-1" />
                التعلم
              </TabsTrigger>
              <TabsTrigger value="contribution" onClick={() => setFilter('contribution')}>
                <Heart className="h-4 w-4 ml-1" />
                المساهمة
              </TabsTrigger>
              <TabsTrigger value="engagement" onClick={() => setFilter('engagement')}>
                <Users className="h-4 w-4 ml-1" />
                المشاركة
              </TabsTrigger>
              <TabsTrigger value="special" onClick={() => setFilter('special')}>
                <Star className="h-4 w-4 ml-1" />
                خاص
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent>
          {getFilteredAchievements().length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-muted rounded-full mx-auto flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                لم تحصل على إنجازات في هذه الفئة بعد
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                استكشف المزيد من المحتوى وتفاعل مع منصة سبيل لكسب الإنجازات
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getFilteredAchievements().map((achievement) => (
                <Card key={achievement.id} className="overflow-hidden">
                  <div className="flex">
                    <div 
                      className="w-1 h-full" 
                      style={{ 
                        backgroundColor: achievement.category === 'learning' ? '#4CAF50' :
                                         achievement.category === 'contribution' ? '#E91E63' :
                                         achievement.category === 'engagement' ? '#2196F3' : '#FFC107' 
                      }} 
                    />
                    <div className="p-4 flex items-start space-x-4 space-x-reverse rtl:space-x-reverse">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {getCategoryIcon(achievement.category)}
                      </div>
                      
                      <div className="space-y-1 text-right">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">
                            {achievement.points} نقطة
                          </Badge>
                          <h4 className="font-semibold">
                            {achievement.nameArabic || achievement.name}
                          </h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {achievement.descriptionArabic || achievement.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(achievement.dateEarned).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="mt-6 text-center">
        <h3 className="font-semibold mb-2">إنجازات قادمة</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <Card className="bg-muted/40">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-muted-foreground" />
              </div>
              <h4 className="font-medium">باحث القرآن</h4>
              <p className="text-sm text-muted-foreground mt-2">
                اقرأ 10 سور كاملة من القرآن الكريم
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/40">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
              <h4 className="font-medium">المساهم النشط</h4>
              <p className="text-sm text-muted-foreground mt-2">
                شارك في 5 مناقشات مع أعضاء المجتمع
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/40">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-muted-foreground" />
              </div>
              <h4 className="font-medium">ناشر المعرفة</h4>
              <p className="text-sm text-muted-foreground mt-2">
                شارك محتوى مفيداً في منصة سبيل
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
