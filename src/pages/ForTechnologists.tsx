
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Code, Laptop, PenTool, Share2, Zap, Lock } from 'lucide-react';

const ForTechnologists = () => {
  const opportunities = [
    {
      icon: <Code className="w-8 h-8 text-sabeel-primary" />,
      title: "تطوير البرمجيات",
      description: "بناء تطبيقات وأدوات تقنية تخدم المحتوى الإسلامي والمسلمين في شتى المجالات"
    },
    {
      icon: <Laptop className="w-8 h-8 text-sabeel-primary" />,
      title: "الذكاء الاصطناعي",
      description: "العمل على نماذج ذكاء اصطناعي متوافقة مع القيم والمبادئ الإسلامية"
    },
    {
      icon: <PenTool className="w-8 h-8 text-sabeel-primary" />,
      title: "التصميم والتجربة",
      description: "تصميم واجهات وتجارب مستخدم متميزة للمشاريع الدعوية والتعليمية"
    },
    {
      icon: <Share2 className="w-8 h-8 text-sabeel-primary" />,
      title: "التعاون العلمي",
      description: "العمل مع العلماء والدعاة لفهم احتياجاتهم وتقديم حلول تقنية مناسبة"
    },
    {
      icon: <Zap className="w-8 h-8 text-sabeel-primary" />,
      title: "البحث والتطوير",
      description: "المشاركة في أبحاث ومشاريع تقنية مبتكرة تخدم المجتمع الإسلامي"
    },
    {
      icon: <Lock className="w-8 h-8 text-sabeel-primary" />,
      title: "الأمن والخصوصية",
      description: "تطوير حلول للحفاظ على أمن وخصوصية البيانات الإسلامية والشخصية"
    },
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-sabeel-secondary text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">للمتخصصين التقنيين</h1>
            <p className="text-xl mb-8">
              وظف مهاراتك التقنية في خدمة قضايا الأمة، وساهم في بناء مستقبل أفضل من خلال التقنية الهادفة
            </p>
            <Button className="bg-white text-sabeel-secondary hover:bg-gray-100 text-lg px-6 py-3">
              استكشف الفرص
            </Button>
          </div>
        </div>
      </section>

      {/* Opportunities Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-sabeel-primary">مجالات المساهمة</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              هناك العديد من المجالات التي يمكن للمتخصصين التقنيين المساهمة فيها ضمن مشروع سبيل
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {opportunities.map((opportunity, index) => (
              <div 
                key={index}
                className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="mb-4">
                  {opportunity.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-sabeel-secondary dark:text-white">{opportunity.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{opportunity.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 bg-sabeel-light dark:bg-gray-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-sabeel-primary">مشاريع قيد التطوير</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              بعض المشاريع التي نعمل عليها حاليًا ويمكنك المساهمة فيها
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-3 text-sabeel-secondary dark:text-white">مساعد الذاكرة للعلماء</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                نظام ذكاء اصطناعي يساعد العلماء والدعاة في تنظيم وأرشفة علمهم وربط الأفكار المتناثرة في مؤلفاتهم.
              </p>
              <div className="flex justify-end">
                <Button variant="outline" className="border-sabeel-primary text-sabeel-primary hover:bg-sabeel-primary hover:text-white">
                  تفاصيل المشروع
                </Button>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-3 text-sabeel-secondary dark:text-white">نظام كشف المحتوى المزيف</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                أداة للكشف عن المحتوى المزيف والمقاطع المولدة بالذكاء الاصطناعي التي قد تسيء للإسلام والمسلمين.
              </p>
              <div className="flex justify-end">
                <Button variant="outline" className="border-sabeel-primary text-sabeel-primary hover:bg-sabeel-primary hover:text-white">
                  تفاصيل المشروع
                </Button>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-3 text-sabeel-secondary dark:text-white">منصة ترجمة المحتوى الإسلامي</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                منصة لترجمة المحتوى الإسلامي إلى لغات متعددة مع مراعاة الدقة في المصطلحات الشرعية.
              </p>
              <div className="flex justify-end">
                <Button variant="outline" className="border-sabeel-primary text-sabeel-primary hover:bg-sabeel-primary hover:text-white">
                  تفاصيل المشروع
                </Button>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-3 text-sabeel-secondary dark:text-white">أداة فاروق للفتاوى</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                نظام للتحقق من صحة الفتاوى المنتشرة على الإنترنت ومقارنتها بالمصادر الموثوقة.
              </p>
              <div className="flex justify-end">
                <Button variant="outline" className="border-sabeel-primary text-sabeel-primary hover:bg-sabeel-primary hover:text-white">
                  تفاصيل المشروع
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-sabeel-primary text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">
              انضم إلى فريق المطورين
            </h2>
            
            <p className="text-lg mb-8">
              سواء كنت مطورًا، مصممًا، متخصصًا في الذكاء الاصطناعي، أو لديك مهارات تقنية أخرى، يمكنك المساهمة في مشروع سبيل
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-white text-sabeel-primary hover:bg-gray-100 text-lg px-6 py-3">
                <Link to="/join-team">انضم إلى الفريق</Link>
              </Button>
              
              <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-sabeel-primary text-lg px-6 py-3">
                <Link to="/github">استعرض المشاريع على GitHub</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ForTechnologists;
