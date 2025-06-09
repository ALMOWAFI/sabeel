/**
 * SupabaseUserProfile.tsx
 * 
 * User profile component backed by Supabase for storing and managing user data
 * Migrated from AppwriteUserProfile.tsx
 */

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { User, Pencil, Save, Globe, Moon, Sun, Bell, Shield, BookOpen } from "lucide-react";

// Import Supabase client
import supabase from '@/lib/supabaseConfig';

const SupabaseUserProfile = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    institute: '',
    specialty: '',
    preferences: {
      language: 'ar',
      theme: 'light',
      uiDirection: 'rtl',
      notifications: true,
      accessibility: {
        highContrast: false,
        largeText: false
      }
    }
  });
  
  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        // Get current user from Supabase
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          throw error;
        }
        
        if (user) {
          // Get user profile from the profiles table
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (profileError && profileError.code !== 'PGRST116') {
            // PGRST116 is the error code for "no rows returned"
            throw profileError;
          }
          
          const userData = {
            id: user.id,
            name: user.user_metadata?.name || '',
            email: user.email || '',
            institute: profileData?.institute || '',
            specialty: profileData?.specialty || '',
            preferences: profileData?.preferences || {
              language: 'ar',
              theme: 'light',
              uiDirection: 'rtl',
              notifications: true,
              accessibility: {
                highContrast: false,
                largeText: false
              }
            }
          };
          
          setUser(userData);
          setFormData({
            name: userData.name,
            email: userData.email,
            institute: userData.institute,
            specialty: userData.specialty,
            preferences: userData.preferences
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        toast({
          variant: "destructive",
          title: "خطأ في تحميل البيانات",
          description: "تعذر تحميل بيانات المستخدم. يرجى المحاولة مرة أخرى."
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [toast]);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle preference changes
  const handlePreferenceChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };
  
  // Handle accessibility preference changes
  const handleAccessibilityChange = (key: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        accessibility: {
          ...prev.preferences.accessibility,
          [key]: value
        }
      }
    }));
  };
  
  // Save user data
  const saveUserData = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { name: formData.name }
      });
      
      if (updateError) {
        throw updateError;
      }
      
      // Update profile in the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          institute: formData.institute,
          specialty: formData.specialty,
          preferences: formData.preferences,
          updated_at: new Date()
        });
        
      if (profileError) {
        throw profileError;
      }
      
      // Update user object
      setUser({
        ...user,
        name: formData.name,
        institute: formData.institute,
        specialty: formData.specialty,
        preferences: formData.preferences
      });
      
      // Apply preferences to the app
      if (formData.preferences.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      document.documentElement.dir = formData.preferences.uiDirection;
      
      // Save preferences to local storage
      localStorage.setItem('sabeelPreferences', JSON.stringify(formData.preferences));
      
      setEditMode(false);
      toast({
        title: "تم الحفظ",
        description: "تم حفظ التغييرات بنجاح"
      });
    } catch (error) {
      console.error('Error saving user data:', error);
      toast({
        variant: "destructive",
        title: "خطأ في الحفظ",
        description: "تعذر حفظ البيانات. يرجى المحاولة مرة أخرى."
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Sign out
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        variant: "destructive",
        title: "خطأ في تسجيل الخروج",
        description: "تعذر تسجيل الخروج. يرجى المحاولة مرة أخرى."
      });
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-right">الملف الشخصي</CardTitle>
            <CardDescription className="text-right">
              يجب تسجيل الدخول لعرض الملف الشخصي
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-6">
            <Button onClick={() => window.location.href = '/login'}>
              تسجيل الدخول
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <Button 
              variant={editMode ? "secondary" : "outline"} 
              size="sm"
              onClick={() => setEditMode(!editMode)}
              disabled={saving}
            >
              {editMode ? (
                <>حفظ التغييرات <Save className="mr-2 h-4 w-4" /></>
              ) : (
                <>تعديل <Pencil className="mr-2 h-4 w-4" /></>
              )}
            </Button>
            <div className="text-right">
              <CardTitle className="text-right">الملف الشخصي</CardTitle>
              <CardDescription className="text-right">
                إدارة معلوماتك الشخصية وتفضيلاتك
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3 flex flex-col items-center">
              <Avatar className="h-32 w-32 mb-4">
                <AvatarImage src="" />
                <AvatarFallback className="text-4xl bg-sabeel-primary text-white">
                  {formData.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold">{formData.name}</h3>
                <p className="text-gray-500">{formData.email}</p>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mb-2"
                onClick={handleSignOut}
              >
                تسجيل الخروج
              </Button>
            </div>
            
            <div className="md:w-2/3">
              <Tabs defaultValue="personal">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="personal" className="text-right flex justify-center">
                    <User className="mr-2 h-4 w-4" />
                    معلومات شخصية
                  </TabsTrigger>
                  <TabsTrigger value="preferences" className="text-right flex justify-center">
                    <Settings className="mr-2 h-4 w-4" />
                    التفضيلات
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="text-right flex justify-center">
                    <BookOpen className="mr-2 h-4 w-4" />
                    النشاط العلمي
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="personal" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-right block mb-1">الاسم</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!editMode || saving}
                        className="text-right"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email" className="text-right block mb-1">البريد الإلكتروني</Label>
                      <Input
                        id="email"
                        name="email"
                        value={formData.email}
                        disabled={true}
                        className="text-right"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="institute" className="text-right block mb-1">المؤسسة</Label>
                      <Input
                        id="institute"
                        name="institute"
                        value={formData.institute}
                        onChange={handleInputChange}
                        disabled={!editMode || saving}
                        className="text-right"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="specialty" className="text-right block mb-1">التخصص</Label>
                      <Input
                        id="specialty"
                        name="specialty"
                        value={formData.specialty}
                        onChange={handleInputChange}
                        disabled={!editMode || saving}
                        className="text-right"
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="preferences" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Switch
                          id="language"
                          checked={formData.preferences.language === 'ar'}
                          onCheckedChange={(checked) => 
                            handlePreferenceChange('language', checked ? 'ar' : 'en')
                          }
                          disabled={!editMode || saving}
                        />
                      </div>
                      <div className="flex items-center">
                        <Globe className="mr-2 h-4 w-4" />
                        <Label htmlFor="language" className="text-right">اللغة العربية</Label>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Switch
                          id="theme"
                          checked={formData.preferences.theme === 'dark'}
                          onCheckedChange={(checked) => 
                            handlePreferenceChange('theme', checked ? 'dark' : 'light')
                          }
                          disabled={!editMode || saving}
                        />
                      </div>
                      <div className="flex items-center">
                        {formData.preferences.theme === 'dark' ? (
                          <Moon className="mr-2 h-4 w-4" />
                        ) : (
                          <Sun className="mr-2 h-4 w-4" />
                        )}
                        <Label htmlFor="theme" className="text-right">الوضع الداكن</Label>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Switch
                          id="direction"
                          checked={formData.preferences.uiDirection === 'rtl'}
                          onCheckedChange={(checked) => 
                            handlePreferenceChange('uiDirection', checked ? 'rtl' : 'ltr')
                          }
                          disabled={!editMode || saving}
                        />
                      </div>
                      <div className="flex items-center">
                        <Label htmlFor="direction" className="text-right">اتجاه من اليمين إلى اليسار</Label>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Switch
                          id="notifications"
                          checked={formData.preferences.notifications}
                          onCheckedChange={(checked) => 
                            handlePreferenceChange('notifications', checked)
                          }
                          disabled={!editMode || saving}
                        />
                      </div>
                      <div className="flex items-center">
                        <Bell className="mr-2 h-4 w-4" />
                        <Label htmlFor="notifications" className="text-right">الإشعارات</Label>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h4 className="text-sm font-semibold mb-4 text-right">إعدادات إمكانية الوصول</h4>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Switch
                              id="highContrast"
                              checked={formData.preferences.accessibility.highContrast}
                              onCheckedChange={(checked) => 
                                handleAccessibilityChange('highContrast', checked)
                              }
                              disabled={!editMode || saving}
                            />
                          </div>
                          <div className="flex items-center">
                            <Shield className="mr-2 h-4 w-4" />
                            <Label htmlFor="highContrast" className="text-right">تباين عالي</Label>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Switch
                              id="largeText"
                              checked={formData.preferences.accessibility.largeText}
                              onCheckedChange={(checked) => 
                                handleAccessibilityChange('largeText', checked)
                              }
                              disabled={!editMode || saving}
                            />
                          </div>
                          <div className="flex items-center">
                            <Label htmlFor="largeText" className="text-right">نص كبير</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="activity" className="space-y-4">
                  <div className="text-center py-8">
                    <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium mb-2">سيتم إضافة سجل النشاط قريباً</h3>
                    <p className="text-gray-500">
                      نعمل على تطوير سجل النشاط العلمي. ستتمكن قريباً من تتبع نشاطك العلمي ومشاركاتك.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
        {editMode && (
          <CardFooter className="flex justify-end">
            <Button 
              onClick={() => setEditMode(false)} 
              variant="outline" 
              className="ml-2"
              disabled={saving}
            >
              إلغاء
            </Button>
            <Button 
              onClick={saveUserData} 
              disabled={saving}
            >
              {saving ? <Spinner className="mr-2" /> : null}
              حفظ التغييرات
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

// Missing component import fix
const Settings = (props: any) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
};

export default SupabaseUserProfile;
