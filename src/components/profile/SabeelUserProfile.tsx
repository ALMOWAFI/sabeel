/**
 * SabeelUserProfile.tsx
 *
 * Enhanced user profile component for Sabeel platform with nickname support,
 * achievement display, and Islamic content preferences
 *
 * Appwrite functionality has been temporarily disabled due to missing AppwriteAuthBridge.
 * Needs to be refactored to use the current primary auth service (e.g., Supabase or a generic AuthService).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";
// import appwriteAuthBridge, { UserData } from '@/services/AppwriteAuthBridge'; // AppwriteAuthBridge is missing
// import appwriteConfig from '@/lib/appwriteConfig'; // AppwriteConfig is missing

import { PersonalInfoForm } from './PersonalInfoForm';
import { PreferencesForm } from './PreferencesForm';
import { AchievementsDisplay } from './AchievementsDisplay';
// import { GuestUserPrompt } from './GuestUserPrompt'; // Temporarily disable complex guest logic

// Import icons
import { User, Settings, Award, BookOpen, AlertTriangle } from 'lucide-react';

// Temporary UserData interface until a proper auth service is integrated
interface UserData {
  userId: string;
  name: string;
  displayName?: string;
  email?: string;
  isGuest?: boolean;
  level?: number;
  credits?: number;
  // Add other fields as needed by PersonalInfoForm, PreferencesForm, AchievementsDisplay if they are used
  [key: string]: any; // Allow other properties
}


const SabeelUserProfile: React.FC = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  // Load user data - Temporarily disabled Appwrite logic
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      // try {
      //   // const userData = await appwriteAuthBridge.getCurrentUser();
      //   // setUser(userData);
      //   // For now, simulate no user or a default state
      //   setUser(null);
      // } catch (error) {
      //   console.error('Error fetching user data:', error);
      //   toast({
      //     variant: "destructive",
      //     title: "خطأ في تحميل البيانات",
      //     description: "تعذر تحميل بيانات المستخدم. يرجى المحاولة مرة أخرى."
      //   });
      // } finally {
      //   setLoading(false);
      // }
      toast({
        title: "خدمة الملف الشخصي قيد الصيانة",
        description: "يتم حاليًا تحديث خدمة الملف الشخصي. بعض الميزات قد تكون غير متوفرة.",
        variant: "default",
      });
      setUser(null); // Simulate no user logged in
      setLoading(false);
    };

    fetchUserData();
  }, [toast]);

  // Update user profile - Temporarily disabled
  const handleUpdateProfile = async (updatedData: Partial<UserData>) => {
    if (!user) return;

    setSaveLoading(true);
    toast({
      title: "ميزة مؤقتا معطلة",
      description: "حفظ تغييرات الملف الشخصي معطل حاليًا.",
      variant: "default"
    });
    setSaveLoading(false);
    // try {
    //   // const updatedUser = await appwriteAuthBridge.updateUserProfile(updatedData);
    //   // if (updatedUser) {
    //   //   setUser(updatedUser);
    //   //   toast({
    //   //     title: "تم الحفظ",
    //   //     description: "تم تحديث ملفك الشخصي بنجاح",
    //   //   });
    //   // }
    // } catch (error) {
    //   console.error('Error updating profile:', error);
    //   toast({
    //     variant: "destructive",
    //     title: "خطأ في الحفظ",
    //     description: "تعذر حفظ التغييرات. يرجى المحاولة مرة أخرى."
    //   });
    // } finally {
    //   setSaveLoading(false);
    // }
  };

  // Create guest session - Temporarily disabled
  const handleCreateGuestSession = async () => {
    setLoading(true);
    toast({
      title: "ميزة مؤقتا معطلة",
      description: "إنشاء حساب زائر معطل حاليًا.",
      variant: "default"
    });
    setLoading(false);
    // try {
    //   // const guestUser = await appwriteAuthBridge.createGuestSession();
    //   // setUser(guestUser);
    //   // toast({
    //   //   title: "تم إنشاء حساب زائر",
    //   //   description: "يمكنك الآن تصفح المحتوى كزائر. قم بالتسجيل للحصول على تجربة كاملة."
    //   // });
    // } catch (error) {
    //   console.error('Error creating guest session:', error);
    //   toast({
    //     variant: "destructive",
    //     title: "خطأ في إنشاء حساب زائر",
    //     description: "تعذر إنشاء حساب زائر. يرجى المحاولة مرة أخرى."
    //   });
    // } finally {
    //   setLoading(false);
    // }
  };

  // Handle registration from guest account - Temporarily disabled
  const handleRegisterFromGuest = () => {
    toast({
      title: "ميزة مؤقتا معطلة",
      description: "التسجيل من حساب زائر معطل حاليًا.",
      variant: "default"
    });
    // window.location.href = '/register?from=guest';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  // Show guest prompt if no user or user is guest - Temporarily simplified
  if (!user) { // Simplified: if no user, show maintenance message
    return (
      <Card className="w-full max-w-md mx-auto mt-10">
        <CardHeader>
          <CardTitle className="flex items-center text-right">
            <AlertTriangle className="ml-2 text-yellow-500" />
            خدمة الملف الشخصي قيد الصيانة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-right">
            نحن نعمل حاليًا على تحديث هذه الميزة. يرجى التحقق مرة أخرى لاحقًا.
            نعتذر عن أي إزعاج.
          </p>
        </CardContent>
        <CardFooter>
            <Button className="w-full" onClick={() => window.history.back()}>العودة</Button>
        </CardFooter>
      </Card>
    );
  }

  // Original profile display (will not be reached if user is always null for now)
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
            {/* Temporarily disable achievements tab as appwriteConfig is commented out */}
            {/* appwriteConfig.enableAchievements && (
              <TabsTrigger value="achievements" className="flex gap-2 items-center">
                <Award className="h-4 w-4" />
                <span>الإنجازات</span>
              </TabsTrigger>
            )*/}
             <TabsTrigger value="achievements" className="flex gap-2 items-center" disabled>
                <Award className="h-4 w-4" />
                <span>الإنجازات (معطلة مؤقتاً)</span>
              </TabsTrigger>
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

          {/* appwriteConfig.enableAchievements && ( */}
            <TabsContent value="achievements" className="mt-4">
              {/* <AchievementsDisplay userId={user.userId} /> */}
              <p className="text-center text-gray-500">ميزة الإنجازات قيد التطوير.</p>
            </TabsContent>
          {/* )} */}
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
