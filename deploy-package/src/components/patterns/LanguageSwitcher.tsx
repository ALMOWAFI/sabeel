import React from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Languages } from "lucide-react";

interface LanguageSwitcherProps {
  compact?: boolean;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ compact = false }) => {
  const { toast } = useToast();
  
  // Get stored language preference
  const storedPrefs = localStorage.getItem('sabeelPreferences');
  const savedPrefs = storedPrefs ? JSON.parse(storedPrefs) : {};
  const [currentLanguage, setCurrentLanguage] = React.useState<string>(
    savedPrefs.language || 'arabic'
  );
  
  const languages = [
    { code: 'arabic', name: 'العربية', dir: 'rtl' },
    { code: 'english', name: 'English', dir: 'ltr' },
    { code: 'french', name: 'Français', dir: 'ltr' },
    { code: 'urdu', name: 'اردو', dir: 'rtl' },
    { code: 'indonesian', name: 'Bahasa Indonesia', dir: 'ltr' },
  ];
  
  const handleLanguageChange = (langCode: string) => {
    setCurrentLanguage(langCode);
    
    // Get current preferences
    const preferences = localStorage.getItem('sabeelPreferences') 
      ? JSON.parse(localStorage.getItem('sabeelPreferences') || '{}')
      : {};
    
    // Find the language details
    const selectedLang = languages.find(lang => lang.code === langCode);
    
    if (selectedLang) {
      // Update preferences
      const updatedPreferences = {
        ...preferences,
        language: langCode,
        uiDirection: selectedLang.dir
      };
      
      // Save to localStorage
      localStorage.setItem('sabeelPreferences', JSON.stringify(updatedPreferences));
      
      // Apply direction immediately
      document.documentElement.dir = selectedLang.dir;
      
      // Show confirmation
      toast({
        title: selectedLang.dir === 'rtl' ? "تم تغيير اللغة" : "Language changed",
        description: selectedLang.dir === 'rtl' 
          ? `تم تغيير اللغة إلى ${selectedLang.name}` 
          : `Language changed to ${selectedLang.name}`
      });
      
      // Reload page to apply language changes
      setTimeout(() => window.location.reload(), 1000);
    }
  };
  
  const currentLangDetails = languages.find(lang => lang.code === currentLanguage) || languages[0];
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={compact ? "icon" : "default"}>
          <Languages className={compact ? "h-4 w-4" : "h-4 w-4 mr-2"} />
          {!compact && (
            <span>{currentLangDetails.name}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={currentLanguage === lang.code ? "bg-muted" : ""}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
