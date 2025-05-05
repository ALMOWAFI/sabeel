
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { BookOpen, Presentation, MessageSquare, Database, Users, Globe, Brain } from 'lucide-react';

const ForScholars = () => {
  const benefits = [
    {
      icon: <BookOpen className="w-8 h-8 text-sabeel-primary" />,
      title: "تعزيز المنهج والبحث",
      description: "أدوات ذكاء اصطناعي مدربة على المصادر الشرعية الصحيحة لمساعدتكم في البحث وتطوير المحتوى"
    },
    {
      icon: <Presentation className="w-8 h-8 text-sabeel-primary" />,
      title: "تحسين الخطاب الدعوي",
      description: "تقنيات لتطوير طرق العرض وإيصال المعلومة بأساليب حديثة مع الحفاظ على الأصالة"
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-sabeel-primary" />,
      title: "التواصل الفعال",
      description: "منصات للتواصل مع جمهور أوسع عبر مختلف القنوات الرقمية"
    },
    {
      icon: <Database className="w-8 h-8 text-sabeel-primary" />,
      title: "أرشفة العلم",
      description: "حفظ وتوثيق الدروس والمحاضرات بطرق منظمة وسهلة الوصول"
    },
    {
      icon: <Users className="w-8 h-8 text-sabeel-primary" />,
      title: "التعاون مع التقنيين",
      description: "ربط المشايخ والدعاة بمتخصصين تقنيين لدعم مشاريعهم الدعوية"
    },
    {
      icon: <Globe className="w-8 h-8 text-sabeel-primary" />,
      title: "الوصول العالمي",
      description: "أدوات للترجمة والتكيف الثقافي لنشر المحتوى عالميًا"
    },
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-sabeel-primary text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">للمشايخ والدعاة</h1>
            <p className="text-xl mb-8">
              تمكين العلماء والدعاة بأدوات الذكاء الاصطناعي والتقنيات الحديثة لنشر العلم الشرعي ومواكبة تحديات العصر
            </p>
            <Button className="bg-white text-sabeel-primary hover:bg-gray-100 text-lg px-6 py-3">
              تعرف على خدماتنا
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-sabeel-primary">كيف يمكن أن نساعدكم؟</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              نوفر للمشايخ والدعاة مجموعة من الأدوات والخدمات التقنية لتعزيز جهودهم الدعوية
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-sabeel-secondary dark:text-white">{benefit.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section className="py-16 bg-sabeel-light dark:bg-gray-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-sabeel-primary">قصة نجاح</h2>
            
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-full md:w-1/3 bg-gray-200 h-40 rounded-lg flex items-center justify-center">
                  <Brain className="w-16 h-16 text-sabeel-primary" />
                </div>
                
                <div className="w-full md:w-2/3">
                  <h3 className="text-xl font-semibold mb-3 text-sabeel-secondary dark:text-white">الشيخ أحمد والمساعد التقني للخطب</h3>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    كان الشيخ أحمد يقضي ساعات طويلة في تحضير الخطب ومراجعة المصادر، وكان يجد صعوبة في الوصول إلى جمهور أوسع.
                  </p>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    بعد انضمامه لمشروع سبيل، تم تطوير مساعد ذكي خاص به، يساعده في البحث وتنظيم الأفكار، ومنصة رقمية لنشر خطبه عالميًا.
                  </p>
                  
                  <p className="text-gray-700 dark:text-gray-300 font-semibold">
                    النتيجة: تضاعف جمهوره 5 مرات، وانخفض وقت التحضير بنسبة 40٪، مع زيادة جودة المحتوى.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-sabeel-secondary text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">
              انضم إلينا لتحقيق رسالتك بطرق مبتكرة
            </h2>
            
            <p className="text-lg mb-8">
              سواء كنت تحتاج إلى الدعم التقني، أو الإرشاد في استخدام أدوات الذكاء الاصطناعي، أو التعاون مع مطورين لبناء حلول خاصة، نحن هنا لمساعدتك
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-white text-sabeel-primary hover:bg-gray-100 text-lg px-6 py-3">
                <Link to="/contact">تواصل معنا</Link>
              </Button>
              
              <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-sabeel-primary text-lg px-6 py-3">
                <Link to="/resources">استكشف الموارد</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ForScholars;
