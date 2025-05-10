/**
 * GuestUserPrompt.tsx
 * 
 * Component for guest users to either continue browsing as guest or register
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, UserPlus, Eye } from 'lucide-react';

interface GuestUserPromptProps {
  isGuest: boolean;
  onContinueAsGuest: () => void;
  onRegister: () => void;
}

export const GuestUserPrompt: React.FC<GuestUserPromptProps> = ({
  isGuest,
  onContinueAsGuest,
  onRegister
}) => {
  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">
          {isGuest ? 'أنت تتصفح كزائر' : 'أهلاً بك في سبيل'}
        </CardTitle>
        <CardDescription>
          {isGuest 
            ? 'يمكنك الاستمرار كزائر مع إمكانيات محدودة، أو يمكنك التسجيل للحصول على تجربة كاملة'
            : 'يرجى تسجيل الدخول أو إنشاء حساب، أو يمكنك المتابعة كزائر'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-amber-50 p-4 border border-amber-200">
          <h3 className="text-lg font-medium text-amber-800 mb-2 text-right">مميزات إنشاء حساب:</h3>
          <ul className="list-disc list-inside space-y-2 text-amber-700 text-right">
            <li>حفظ المحتوى المفضل والرجوع إليه لاحقًا</li>
            <li>متابعة تقدمك في تعلم واستكشاف المعارف الإسلامية</li>
            <li>كسب نقاط وإنجازات للأنشطة التي تقوم بها</li>
            <li>المشاركة في المناقشات والتفاعل مع المجتمع</li>
            <li>تخصيص تجربتك وتفضيلاتك على المنصة</li>
          </ul>
        </div>
        
        <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
          <h3 className="text-lg font-medium text-blue-800 mb-2 text-right">في سبيل، خصوصيتك محمية:</h3>
          <ul className="list-disc list-inside space-y-2 text-blue-700 text-right">
            <li>يمكنك استخدام اسم مستعار (لقب) بدلاً من اسمك الحقيقي</li>
            <li>تحكم كامل في خصوصية ملفك الشخصي وما يظهر للآخرين</li>
            <li>نحن لا نشارك بياناتك مع أي طرف ثالث</li>
            <li>يمكنك حذف حسابك وبياناتك في أي وقت</li>
          </ul>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          variant="default" 
          className="w-full sm:w-auto"
          onClick={onRegister}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          {isGuest ? 'إنشاء حساب كامل' : 'إنشاء حساب'}
        </Button>
        
        {!isGuest && (
          <Button 
            variant="outline" 
            className="w-full sm:w-auto"
            onClick={onContinueAsGuest}
          >
            <Eye className="mr-2 h-4 w-4" />
            متابعة كزائر
          </Button>
        )}
        
        {!isGuest && (
          <Button 
            variant="secondary" 
            className="w-full sm:w-auto"
            onClick={() => window.location.href = '/login'}
          >
            <User className="mr-2 h-4 w-4" />
            تسجيل الدخول
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
