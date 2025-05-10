
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FileText, Video, Book, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Resources = () => {
  const articles = [
    {
      title: "فهم الذكاء الاصطناعي للمشايخ والدعاة",
      description: "مقدمة عامة حول تقنيات الذكاء الاصطناعي وكيفية استفادة العلماء منها",
      type: "مقال",
      icon: <FileText className="w-5 h-5" />
    },
    {
      title: "الضوابط الشرعية لاستخدام الذكاء الاصطناعي في الفتوى",
      description: "دراسة حول الحدود والضوابط الشرعية لاستخدام التقنيات الحديثة",
      type: "بحث",
      icon: <Book className="w-5 h-5" />
    },
    {
      title: "كيفية استخدام ChatGPT في إعداد الخطب والدروس",
      description: "دليل عملي لاستخدام نماذج الذكاء الاصطناعي في تحضير المحتوى الدعوي",
      type: "دليل",
      icon: <FileText className="w-5 h-5" />
    },
    {
      title: "أخلاقيات استخدام التقنية في العمل الإسلامي",
      description: "مقال حول القيم والمبادئ التي يجب مراعاتها عند استخدام التقنية",
      type: "مقال",
      icon: <FileText className="w-5 h-5" />
    },
  ];

  const videos = [
    {
      title: "مقدمة عن مشروع سبيل",
      description: "شرح تفصيلي لأهداف المشروع ورؤيته وآلية العمل",
      duration: "15:24",
      thumbnail: "/video-thumbnail-1.jpg"
    },
    {
      title: "الذكاء الاصطناعي: فهم أساسي للدعاة",
      description: "شرح مبسط لمفاهيم الذكاء الاصطناعي للمشايخ والدعاة",
      duration: "22:10",
      thumbnail: "/video-thumbnail-2.jpg"
    },
    {
      title: "كيف تستخدم الأدوات التقنية في الدعوة؟",
      description: "دليل عملي لاستخدام التقنيات الحديثة في نشر العلم",
      duration: "18:36",
      thumbnail: "/video-thumbnail-3.jpg"
    },
  ];

  const tools = [
    {
      title: "مساعد الذاكرة للعلماء",
      description: "أداة لمساعدة العلماء في تنظيم وأرشفة علمهم وربط الأفكار",
      status: "تحت التطوير"
    },
    {
      title: "منصة فاروق للتحقق من الفتاوى",
      description: "أداة للتحقق من صحة الفتاوى المنتشرة على الإنترنت",
      status: "قريبًا"
    },
    {
      title: "مولد المحتوى الدعوي",
      description: "أداة لتوليد محتوى دعوي متوافق مع الضوابط الشرعية",
      status: "متاح للتجربة"
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-sabeel-primary text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-6">الموارد</h1>
              <p className="text-xl mb-6">
                مقالات، فيديوهات، أدوات، وموارد أخرى لفهم التقنية وتوظيفها في خدمة الإسلام
              </p>
            </div>
          </div>
        </section>

        {/* Articles Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-sabeel-primary">مقالات وأبحاث</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                مجموعة من المقالات والأبحاث حول التقنية والذكاء الاصطناعي وعلاقتهما بالعلوم الشرعية والدعوة
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {articles.map((article, index) => (
                <div 
                  key={index}
                  className="bg-sabeel-light dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-sabeel-primary/10 text-sabeel-primary px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      {article.icon} {article.type}
                    </span>
                    <Button variant="ghost" size="sm" className="text-sabeel-primary">
                      <Download className="w-4 h-4 mr-1" /> تحميل
                    </Button>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 text-sabeel-secondary dark:text-white">{article.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{article.description}</p>
                  
                  <div className="flex justify-end">
                    <Button variant="outline" className="border-sabeel-primary text-sabeel-primary hover:bg-sabeel-primary hover:text-white">
                      قراءة المزيد
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button className="bg-sabeel-primary hover:bg-sabeel-secondary text-white">
                عرض جميع المقالات
              </Button>
            </div>
          </div>
        </section>

        {/* Videos Section */}
        <section className="py-16 bg-sabeel-light dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-sabeel-primary">فيديوهات تعليمية</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                سلسلة من الفيديوهات التعليمية حول استخدام التقنية في العمل الإسلامي
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {videos.map((video, index) => (
                <div 
                  key={index}
                  className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="h-48 bg-gray-300 dark:bg-gray-700 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Video className="w-16 h-16 text-white opacity-80" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2 text-sabeel-secondary dark:text-white">{video.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{video.description}</p>
                    
                    <Button className="w-full bg-sabeel-primary hover:bg-sabeel-secondary text-white">
                      مشاهدة
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button className="bg-sabeel-primary hover:bg-sabeel-secondary text-white">
                عرض جميع الفيديوهات
              </Button>
            </div>
          </div>
        </section>

        {/* Tools Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-sabeel-primary">أدواتنا</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                مجموعة من الأدوات التقنية التي نطورها لخدمة العمل الإسلامي
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {tools.map((tool, index) => (
                <div 
                  key={index}
                  className="bg-sabeel-light dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-sabeel-secondary dark:text-white">{tool.title}</h3>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      tool.status === "متاح للتجربة" 
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                    }`}>
                      {tool.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{tool.description}</p>
                  
                  <Button className="w-full bg-sabeel-primary hover:bg-sabeel-secondary text-white">
                    استكشاف
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* External Resources */}
        <section className="py-16 bg-sabeel-light dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-sabeel-primary">موارد خارجية</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                مجموعة من الموارد الخارجية المفيدة في مجال التقنية والعمل الإسلامي
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 max-w-3xl mx-auto">
              <ul className="space-y-4">
                <li className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-sabeel-secondary dark:text-white">دليل استخدام الذكاء الاصطناعي للدعاة</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">مجموعة إرشادات للدعاة حول استخدام أدوات الذكاء الاصطناعي</p>
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center gap-1 border-sabeel-primary text-sabeel-primary hover:bg-sabeel-primary hover:text-white">
                    <ExternalLink className="w-4 h-4" /> زيارة
                  </Button>
                </li>
                
                <li className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-sabeel-secondary dark:text-white">موسوعة العلوم الشرعية الرقمية</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">مكتبة رقمية شاملة للعلوم الشرعية مع أدوات بحث متقدمة</p>
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center gap-1 border-sabeel-primary text-sabeel-primary hover:bg-sabeel-primary hover:text-white">
                    <ExternalLink className="w-4 h-4" /> زيارة
                  </Button>
                </li>
                
                <li className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-sabeel-secondary dark:text-white">منصة تعليم البرمجة للمسلمين</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">دروس وموارد لتعليم البرمجة والتطوير للشباب المسلم</p>
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center gap-1 border-sabeel-primary text-sabeel-primary hover:bg-sabeel-primary hover:text-white">
                    <ExternalLink className="w-4 h-4" /> زيارة
                  </Button>
                </li>
                
                <li className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-sabeel-secondary dark:text-white">مبادرات التقنية الإسلامية</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">قائمة بالمبادرات والمشاريع التقنية الإسلامية حول العالم</p>
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center gap-1 border-sabeel-primary text-sabeel-primary hover:bg-sabeel-primary hover:text-white">
                    <ExternalLink className="w-4 h-4" /> زيارة
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Resources;
