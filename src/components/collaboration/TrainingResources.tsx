/**
 * TrainingResources.tsx
 * 
 * Educational resources to help scholars understand technology and technologists
 * understand Islamic principles, creating a bridge between the two domains.
 */

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  GraduationCap,
  BookOpen,
  Code,
  Users,
  Lightbulb,
  Play,
  FileText,
  Download
} from 'lucide-react';

interface TrainingResourcesProps {
  userRole: 'scholar' | 'technologist' | 'both' | 'observer';
}

const TrainingResources: React.FC<TrainingResourcesProps> = ({ userRole }) => {
  const [activeTab, setActiveTab] = useState(
    userRole === 'scholar' ? 'tech-for-scholars' : 
    userRole === 'technologist' ? 'islam-for-tech' : 
    'collaborative-learning'
  );
  
  // Mock training resources
  const scholarTechCourses = [
    {
      id: 'ai-basics',
      title: 'أساسيات الذكاء الاصطناعي للعلماء',
      description: 'مقدمة مبسطة للذكاء الاصطناعي وتطبيقاته موجهة للعلماء',
      duration: '3 ساعات',
      level: 'مبتدئ',
      instructor: 'د. أحمد العبدالله'
    },
    {
      id: 'data-privacy',
      title: 'خصوصية البيانات في المنصات الإسلامية',
      description: 'فهم كيفية حماية خصوصية البيانات في تطبيقات المعرفة الإسلامية',
      duration: '2 ساعات',
      level: 'متوسط',
      instructor: 'د. محمد الخالدي'
    },
    {
      id: 'tech-evaluation',
      title: 'تقييم التقنيات من منظور إسلامي',
      description: 'منهجية لتقييم الابتكارات التقنية وفق المعايير الإسلامية',
      duration: '4 ساعات',
      level: 'متقدم',
      instructor: 'د. خالد المحمود'
    }
  ];
  
  const techIslamCourses = [
    {
      id: 'islamic-principles',
      title: 'المبادئ الإسلامية الأساسية للتقنيين',
      description: 'مقدمة للمبادئ والقيم الإسلامية الأساسية للعاملين في مجال التقنية',
      duration: '4 ساعات',
      level: 'مبتدئ',
      instructor: 'د. عبدالرحمن السالم'
    },
    {
      id: 'islamic-ethics-ai',
      title: 'أخلاقيات الذكاء الاصطناعي من منظور إسلامي',
      description: 'دراسة أخلاقيات الذكاء الاصطناعي من خلال القيم الإسلامية',
      duration: '3 ساعات',
      level: 'متوسط',
      instructor: 'د. نورة القحطاني'
    },
    {
      id: 'islamic-content-guidelines',
      title: 'إرشادات المحتوى الإسلامي للمطورين',
      description: 'دليل شامل لتطوير محتوى إسلامي دقيق ومحترم في التطبيقات التقنية',
      duration: '2 ساعات',
      level: 'متوسط',
      instructor: 'أ. فاطمة الزهراني'
    }
  ];
  
  const collaborativeCourses = [
    {
      id: 'scholar-tech-projects',
      title: 'إدارة مشاريع مشتركة بين العلماء والتقنيين',
      description: 'منهجية لإدارة المشاريع التعاونية بين العلماء والتقنيين بفعالية',
      duration: '5 ساعات',
      level: 'متقدم',
      instructor: 'د. يوسف العتيبي & م. سارة الشمري'
    },
    {
      id: 'knowledge-translation',
      title: 'ترجمة المعرفة بين المجالين',
      description: 'استراتيجيات لترجمة المفاهيم الإسلامية إلى تطبيقات تقنية والعكس',
      duration: '4 ساعات',
      level: 'متوسط',
      instructor: 'د. هند المالكي & د. علي الشهري'
    },
    {
      id: 'islamic-innovation',
      title: 'الابتكار الإسلامي في العصر الرقمي',
      description: 'استكشاف كيفية تطوير حلول مبتكرة تجمع بين الأصالة الإسلامية والتقنية الحديثة',
      duration: '6 ساعات',
      level: 'متقدم',
      instructor: 'د. عمر الحميدي & م. ليلى العنزي'
    }
  ];
  
  // Render a course card
  const renderCourseCard = (course: any) => (
    <Card key={course.id} className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{course.title}</CardTitle>
          <Badge variant="outline">{course.level}</Badge>
        </div>
        <CardDescription>{course.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-2 mb-3">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <GraduationCap className="h-4 w-4 mr-1" />
            <span>المدرس: {course.instructor}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Play className="h-4 w-4 mr-1" />
            <span>المدة: {course.duration}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <Button variant="default" className="w-full">
          ابدأ التدريب
        </Button>
      </CardFooter>
    </Card>
  );
  
  // Render resources section
  const renderResourcesSection = (title: string, description: string, items: any[]) => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => renderCourseCard(item))}
      </div>
    </div>
  );
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <GraduationCap className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h2 className="text-2xl font-bold mb-2">موارد التدريب</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          دورات تدريبية ومصادر تعليمية لبناء جسر المعرفة بين العلماء والتقنيين
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-1 md:grid-cols-3 w-full mb-6">
          <TabsTrigger value="tech-for-scholars">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              <span>التقنية للعلماء</span>
            </div>
          </TabsTrigger>
          
          <TabsTrigger value="islam-for-tech">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>الإسلام للتقنيين</span>
            </div>
          </TabsTrigger>
          
          <TabsTrigger value="collaborative-learning">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>التعلم المشترك</span>
            </div>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tech-for-scholars" className="space-y-6">
          {renderResourcesSection(
            'دورات تقنية للعلماء',
            'دورات مصممة خصيصاً لمساعدة العلماء على فهم التقنية وتطبيقاتها',
            scholarTechCourses
          )}
          
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>مكتبة المصادر التقنية</CardTitle>
              <CardDescription>
                مصادر ووثائق تقنية مبسطة للعلماء
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <div>
                      <h4 className="font-medium">دليل مصطلحات الذكاء الاصطناعي</h4>
                      <p className="text-sm text-gray-500">قاموس مبسط للمصطلحات التقنية</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    تحميل
                  </Button>
                </div>
                
                <div className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-green-500" />
                    <div>
                      <h4 className="font-medium">مخاطر الذكاء الاصطناعي على المحتوى الإسلامي</h4>
                      <p className="text-sm text-gray-500">دراسة عن التحديات والحلول</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    تحميل
                  </Button>
                </div>
                
                <div className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-purple-500" />
                    <div>
                      <h4 className="font-medium">دليل تقييم تطبيقات الذكاء الاصطناعي</h4>
                      <p className="text-sm text-gray-500">منهجية تقييم التطبيقات من منظور إسلامي</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    تحميل
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="islam-for-tech" className="space-y-6">
          {renderResourcesSection(
            'دورات إسلامية للتقنيين',
            'دورات مصممة خصيصاً لمساعدة التقنيين على فهم المبادئ الإسلامية',
            techIslamCourses
          )}
          
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>أدلة إرشادية للتقنيين</CardTitle>
              <CardDescription>
                إرشادات عملية لتطوير تقنيات متوافقة مع الشريعة الإسلامية
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-amber-500" />
                    <div>
                      <h4 className="font-medium">المبادئ الإسلامية في تصميم واجهات المستخدم</h4>
                      <p className="text-sm text-gray-500">إرشادات لتصميم واجهات ملائمة ثقافياً</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    تحميل
                  </Button>
                </div>
                
                <div className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-red-500" />
                    <div>
                      <h4 className="font-medium">نموذج نامي للذكاء الاصطناعي</h4>
                      <p className="text-sm text-gray-500">إطار عمل لتطوير نماذج ذكاء اصطناعي متوافقة مع الشريعة</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    تحميل
                  </Button>
                </div>
                
                <div className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-teal-500" />
                    <div>
                      <h4 className="font-medium">قائمة تحقق المحتوى الإسلامي</h4>
                      <p className="text-sm text-gray-500">أداة للتحقق من توافق المحتوى مع المبادئ الإسلامية</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    تحميل
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="collaborative-learning" className="space-y-6">
          {renderResourcesSection(
            'التعلم المشترك',
            'دورات تجمع العلماء والتقنيين معاً لتطوير مهارات التعاون',
            collaborativeCourses
          )}
          
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>ورش عمل تعاونية</CardTitle>
              <CardDescription>
                ورش عمل قادمة تجمع العلماء والتقنيين لتطوير مشاريع مشتركة
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-medium">حماية النصوص الإسلامية من التزييف بالذكاء الاصطناعي</h4>
                    <Badge>15 يونيو 2025</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    ورشة عمل تجمع علماء الحديث ومطوري تقنيات كشف التزييف لحماية النصوص الإسلامية
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      <span>12 مشارك</span>
                    </div>
                    <Button variant="outline" size="sm">
                      التسجيل
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-medium">تطوير منصة تعليمية للعلوم الإسلامية بالذكاء الاصطناعي</h4>
                    <Badge>22 يونيو 2025</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    ورشة عمل لتصميم وتطوير منصة تعليمية ذكية للعلوم الإسلامية
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      <span>8 مشاركين</span>
                    </div>
                    <Button variant="outline" size="sm">
                      التسجيل
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button variant="link" className="w-full">
                عرض جميع ورش العمل القادمة
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainingResources;
