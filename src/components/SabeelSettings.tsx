import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Save, Settings as SettingsIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { UserPreferencesService, UserPreferences } from "@/services/UserPreferencesService";

interface SabeelSettingsProps {
  onClose: () => void;
}

const SabeelSettings: React.FC<SabeelSettingsProps> = ({ onClose }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>({
    madhab: 'any',
    language: 'ar',
    useSourceCitations: true,
    autoTranslate: false,
    uiDirection: 'rtl',
    theme: 'light'
  });

  // Get the UserPreferencesService instance
  const preferencesService = UserPreferencesService.getInstance();

  // Load saved preferences on component mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        setLoading(true);
        
        // Use the service to get preferences
        const userPrefs = await preferencesService.getPreferences();
        
        // Update the component state with the loaded preferences
        setPreferences({
          madhab: userPrefs.content.madhab,
          language: userPrefs.language,
          useSourceCitations: userPrefs.useSourceCitations,
          autoTranslate: userPrefs.autoTranslate,
          uiDirection: userPrefs.uiDirection,
          theme: userPrefs.theme
        });
      } catch (error) {
        console.error('Error loading preferences:', error);
        toast({
          variant: "destructive",
          title: "خطأ في تحميل التفضيلات",
          description: "لم نتمكن من تحميل إعداداتك. تم استخدام الإعدادات الافتراضية."
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadPreferences();
  }, [toast]);
  
  // Handle preference changes
  const handleChange = (field: keyof typeof preferences, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Save preferences
  const savePreferences = async () => {
    try {
      setSaving(true);
      
      // Use the service to save preferences
      await preferencesService.savePreferences({
        language: preferences.language as string,
        theme: preferences.theme as 'light' | 'dark' | 'system',
        uiDirection: preferences.uiDirection as 'ltr' | 'rtl',
        useSourceCitations: preferences.useSourceCitations as boolean,
        autoTranslate: preferences.autoTranslate as boolean,
        content: {
          madhab: preferences.madhab as 'hanafi' | 'shafi' | 'maliki' | 'hanbali' | 'any'
        }
      });
      
      // Apply the changes immediately
      preferencesService.applyTheme();
      preferencesService.applyLanguage();
      
      toast({
        title: "تم حفظ التفضيلات",
        description: "تم حفظ إعداداتك بنجاح وسيتم تطبيقها على جميع استخداماتك القادمة."
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        variant: "destructive",
        title: "خطأ في حفظ التفضيلات",
        description: "حدث خطأ أثناء حفظ التفضيلات. يرجى المحاولة مرة أخرى."
      });
    } finally {
      setSaving(false);
      // Close settings after saving
      setTimeout(onClose, 1000);
    }
  };
  
  if (loading) {
    return (
      <Card className="w-[85%] max-w-md mx-auto">
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px]">
          <Spinner className="h-8 w-8 mb-4" />
          <p className="text-center text-muted-foreground">جاري تحميل التفضيلات...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-[85%] max-w-md mx-auto">
      <CardHeader className="bg-sabeel-primary text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <SettingsIcon className="h-5 w-5" />
          <CardTitle>إعدادات سبيل</CardTitle>
        </div>
        <CardDescription className="text-gray-100">
          تخصيص تجربتك مع مساعد سبيل
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Theme Selection */}
        <div className="space-y-3">
          <Label className="text-base font-medium">المظهر</Label>
          <RadioGroup
            value={preferences.theme as string}
            onValueChange={(value) => handleChange('theme', value)}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2 space-x-reverse">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light">فاتح</Label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark">داكن</Label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system">حسب إعدادات النظام</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Madhab Selection */}
        <div className="space-y-3">
          <Label htmlFor="madhab-select" className="text-base font-medium">
            المذهب المفضل
          </Label>
          <Select
            value={preferences.madhab as string}
            onValueChange={(value) => handleChange('madhab', value)}
          >
            <SelectTrigger id="madhab-select">
              <SelectValue placeholder="اختر المذهب المفضل" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">جميع المذاهب</SelectItem>
              <SelectItem value="hanafi">المذهب الحنفي</SelectItem>
              <SelectItem value="maliki">المذهب المالكي</SelectItem>
              <SelectItem value="shafi">المذهب الشافعي</SelectItem>
              <SelectItem value="hanbali">المذهب الحنبلي</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            يتم استخدام هذا الإعداد لتوجيه الإجابات وفقاً للمذهب المفضل لديك، مع احترام الآراء المتعددة.
          </p>
        </div>
        
        {/* Language Selection */}
        <div className="space-y-3">
          <Label className="text-base font-medium">لغة التفاعل المفضلة</Label>
          <RadioGroup
            value={preferences.language as string}
            onValueChange={(value) => handleChange('language', value)}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2 space-x-reverse">
              <RadioGroupItem value="ar" id="arabic" />
              <Label htmlFor="arabic">العربية</Label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <RadioGroupItem value="en" id="english" />
              <Label htmlFor="english">الإنجليزية</Label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <RadioGroupItem value="fr" id="french" />
              <Label htmlFor="french">الفرنسية</Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Source Citations */}
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="source-citations" className="text-base font-medium">
              عرض المصادر والاقتباسات
            </Label>
            <p className="text-sm text-muted-foreground">
              إظهار المصادر والمراجع مع كل إجابة
            </p>
          </div>
          <Switch 
            id="source-citations"
            checked={preferences.useSourceCitations as boolean}
            onCheckedChange={(checked) => handleChange('useSourceCitations', checked)}
          />
        </div>
        
        {/* Auto Translate */}
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="auto-translate" className="text-base font-medium">
              ترجمة تلقائية للمصطلحات
            </Label>
            <p className="text-sm text-muted-foreground">
              ترجمة المصطلحات الإسلامية المعقدة تلقائياً
            </p>
          </div>
          <Switch 
            id="auto-translate"
            checked={preferences.autoTranslate as boolean}
            onCheckedChange={(checked) => handleChange('autoTranslate', checked)}
          />
        </div>
        
        {/* UI Direction */}
        <div className="space-y-3">
          <Label className="text-base font-medium">اتجاه واجهة المستخدم</Label>
          <RadioGroup
            value={preferences.uiDirection as string}
            onValueChange={(value: 'rtl' | 'ltr') => handleChange('uiDirection', value)}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2 space-x-reverse">
              <RadioGroupItem value="rtl" id="rtl" />
              <Label htmlFor="rtl">من اليمين إلى اليسار (العربية)</Label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <RadioGroupItem value="ltr" id="ltr" />
              <Label htmlFor="ltr">من اليسار إلى اليمين (الإنجليزية)</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t p-4">
        <Button variant="outline" onClick={onClose}>
          إلغاء
        </Button>
        <Button 
          onClick={savePreferences}
          className="bg-sabeel-primary hover:bg-sabeel-secondary"
          disabled={saving}
        >
          {saving ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              جاري الحفظ...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              حفظ التفضيلات
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SabeelSettings;
