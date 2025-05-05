
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Lock, Shield, FileText, Calendar, ChartBar } from 'lucide-react';

const Members = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  const handlePasswordCheck = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if password ends with 101
    if (password.endsWith('101')) {
      setIsAuthenticated(true);
      toast({
        title: "تم الدخول بنجاح",
        description: "مرحباً بك في منطقة الأعضاء الخاصة",
        variant: "default",
      });
    } else {
      toast({
        title: "خطأ في كلمة المرور",
        description: "كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-20 px-4">
        {!isAuthenticated ? (
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-sabeel-primary mb-2">منطقة الأعضاء</h1>
              <p className="text-gray-600 dark:text-gray-300">
                هذه المنطقة مخصصة للأعضاء العاملين فقط
              </p>
            </div>

            <form onSubmit={handlePasswordCheck} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  كلمة المرور
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="أدخل كلمة المرور الخاصة بك"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              
              <Button type="submit" className="w-full bg-sabeel-primary hover:bg-sabeel-secondary text-white">
                الدخول
              </Button>
            </form>
          </div>
        ) : (
          <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <img 
                src="/lovable-uploads/a5fcac1b-54eb-4860-bfd4-5ec4efa83444.png" 
                alt="Prime Logo" 
                className="h-32 mx-auto mb-4"
              />
              <div className="flex items-center justify-center">
                <div className="h-1 w-24 bg-sabeel-accent"></div>
                <h1 className="text-3xl font-bold text-sabeel-primary mx-4">مرحباً بك في المنطقة الخاصة</h1>
                <div className="h-1 w-24 bg-sabeel-accent"></div>
              </div>
              
              <div className="mt-4 bg-gradient-to-r from-sabeel-accent to-sabeel-primary text-white px-4 py-2 rounded-full inline-block">
                عضوية بريميوم
              </div>
            </div>

            <div className="prose max-w-none dark:prose-invert">
              <h2 className="text-xl font-semibold text-sabeel-secondary mb-4 flex items-center">
                <Shield className="mr-2" size={20} /> موارد للأعضاء العاملين
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <FileText className="text-sabeel-primary mr-2" size={24} />
                    <h3 className="text-lg font-medium mb-0">دليل العمل</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">تعرف على إجراءات وسياسات العمل في مشروع سبيل</p>
                  <Button variant="outline" className="w-full border-sabeel-primary text-sabeel-primary hover:bg-sabeel-primary hover:text-white">تحميل الدليل</Button>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <Lock className="text-sabeel-primary mr-2" size={24} />
                    <h3 className="text-lg font-medium mb-0">أدوات التطوير</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">أحدث الأدوات والمكتبات المستخدمة في المشروع</p>
                  <Button variant="outline" className="w-full border-sabeel-primary text-sabeel-primary hover:bg-sabeel-primary hover:text-white">استعراض الأدوات</Button>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <Calendar className="text-sabeel-primary mr-2" size={24} />
                    <h3 className="text-lg font-medium mb-0">جدول الاجتماعات</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">تواريخ ومواعيد الاجتماعات الدورية والخاصة</p>
                  <Button variant="outline" className="w-full border-sabeel-primary text-sabeel-primary hover:bg-sabeel-primary hover:text-white">عرض الجدول</Button>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <ChartBar className="text-sabeel-primary mr-2" size={24} />
                    <h3 className="text-lg font-medium mb-0">تقارير المشروع</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">آخر التقارير والإحصائيات حول تقدم المشروع</p>
                  <Button variant="outline" className="w-full border-sabeel-primary text-sabeel-primary hover:bg-sabeel-primary hover:text-white">عرض التقارير</Button>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-6 rounded-lg border-l-4 border-sabeel-primary">
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <Shield className="mr-2" size={20} /> ملاحظة هامة
                </h3>
                <p>
                  جميع المعلومات والموارد المتاحة في هذه الصفحة سرية وخاصة بأعضاء فريق سبيل فقط. يرجى عدم مشاركتها مع أي شخص خارج الفريق.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Members;
