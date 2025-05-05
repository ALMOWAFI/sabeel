
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Presentation, 
  MessageSquare, 
  Database, 
  Users, 
  Globe, 
  Brain, 
  ChevronDown,
  ChevronUp, 
  ArrowRight, 
  ExternalLink 
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const ForScholars = () => {
  const [activeResource, setActiveResource] = useState<string | null>(null);

  const benefits = [
    {
      icon: <BookOpen className="w-10 h-10 text-sabeel-accent" />,
      title: "تعزيز المنهج والبحث",
      description: "أدوات ذكاء اصطناعي مدربة على المصادر الشرعية الصحيحة لمساعدتكم في البحث وتطوير المحتوى"
    },
    {
      icon: <Presentation className="w-10 h-10 text-sabeel-accent" />,
      title: "تحسين الخطاب الدعوي",
      description: "تقنيات لتطوير طرق العرض وإيصال المعلومة بأساليب حديثة مع الحفاظ على الأصالة"
    },
    {
      icon: <MessageSquare className="w-10 h-10 text-sabeel-accent" />,
      title: "التواصل الفعال",
      description: "منصات للتواصل مع جمهور أوسع عبر مختلف القنوات الرقمية"
    },
    {
      icon: <Database className="w-10 h-10 text-sabeel-accent" />,
      title: "أرشفة العلم",
      description: "حفظ وتوثيق الدروس والمحاضرات بطرق منظمة وسهلة الوصول"
    },
    {
      icon: <Users className="w-10 h-10 text-sabeel-accent" />,
      title: "التعاون مع التقنيين",
      description: "ربط المشايخ والدعاة بمتخصصين تقنيين لدعم مشاريعهم الدعوية"
    },
    {
      icon: <Globe className="w-10 h-10 text-sabeel-accent" />,
      title: "الوصول العالمي",
      description: "أدوات للترجمة والتكيف الثقافي لنشر المحتوى عالميًا"
    },
  ];

  const resources = [
    {
      id: "research",
      title: "أدوات البحث والتأليف",
      icon: <BookOpen className="w-6 h-6" />,
      content: [
        {
          name: "محلل النصوص الشرعي",
          description: "أداة لتحليل النصوص وإيجاد الروابط بين المصادر المختلفة",
          link: "#"
        },
        {
          name: "مساعد تحضير الخطب",
          description: "تنظيم وإعداد الخطب مع مراجع من كتب التراث والتفاسير",
          link: "#"
        },
        {
          name: "المكتبة الذكية",
          description: "بحث متقدم في المصادر الشرعية مع إمكانية التلخيص",
          link: "#"
        }
      ]
    },
    {
      id: "media",
      title: "أدوات إنتاج المحتوى",
      icon: <Presentation className="w-6 h-6" />,
      content: [
        {
          name: "منشئ العروض التقديمية",
          description: "تصميم شرائح احترافية للدروس والمحاضرات",
          link: "#"
        },
        {
          name: "محرر الفيديو الشرعي",
          description: "تحرير مقاطع الفيديو مع إضافة مراجع وترجمة",
          link: "#"
        },
        {
          name: "مولد الانفوجرافيك الإسلامي",
          description: "تصميم مخططات معلوماتية بطابع إسلامي",
          link: "#"
        }
      ]
    },
    {
      id: "community",
      title: "منصات التواصل والتعليم",
      icon: <Users className="w-6 h-6" />,
      content: [
        {
          name: "منصة سبيل للتعليم",
          description: "إنشاء وإدارة دورات شرعية عبر الإنترنت",
          link: "#"
        },
        {
          name: "مجتمع المشايخ التقني",
          description: "منصة للتعاون والتواصل مع تقنيين مسلمين",
          link: "#"
        },
        {
          name: "مساعد الإجابات الشرعية",
          description: "أداة مساعدة في الرد على الأسئلة الشرعية",
          link: "#"
        }
      ]
    }
  ];

  const faqs = [
    {
      question: "كيف يمكنني البدء في استخدام أدوات الذكاء الاصطناعي؟",
      answer: "يمكنك البدء من خلال حضور ورشة العمل التمهيدية التي نقدمها للمشايخ والدعاة، والتي تشرح أساسيات التقنية وكيفية استخدامها بطريقة آمنة وفعالة. ثم نساعدك في اختيار الأدوات المناسبة لاحتياجاتك."
    },
    {
      question: "هل هناك ضوابط شرعية لاستخدام أدوات الذكاء الاصطناعي؟",
      answer: "نعم، جميع الأدوات التي نقدمها تخضع لإشراف لجنة علمية، ونوفر دليلًا للضوابط الشرعية في استخدام التقنيات الحديثة. كما نقدم ملف 'نامي' الذي يضمن توافق الأدوات مع المنهج الشرعي."
    },
    {
      question: "هل يمكن للذكاء الاصطناعي أن يحل محل العلماء في الفتوى والتدريس؟",
      answer: "لا، الذكاء الاصطناعي هو أداة مساعدة فقط. الفتوى والتدريس تحتاج إلى فهم عميق وحكمة بشرية لا تتوفر في الآلات. دورنا هو استخدام التقنية لتعزيز دور العلماء وليس استبدالهم."
    },
    {
      question: "كيف يمكنني التعاون مع مطورين لبناء أدوات خاصة بمشروعي الدعوي؟",
      answer: "نوفر منصة تربط بين المشايخ والمطورين المسلمين لتنفيذ مشاريع مشتركة. يمكنك طرح فكرتك على المنصة، وسنساعدك في بناء فريق تقني مناسب ووضع خطة للتنفيذ."
    }
  ];

  const toggleResource = (id: string) => {
    if (activeResource === id) {
      setActiveResource(null);
    } else {
      setActiveResource(id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section - Enhanced with animation and better layout */}
        <section className="relative py-24 bg-gradient-to-br from-sabeel-primary to-sabeel-secondary text-white overflow-hidden">
          <div className="absolute inset-0 bg-geometric-pattern opacity-10"></div>
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block text-sabeel-accent font-arabic text-lg mb-2 animate-fade-in">مشروع سبيل</span>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up font-arabic">للمشايخ والدعاة</h1>
              <p className="text-xl md:text-2xl mb-8 animate-fade-in-up delay-100">
                تمكين العلماء والدعاة بأدوات الذكاء الاصطناعي والتقنيات الحديثة لنشر العلم الشرعي ومواكبة تحديات العصر
              </p>
              <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up delay-200">
                <Button size="lg" className="bg-sabeel-accent hover:bg-sabeel-accent/90 text-sabeel-primary text-lg px-6 py-6">
                  تعرف على خدماتنا
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-6 py-6">
                  انضم للمشروع
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section - Redesigned with cards */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 text-sabeel-primary dark:text-white font-arabic">كيف يمكن لمشروع سبيل أن يساعدكم؟</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                نوفر للمشايخ والدعاة مجموعة من الأدوات والخدمات التقنية المتكاملة لتعزيز جهودهم الدعوية
              </p>
              <div className="h-1 w-24 bg-sabeel-accent mx-auto mt-6"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="bg-white dark:bg-gray-800 border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="bg-sabeel-light/30 dark:bg-gray-700/30 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                      {benefit.icon}
                    </div>
                    <CardTitle className="text-xl font-arabic text-sabeel-primary dark:text-white">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Resources Section - New interactive section with tabs */}
        <section className="py-20 bg-sabeel-light dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-sabeel-primary dark:text-white font-arabic">الموارد المتاحة</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                مجموعة من الأدوات والموارد المصممة خصيصًا لتلبية احتياجات المشايخ والدعاة
              </p>
            </div>

            <Tabs defaultValue="research" className="max-w-4xl mx-auto">
              <TabsList className="grid grid-cols-3 mb-8">
                {resources.map((resource) => (
                  <TabsTrigger 
                    key={resource.id} 
                    value={resource.id}
                    className="flex items-center gap-2 py-3"
                  >
                    {resource.icon}
                    <span className="hidden md:inline">{resource.title}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {resources.map((resource) => (
                <TabsContent key={resource.id} value={resource.id} className="mt-0">
                  <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
                    <h3 className="text-2xl font-bold mb-6 text-center text-sabeel-primary dark:text-white font-arabic">{resource.title}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {resource.content.map((item, i) => (
                        <Card key={i} className="bg-white dark:bg-gray-800 shadow hover:shadow-md transition-shadow">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-arabic text-sabeel-primary">{item.name}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                          </CardContent>
                          <CardFooter>
                            <Button asChild variant="link" className="text-sabeel-primary p-0">
                              <Link to={item.link} className="flex items-center gap-2">
                                استكشاف الأداة <ExternalLink size={14} />
                              </Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Case Study - Enhanced with better visuals */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 text-sabeel-primary dark:text-white font-arabic">قصص نجاح</h2>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  شهادات من مشايخ ودعاة استفادوا من خدمات مشروع سبيل
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-sabeel-light/50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-full md:w-2/5 bg-gradient-to-br from-sabeel-primary/10 to-sabeel-accent/10 h-64 rounded-lg flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-sabeel-primary/20 rounded-full blur-3xl transform -translate-y-4"></div>
                      <Brain className="w-24 h-24 text-sabeel-primary relative z-10" />
                    </div>
                  </div>
                  
                  <div className="w-full md:w-3/5">
                    <h3 className="text-2xl font-semibold mb-4 text-sabeel-secondary dark:text-white font-arabic">الشيخ أحمد والمساعد التقني للخطب</h3>
                    
                    <div className="space-y-4">
                      <p className="text-gray-700 dark:text-gray-300">
                        كان الشيخ أحمد يقضي ساعات طويلة في تحضير الخطب ومراجعة المصادر، وكان يجد صعوبة في الوصول إلى جمهور أوسع.
                      </p>
                      
                      <p className="text-gray-700 dark:text-gray-300">
                        بعد انضمامه لمشروع سبيل، تم تطوير مساعد ذكي خاص به، يساعده في البحث وتنظيم الأفكار، ومنصة رقمية لنشر خطبه عالميًا.
                      </p>
                      
                      <div className="mt-6 p-4 bg-sabeel-primary/10 dark:bg-sabeel-primary/20 rounded-lg border-r-4 border-sabeel-accent">
                        <p className="font-semibold text-sabeel-primary dark:text-sabeel-accent">
                          النتيجة: تضاعف جمهوره 5 مرات، وانخفض وقت التحضير بنسبة 40٪، مع زيادة جودة المحتوى.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section - New accordion section */}
        <section className="py-20 bg-sabeel-light dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 text-sabeel-primary dark:text-white font-arabic">أسئلة شائعة</h2>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  إجابات على الأسئلة الأكثر شيوعًا حول استخدام التقنية في المجال الدعوي
                </p>
              </div>

              <Accordion type="single" collapsible className="bg-white dark:bg-gray-900 rounded-lg shadow-lg">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <AccordionTrigger className="py-5 px-6 text-lg font-arabic text-sabeel-primary dark:text-white hover:no-underline hover:text-sabeel-accent">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-5 text-gray-600 dark:text-gray-300">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Call to Action - Enhanced with better visuals */}
        <section className="py-20 bg-gradient-to-br from-sabeel-primary to-sabeel-secondary text-white">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 font-arabic">
                انضم إلينا لتحقيق رسالتك بطرق مبتكرة
              </h2>
              
              <p className="text-lg mb-8">
                سواء كنت تحتاج إلى الدعم التقني، أو الإرشاد في استخدام أدوات الذكاء الاصطناعي، أو التعاون مع مطورين لبناء حلول خاصة، نحن هنا لمساعدتك
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-12">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">ورش عمل تدريبية</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-white/80">
                    دورات متخصصة لتعلم استخدام التقنيات الحديثة في خدمة العلم الشرعي
                  </CardContent>
                  <CardFooter>
                    <Button variant="secondary" size="sm" className="w-full">
                      سجل الآن
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">استشارات تقنية</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-white/80">
                    جلسات استشارية مع متخصصين لمناقشة احتياجاتك التقنية
                  </CardContent>
                  <CardFooter>
                    <Button variant="secondary" size="sm" className="w-full">
                      احجز جلسة
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">منصة التعاون</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-white/80">
                    تواصل مع مطورين وتقنيين مسلمين للعمل على مشاريعك الدعوية
                  </CardContent>
                  <CardFooter>
                    <Button variant="secondary" size="sm" className="w-full">
                      استكشف المنصة
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="mt-12">
                <Button asChild size="lg" className="bg-sabeel-accent text-sabeel-primary hover:bg-white text-lg px-8 py-6">
                  <Link to="/contact">تواصل معنا</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ForScholars;
