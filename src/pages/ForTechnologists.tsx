
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from 'react-router-dom';
import { 
  Code, 
  Laptop, 
  PenTool, 
  Share2, 
  Zap, 
  Lock, 
  Github,
  MessageSquare,
  ChevronRight,
  Users,
  Brain,
  ExternalLink
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SabeelChatbot from '@/components/SabeelChatbot';

const formSchema = z.object({
  name: z.string().min(2, { message: "الاسم قصير جدا" }),
  email: z.string().email({ message: "البريد الإلكتروني غير صحيح" }),
  skills: z.string().min(10, { message: "يرجى وصف مهاراتك بشكل أفضل" }),
  interest: z.string().min(10, { message: "يرجى وصف اهتماماتك بشكل أفضل" })
});

const ForTechnologists = () => {
  const [activeTab, setActiveTab] = useState("opportunities");
  const [showChatbot, setShowChatbot] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      skills: "",
      interest: ""
    }
  });

  const onSubmit = (data) => {
    console.log(data);
    // Here you would typically send the data to a backend
    alert("تم إرسال طلب الانضمام بنجاح! سنتواصل معك قريبا.");
    form.reset();
  };

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

  const projects = [
    {
      title: "مساعد الذاكرة للعلماء",
      description: "نظام ذكاء اصطناعي يساعد العلماء والدعاة في تنظيم وأرشفة علمهم وربط الأفكار المتناثرة في مؤلفاتهم.",
      icon: <Brain className="w-10 h-10 text-sabeel-accent" />,
      skills: ["ذكاء اصطناعي", "معالجة اللغة الطبيعية", "تطوير ويب"],
      status: "قيد التطوير"
    },
    {
      title: "نظام كشف المحتوى المزيف",
      description: "أداة للكشف عن المحتوى المزيف والمقاطع المولدة بالذكاء الاصطناعي التي قد تسيء للإسلام والمسلمين.",
      icon: <Lock className="w-10 h-10 text-sabeel-accent" />,
      skills: ["تعلم الآلة", "معالجة الصور", "تحليل النص"],
      status: "مرحلة التخطيط"
    },
    {
      title: "منصة ترجمة المحتوى الإسلامي",
      description: "منصة لترجمة المحتوى الإسلامي إلى لغات متعددة مع مراعاة الدقة في المصطلحات الشرعية.",
      icon: <Share2 className="w-10 h-10 text-sabeel-accent" />,
      skills: ["ترجمة آلية", "تطوير ويب", "قواعد بيانات"],
      status: "مرحلة البحث"
    },
    {
      title: "أداة فاروق للفتاوى",
      description: "نظام للتحقق من صحة الفتاوى المنتشرة على الإنترنت ومقارنتها بالمصادر الموثوقة.",
      icon: <Zap className="w-10 h-10 text-sabeel-accent" />,
      skills: ["معالجة اللغة العربية", "تحليل البيانات", "تصميم واجهات"],
      status: "قيد التطوير"
    }
  ];

  const teams = [
    {
      name: "فريق التطوير",
      description: "مطورون يعملون على بناء التطبيقات والأدوات التقنية",
      members: 24,
      openPositions: 5,
      icon: <Code className="w-8 h-8" />
    },
    {
      name: "فريق الذكاء الاصطناعي",
      description: "متخصصون في تدريب النماذج وتطوير الحلول الذكية",
      members: 18,
      openPositions: 8,
      icon: <Brain className="w-8 h-8" />
    },
    {
      name: "فريق تجربة المستخدم",
      description: "مصممون ومطورو واجهات يركزون على سهولة الاستخدام",
      members: 15,
      openPositions: 3,
      icon: <PenTool className="w-8 h-8" />
    },
    {
      name: "فريق التعاون مع العلماء",
      description: "فريق وسيط بين المتخصصين التقنيين والعلماء والدعاة",
      members: 12,
      openPositions: 7,
      icon: <Users className="w-8 h-8" />
    }
  ];

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-sabeel-primary to-sabeel-secondary text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-6">للمتخصصين التقنيين</h1>
              <p className="text-xl mb-8">
                وظف مهاراتك التقنية في خدمة قضايا الأمة، وساهم في بناء مستقبل أفضل من خلال التقنية الهادفة
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button className="bg-white text-sabeel-secondary hover:bg-gray-100 text-lg px-6 py-3">
                  استكشف الفرص
                </Button>
                <Button onClick={toggleChatbot} variant="outline" className="border-white text-white hover:bg-white hover:text-sabeel-primary text-lg px-6 py-3">
                  تحدث مع المساعد <MessageSquare className="mr-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className="py-8 bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-4 md:px-6">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 gap-2 max-w-2xl mx-auto">
                <TabsTrigger value="opportunities">الفرص المتاحة</TabsTrigger>
                <TabsTrigger value="projects">المشاريع</TabsTrigger>
                <TabsTrigger value="teams">فرق العمل</TabsTrigger>
                <TabsTrigger value="join">انضم إلينا</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </section>

        {/* Opportunities Section */}
        <TabsContent value="opportunities" className={`${activeTab === "opportunities" ? "block" : "hidden"} py-16 bg-white dark:bg-gray-900`}>
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
                  className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 hover:border-sabeel-primary hover:border-2 border-2 border-transparent"
                >
                  <div className="mb-4 bg-sabeel-secondary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center">
                    {opportunity.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-sabeel-secondary dark:text-white">{opportunity.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{opportunity.description}</p>
                  <Button variant="link" className="text-sabeel-primary p-0 flex items-center">
                    اقرأ المزيد <ChevronRight className="h-4 w-4 mr-1" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Projects Section */}
        <TabsContent value="projects" className={`${activeTab === "projects" ? "block" : "hidden"} py-16 bg-sabeel-light dark:bg-gray-800`}>
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-sabeel-primary">مشاريع قيد التطوير</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                بعض المشاريع التي نعمل عليها حاليًا ويمكنك المساهمة فيها
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project, index) => (
                <Card key={index} className="bg-white dark:bg-gray-900 border-none shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="bg-sabeel-light/50 dark:bg-gray-700/50 p-3 rounded-full w-16 h-16 flex items-center justify-center">
                        {project.icon}
                      </div>
                      <span className="bg-sabeel-accent/20 text-sabeel-accent text-sm py-1 px-3 rounded-full">
                        {project.status}
                      </span>
                    </div>
                    <CardTitle className="text-xl font-semibold text-sabeel-secondary dark:text-white">
                      {project.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-4">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {project.skills.map((skill, i) => (
                        <span key={i} className="bg-sabeel-primary/10 text-sabeel-primary text-xs py-1 px-2 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" className="border-sabeel-primary text-sabeel-primary">
                      تفاصيل المشروع
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-sabeel-primary">المساهمة</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>المساهمة في مشروع {project.title}</DialogTitle>
                          <DialogDescription>
                            أخبرنا كيف يمكنك المساهمة في هذا المشروع وسنتواصل معك قريبًا
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-1 gap-2">
                            <Input placeholder="اسمك" className="text-right" />
                            <Input placeholder="بريدك الإلكتروني" type="email" className="text-right" />
                            <Textarea placeholder="كيف يمكنك المساهمة في هذا المشروع؟" className="text-right" />
                          </div>
                          <Button type="submit" className="bg-sabeel-primary">إرسال</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button className="bg-sabeel-primary hover:bg-sabeel-primary/90">عرض المزيد من المشاريع</Button>
            </div>
          </div>
        </TabsContent>

        {/* Teams Section */}
        <TabsContent value="teams" className={`${activeTab === "teams" ? "block" : "hidden"} py-16 bg-white dark:bg-gray-900`}>
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-sabeel-primary">فرق العمل</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                تعرف على فرق العمل المختلفة في مشروع سبيل وانضم للفريق المناسب لمهاراتك
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {teams.map((team, index) => (
                <Card key={index} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="bg-sabeel-light p-3 rounded-full">
                        {team.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl text-sabeel-primary">{team.name}</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400 mt-1">
                          {team.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {team.members} عضو
                      </div>
                      <div className="flex items-center text-sabeel-accent">
                        <PenTool className="h-4 w-4 mr-1" />
                        {team.openPositions} فرص متاحة
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <Button className="w-full bg-sabeel-primary text-white">التفاصيل والانضمام</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div className="mt-12 p-6 bg-sabeel-light/30 dark:bg-gray-800/30 rounded-lg shadow-sm max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-sabeel-primary mb-4 text-center">لديك مهارات خاصة؟</h3>
              <p className="text-center mb-6">
                إذا كانت لديك مهارات قد تفيد المشروع وليس لها فريق محدد، يمكنك التواصل معنا مباشرة
              </p>
              <div className="text-center">
                <Button asChild className="bg-sabeel-primary hover:bg-sabeel-primary/90">
                  <Link to="/contact">تواصل معنا</Link>
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Join Us Form Section */}
        <TabsContent value="join" className={`${activeTab === "join" ? "block" : "hidden"} py-16 bg-sabeel-light dark:bg-gray-800`}>
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 md:p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4 text-sabeel-primary">انضم إلى فريق المطورين</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  أخبرنا عن نفسك ومهاراتك وكيف ترغب في المساهمة في مشروع سبيل
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الاسم الكامل</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="اكتب اسمك الكامل" className="text-right" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>البريد الإلكتروني</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="example@mail.com" className="text-right" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>مهاراتك التقنية</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field}
                            placeholder="اذكر مهاراتك وخبراتك في مجال التقنية" 
                            className="min-h-[100px] text-right"
                          />
                        </FormControl>
                        <FormDescription>
                          اذكر لغات البرمجة، الأطر، والتقنيات التي تتقنها
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="interest"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>مجالات اهتمامك</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field}
                            placeholder="كيف ترغب في المساهمة ضمن مشروع سبيل؟" 
                            className="min-h-[100px] text-right"
                          />
                        </FormControl>
                        <FormDescription>
                          اذكر المجالات التي ترغب في المساهمة فيها والمشاريع التي تهتم بها
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-4">
                    <Button type="submit" className="w-full bg-sabeel-primary hover:bg-sabeel-primary/90 py-6">
                      إرسال طلب الانضمام
                    </Button>
                  </div>
                </form>
              </Form>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-sabeel-primary">مصادر للمطورين</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a href="#" className="flex items-center gap-2 p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 text-gray-700 dark:text-gray-300">
                    <Github className="h-5 w-5" />
                    <span>مستودع GitHub</span>
                    <ExternalLink className="h-3 w-3 mr-auto" />
                  </a>
                  <a href="#" className="flex items-center gap-2 p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 text-gray-700 dark:text-gray-300">
                    <Code className="h-5 w-5" />
                    <span>توثيق API</span>
                    <ExternalLink className="h-3 w-3 mr-auto" />
                  </a>
                  <a href="#" className="flex items-center gap-2 p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 text-gray-700 dark:text-gray-300">
                    <MessageSquare className="h-5 w-5" />
                    <span>منتدى المطورين</span>
                    <ExternalLink className="h-3 w-3 mr-auto" />
                  </a>
                  <a href="#" className="flex items-center gap-2 p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 text-gray-700 dark:text-gray-300">
                    <Zap className="h-5 w-5" />
                    <span>أمثلة تطبيقية</span>
                    <ExternalLink className="h-3 w-3 mr-auto" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Call to Action */}
        <section className="py-16 bg-sabeel-primary text-white">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">
                هل أنت مستعد للمساهمة في نهضة الأمة؟
              </h2>
              
              <p className="text-lg mb-8">
                انضم إلينا في رحلة توظيف التقنية لخدمة الإسلام والمسلمين. مهاراتك وخبراتك هي الأساس لبناء مستقبل أفضل
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

        {/* Chatbot fixed button */}
        <div className="fixed bottom-6 left-6 z-50">
          <Button 
            onClick={toggleChatbot} 
            size="icon" 
            className="h-14 w-14 rounded-full bg-sabeel-primary shadow-lg hover:bg-sabeel-secondary"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
        </div>

        {/* Chatbot panel */}
        {showChatbot && <SabeelChatbot onClose={toggleChatbot} />}
      </main>
      <Footer />
    </div>
  );
};

export default ForTechnologists;
