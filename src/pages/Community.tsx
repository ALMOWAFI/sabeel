
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { MessageSquare, Users, GitHub, BookOpen, Calendar, MessageCircle } from 'lucide-react';

const Community = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-sabeel-accent text-sabeel-dark">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-6">مجتمع سبيل</h1>
              <p className="text-xl mb-6">
                انضم إلى مجتمع من العلماء والمطورين والمهتمين بالتقنية والعمل الإسلامي
              </p>
              <Button className="bg-sabeel-primary hover:bg-sabeel-secondary text-white text-lg px-6 py-3">
                انضم الآن
              </Button>
            </div>
          </div>
        </section>

        {/* Ways to Join */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-sabeel-primary">طرق المشاركة</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                هناك العديد من الطرق للمساهمة في مشروع سبيل، اختر ما يناسب مهاراتك واهتماماتك
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-sabeel-light dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="mb-4">
                  <MessageSquare className="w-10 h-10 text-sabeel-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-sabeel-secondary dark:text-white">منتدى النقاش</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  شارك في النقاشات حول التقنية والإسلام، واطرح أفكارك واقتراحاتك
                </p>
                <Button variant="outline" className="w-full border-sabeel-primary text-sabeel-primary hover:bg-sabeel-primary hover:text-white">
                  انضم للمنتدى
                </Button>
              </div>
              
              <div className="bg-sabeel-light dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="mb-4">
                  <GitHub className="w-10 h-10 text-sabeel-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-sabeel-secondary dark:text-white">مساهمة تقنية</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  ساهم في تطوير المشاريع مفتوحة المصدر، وشارك بمهاراتك البرمجية
                </p>
                <Button variant="outline" className="w-full border-sabeel-primary text-sabeel-primary hover:bg-sabeel-primary hover:text-white">
                  استعرض GitHub
                </Button>
              </div>
              
              <div className="bg-sabeel-light dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="mb-4">
                  <Users className="w-10 h-10 text-sabeel-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-sabeel-secondary dark:text-white">مجموعات العمل</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  انضم إلى إحدى مجموعات العمل المتخصصة وفقًا لاهتماماتك ومهاراتك
                </p>
                <Button variant="outline" className="w-full border-sabeel-primary text-sabeel-primary hover:bg-sabeel-primary hover:text-white">
                  استعرض المجموعات
                </Button>
              </div>
              
              <div className="bg-sabeel-light dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="mb-4">
                  <BookOpen className="w-10 h-10 text-sabeel-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-sabeel-secondary dark:text-white">المحتوى والتوثيق</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  ساهم في إعداد المحتوى التعليمي وتوثيق المشاريع واعداد المقالات
                </p>
                <Button variant="outline" className="w-full border-sabeel-primary text-sabeel-primary hover:bg-sabeel-primary hover:text-white">
                  المساهمة في المحتوى
                </Button>
              </div>
              
              <div className="bg-sabeel-light dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="mb-4">
                  <Calendar className="w-10 h-10 text-sabeel-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-sabeel-secondary dark:text-white">الفعاليات</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  حضور أو تنظيم الفعاليات والورش التدريبية المتعلقة بمشروع سبيل
                </p>
                <Button variant="outline" className="w-full border-sabeel-primary text-sabeel-primary hover:bg-sabeel-primary hover:text-white">
                  استعرض الفعاليات
                </Button>
              </div>
              
              <div className="bg-sabeel-light dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="mb-4">
                  <MessageCircle className="w-10 h-10 text-sabeel-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-sabeel-secondary dark:text-white">الدعم والنشر</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  المساعدة في نشر المشروع والتعريف به، ودعمه بمختلف الطرق المتاحة
                </p>
                <Button variant="outline" className="w-full border-sabeel-primary text-sabeel-primary hover:bg-sabeel-primary hover:text-white">
                  طرق الدعم
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="py-16 bg-sabeel-light dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-sabeel-primary">الفعاليات القادمة</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                شارك في الفعاليات والندوات القادمة للتعرف أكثر على المشروع والمساهمة فيه
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-1 text-sabeel-secondary dark:text-white">ندوة: الذكاء الاصطناعي والعمل الدعوي</h3>
                      <p className="text-gray-500 dark:text-gray-400">١٥ يونيو ٢٠٢٥</p>
                    </div>
                    <span className="bg-sabeel-primary text-white text-sm font-semibold px-3 py-1 rounded-full">عبر الإنترنت</span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    ندوة حوارية تناقش سبل الاستفادة من تقنيات الذكاء الاصطناعي في تطوير العمل الدعوي ونشر العلم الشرعي
                  </p>
                  
                  <Button className="w-full bg-sabeel-primary hover:bg-sabeel-secondary text-white">
                    التسجيل
                  </Button>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-1 text-sabeel-secondary dark:text-white">ورشة عمل: تطوير تطبيقات إسلامية</h3>
                      <p className="text-gray-500 dark:text-gray-400">٢٠ يونيو ٢٠٢٥</p>
                    </div>
                    <span className="bg-sabeel-accent text-sabeel-dark text-sm font-semibold px-3 py-1 rounded-full">حضوري</span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    ورشة عملية للمطورين والمصممين لتعلم كيفية تطوير تطبيقات إسلامية مفيدة باستخدام أحدث التقنيات
                  </p>
                  
                  <Button className="w-full bg-sabeel-primary hover:bg-sabeel-secondary text-white">
                    التسجيل
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Join Form */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4 text-sabeel-primary">انضم إلينا</h2>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  املأ النموذج التالي للانضمام إلى مجتمع سبيل والمشاركة في المشروع
                </p>
              </div>
              
              <div className="bg-sabeel-light dark:bg-gray-800 rounded-lg shadow-md p-8">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الاسم</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sabeel-primary dark:bg-gray-700 dark:text-white" 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">البريد الإلكتروني</label>
                      <input 
                        type="email" 
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sabeel-primary dark:bg-gray-700 dark:text-white" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">مجال الاهتمام</label>
                    <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sabeel-primary dark:bg-gray-700 dark:text-white">
                      <option>البرمجة والتطوير</option>
                      <option>التصميم وتجربة المستخدم</option>
                      <option>الذكاء الاصطناعي</option>
                      <option>المحتوى والتوثيق</option>
                      <option>العلوم الشرعية</option>
                      <option>الدعم والنشر</option>
                      <option>أخرى</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">كيف يمكنك المساهمة؟</label>
                    <textarea 
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sabeel-primary dark:bg-gray-700 dark:text-white" 
                    ></textarea>
                  </div>
                  
                  <div className="text-center">
                    <Button className="bg-sabeel-primary hover:bg-sabeel-secondary text-white px-8 py-2">
                      إرسال
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Community;
