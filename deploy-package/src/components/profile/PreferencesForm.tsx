/**
 * PreferencesForm.tsx
 * 
 * Component for user preferences including language, theme, and accessibility options
 * specifically tailored for Islamic content consumption
 */

import React, { useState } from 'react';
import { UserData } from '@/services/AppwriteAuthBridge';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Save, Sun, Moon, Globe, Bell, BookOpen, BookOpenCheck } from 'lucide-react';

interface PreferencesFormProps {
  user: UserData;
  onSubmit: (data: Partial<UserData>) => Promise<void>;
  isLoading: boolean;
}

export const PreferencesForm: React.FC<PreferencesFormProps> = ({
  user,
  onSubmit,
  isLoading
}) => {
  const [formData, setFormData] = useState({
    language: user.preferences?.language || 'ar',
    theme: user.preferences?.theme || 'light',
    uiDirection: user.preferences?.uiDirection || 'rtl',
    notifications: user.preferences?.notifications !== false,
    highContrast: user.preferences?.accessibility?.highContrast || false,
    largeText: user.preferences?.accessibility?.largeText || false,
    showArabicVowels: user.metadata?.showArabicVowels !== false,
    showTranslation: user.metadata?.showTranslation !== false,
    showTransliteration: user.metadata?.showTransliteration || false,
    preferredScriptType: user.metadata?.preferredScriptType || 'uthmani',
    preferredTranslation: user.metadata?.preferredTranslation || 'saheeh',
  });
  
  const handleChange = (name: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare data for submission
    const updatedData: Partial<UserData> = {
      preferences: {
        ...user.preferences,
        language: formData.language,
        theme: formData.theme,
        uiDirection: formData.uiDirection,
        notifications: formData.notifications,
        accessibility: {
          highContrast: formData.highContrast,
          largeText: formData.largeText
        }
      },
      metadata: {
        ...user.metadata,
        showArabicVowels: formData.showArabicVowels,
        showTranslation: formData.showTranslation,
        showTransliteration: formData.showTransliteration,
        preferredScriptType: formData.preferredScriptType,
        preferredTranslation: formData.preferredTranslation
      }
    };
    
    await onSubmit(updatedData);
  };
  
  const applyTheme = (theme: string) => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-right">الإعدادات العامة</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Globe className="h-4 w-4 ml-2" />
                <div className="space-y-0.5">
                  <Label className="text-right block">اللغة</Label>
                  <p className="text-sm text-muted-foreground text-right">لغة واجهة المستخدم</p>
                </div>
              </div>
              <Select
                value={formData.language}
                onValueChange={(value) => handleChange('language', value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="اختر اللغة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="tr">Türkçe</SelectItem>
                  <SelectItem value="ur">اردو</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 space-x-reverse">
                {formData.theme === 'dark' ? 
                  <Moon className="h-4 w-4 ml-2" /> : 
                  <Sun className="h-4 w-4 ml-2" />
                }
                <div className="space-y-0.5">
                  <Label className="text-right block">المظهر</Label>
                  <p className="text-sm text-muted-foreground text-right">سمة واجهة المستخدم</p>
                </div>
              </div>
              <RadioGroup
                value={formData.theme}
                onValueChange={(value) => {
                  handleChange('theme', value);
                  applyTheme(value);
                }}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light">فاتح</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark">داكن</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 space-x-reverse">
                <BookOpen className="h-4 w-4 ml-2" />
                <div className="space-y-0.5">
                  <Label className="text-right block">اتجاه النص</Label>
                  <p className="text-sm text-muted-foreground text-right">اتجاه عرض واجهة المستخدم</p>
                </div>
              </div>
              <RadioGroup
                value={formData.uiDirection}
                onValueChange={(value) => handleChange('uiDirection', value as 'rtl' | 'ltr')}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rtl" id="rtl" />
                  <Label htmlFor="rtl">RTL</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ltr" id="ltr" />
                  <Label htmlFor="ltr">LTR</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Bell className="h-4 w-4 ml-2" />
                <div className="space-y-0.5">
                  <Label className="text-right block">الإشعارات</Label>
                  <p className="text-sm text-muted-foreground text-right">تفعيل إشعارات النظام</p>
                </div>
              </div>
              <Switch
                checked={formData.notifications}
                onCheckedChange={(checked) => handleChange('notifications', checked)}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-right mb-4">إمكانية الوصول</h3>
            
            <div className="flex justify-between items-center">
              <Label htmlFor="highContrast" className="text-right">تباين عالي</Label>
              <Switch
                id="highContrast"
                checked={formData.highContrast}
                onCheckedChange={(checked) => handleChange('highContrast', checked)}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <Label htmlFor="largeText" className="text-right">نص كبير</Label>
              <Switch
                id="largeText"
                checked={formData.largeText}
                onCheckedChange={(checked) => handleChange('largeText', checked)}
              />
            </div>
          </div>
        </div>
      </div>
      
      <Separator className="my-6" />
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-right">تفضيلات المحتوى الإسلامي</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="showArabicVowels" className="text-right">إظهار تشكيل النص العربي</Label>
              <Switch
                id="showArabicVowels"
                checked={formData.showArabicVowels}
                onCheckedChange={(checked) => handleChange('showArabicVowels', checked)}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <Label htmlFor="showTranslation" className="text-right">إظهار الترجمة</Label>
              <Switch
                id="showTranslation"
                checked={formData.showTranslation}
                onCheckedChange={(checked) => handleChange('showTranslation', checked)}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <Label htmlFor="showTransliteration" className="text-right">إظهار النطق (Transliteration)</Label>
              <Switch
                id="showTransliteration"
                checked={formData.showTransliteration}
                onCheckedChange={(checked) => handleChange('showTransliteration', checked)}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-right block">نوع الخط العربي</Label>
              <Select
                value={formData.preferredScriptType}
                onValueChange={(value) => handleChange('preferredScriptType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الخط" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uthmani">عثماني (النص المصحفي)</SelectItem>
                  <SelectItem value="indopak">إندوباكستاني</SelectItem>
                  <SelectItem value="modern">حديث (عادي)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-right block">الترجمة المفضلة</Label>
              <Select
                value={formData.preferredTranslation}
                onValueChange={(value) => handleChange('preferredTranslation', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الترجمة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="saheeh">صحيح انترناشونال (English)</SelectItem>
                  <SelectItem value="khattab">خطاب (د. مصطفى خطاب)</SelectItem>
                  <SelectItem value="hilali">هلالي وخان (The Noble Quran)</SelectItem>
                  <SelectItem value="pickthall">محمد مارمادوك بيكثال</SelectItem>
                  <SelectItem value="yusufali">يوسف علي</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner className="mr-2" />
              جاري الحفظ...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              حفظ التفضيلات
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
