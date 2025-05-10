/**
 * SabeelUserProfile.tsx
 * 
 * Enhanced user profile component for Sabeel platform with nickname support,
 * achievement display, and Islamic content preferences
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";
import appwriteAuthBridge, { UserData } from '@/services/AppwriteAuthBridge';
import { PersonalInfoForm } from './PersonalInfoForm';
import { PreferencesForm } from './PreferencesForm';
import { AchievementsDisplay } from './AchievementsDisplay';
import { GuestUserPrompt } from './GuestUserPrompt';
import appwriteConfig from '@/lib/appwriteConfig';

// Import icons
import { User, Settings, Award, BookOpen } from 'lucide-react';

const SabeelUserProfile: React.FC = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  
  // Load user data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const userData = await appwriteAuthBridge.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          variant: "destructive",
          title: "خطأ في تحميل البيانات",
          description: "تعذر تحميل بيانات المستخدم. يرجى المحاولة مرة أخرى."
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [toast]);
  
  // Update user profile
  const handleUpdateProfile = async (updatedData: Partial<UserData>) => {
    if (!user) return;
    
    setSaveLoading(true);
    try {
      const updatedUser = await appwriteAuthBridge.updateUserProfile(updatedData);
      if (updatedUser) {
        setUser(updatedUser);
        toast({
          title: "تم الحفظ",
          description: "تم تحديث ملفك الشخصي بنجاح",
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "خطأ في الحفظ",
        description: "تعذر حفظ التغييرات. يرجى المحاولة مرة أخرى."
      });
    } finally {
      setSaveLoading(false);
    }
  };
  
  // Create guest session
  const handleCreateGuestSession = async () => {
    setLoading(true);
    try {
      const guestUser = await appwriteAuthBridge.createGuestSession();
      setUser(guestUser);
      toast({
        title: "تم إنشاء حساب زائر",
        description: "يمكنك الآن تصفح المحتوى كزائر. قم بالتسجيل للحصول على تجربة كاملة."
      });
    } catch (error) {
      console.error('Error creating guest session:', error);
      toast({
        variant: "destructive",
        title: "خطأ في إنشاء حساب زائر",
        description: "تعذر إنشاء حساب زائر. يرجى المحاولة مرة أخرى."
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle registration from guest account
  const handleRegisterFromGuest = () => {
    // Navigate to register page with guest flag
    window.location.href = '/register?from=guest';
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }
  
  // Show guest prompt if no user or user is guest
  if (!user || user.isGuest) {
    return (
      <GuestUserPrompt 
        isGuest={!!user?.isGuest} 
        onContinueAsGuest={handleCreateGuestSession}
        onRegister={handleRegisterFromGuest}
      />
    );
  }
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-right text-2xl">{user.displayName || user.name} - {user.isGuest ? 'زائر' : 'الملف الشخصي'}</CardTitle>
        <CardDescription className="text-right">
          إدارة ملفك الشخصي وتفضيلاتك وإنجازاتك
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="personal" dir="rtl">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal" className="flex gap-2 items-center">
              <User className="h-4 w-4" />
              <span>المعلومات الشخصية</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex gap-2 items-center">
              <Settings className="h-4 w-4" />
              <span>التفضيلات</span>
            </TabsTrigger>
            {appwriteConfig.enableAchievements && (
              <TabsTrigger value="achievements" className="flex gap-2 items-center">
                <Award className="h-4 w-4" />
                <span>الإنجازات</span>
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="personal" className="mt-4">
            <PersonalInfoForm 
              user={user} 
              onSubmit={handleUpdateProfile}
              isLoading={saveLoading}
            />
          </TabsContent>
          
          <TabsContent value="preferences" className="mt-4">
            <PreferencesForm
              user={user}
              onSubmit={handleUpdateProfile}
              isLoading={saveLoading}
            />
          </TabsContent>
          
          {appwriteConfig.enableAchievements && (
            <TabsContent value="achievements" className="mt-4">
              <AchievementsDisplay userId={user.userId} />
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          <span>مستوى {user.level || 1}</span>
          <span>•</span>
          <span>{user.credits || 0} نقطة</span>
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => window.location.href = '/dashboard'}
        >
          العودة للوحة التحكم
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SabeelUserProfile;
