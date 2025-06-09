/**
 * KnowledgeProtection.tsx
 * 
 * Component for protecting Islamic knowledge using the NAMI framework.
 * This component provides tools for content verification, deepfake detection,
 * and scholar approval workflows.
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
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  FileText, 
  Users, 
  AlertTriangle,
  CheckCircle2,
  X,
  BookOpen,
  Smartphone,
  Lock
} from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Import services
import NAMIService, { ContentCategory, VerificationLevel } from '@/services/NAMIService';
import DataService from '@/services/DataService';

// Content verification form schema
const contentVerificationSchema = z.object({
  content: z.string().min(10, {
    message: 'المحتوى يجب أن يكون على الأقل 10 أحرف'
  }),
  category: z.enum(['general', 'quran', 'hadith', 'fiqh', 'aqeedah', 'seerah', 'fatwa'], {
    required_error: 'يرجى اختيار فئة المحتوى'
  })
});

const KnowledgeProtection: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('verification');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Form setup
  const form = useForm<z.infer<typeof contentVerificationSchema>>({
    resolver: zodResolver(contentVerificationSchema),
    defaultValues: {
      content: '',
      category: 'general'
    }
  });
  
  // Handle content verification
  const handleVerifyContent = async (values: z.infer<typeof contentVerificationSchema>) => {
    setIsVerifying(true);
    setVerificationResult(null);
    
    try {
      // Verify content using NAMI service
      const result = await NAMIService.verifyContent(
        values.content,
        values.category as ContentCategory
      );
      
      setVerificationResult(result);
      
      // Show toast based on verification result
      if (result.isValid) {
        toast({
          title: 'تم التحقق من المحتوى',
          description: 'المحتوى مطابق للمبادئ الإسلامية',
          variant: 'default'
        });
      } else {
        toast({
          title: 'تم العثور على مشكلات في المحتوى',
          description: `تم اكتشاف ${result.concerns.length} مشكلة في المحتوى`,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error verifying content:', error);
      toast({
        title: 'خطأ في التحقق',
        description: 'حدث خطأ أثناء التحقق من المحتوى',
        variant: 'destructive'
      });
    } finally {
      setIsVerifying(false);
    }
  };
  
  // Submit content for scholar review
  const handleSubmitForReview = async () => {
    if (!verificationResult) return;
    
    try {
      // Get current user
      const user = await DataService.getCurrentUser();
      
      if (!user) {
        toast({
          title: 'يجب تسجيل الدخول',
          description: 'يرجى تسجيل الدخول لإرسال المحتوى للمراجعة',
          variant: 'destructive'
        });
        return;
      }
      
      // Submit for scholar review
      const reviewId = await NAMIService.submitForScholarReview(
        form.getValues().content,
        form.getValues().category as ContentCategory,
        user.userId
      );
      
      toast({
        title: 'تم إرسال المحتوى للمراجعة',
        description: 'سيتم إشعارك عند اكتمال المراجعة من قبل العلماء',
        variant: 'default'
      });
      
      // Reset form
      form.reset();
      setVerificationResult(null);
    } catch (error) {
      console.error('Error submitting for review:', error);
      toast({
        title: 'خطأ في الإرسال',
        description: 'حدث خطأ أثناء إرسال المحتوى للمراجعة',
        variant: 'destructive'
      });
    }
  };
  
  // Render verification result
  const renderVerificationResult = () => {
    if (!verificationResult) return null;
    
    return (
      <Card className={`mt-6 ${verificationResult.isValid ? 'border-green-200' : 'border-red-200'}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            {verificationResult.isValid ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>المحتوى متوافق مع المبادئ الإسلامية</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <span>يحتاج المحتوى إلى مراجعة</span>
              </>
            )}
          </CardTitle>
          <CardDescription>
            مستوى التحقق: {getVerificationLevelText(verificationResult.verificationLevel)}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {verificationResult.concerns.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium mb-2 text-red-600">المشكلات المكتشفة:</h4>
              <ul className="list-disc list-inside space-y-1">
                {verificationResult.concerns.map((concern: string, index: number) => (
                  <li key={index} className="text-sm text-red-700">{concern}</li>
                ))}
              </ul>
            </div>
          )}
          
          {verificationResult.suggestions.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 text-amber-600">اقتراحات للتحسين:</h4>
              <ul className="list-disc list-inside space-y-1">
                {verificationResult.suggestions.map((suggestion: string, index: number) => (
                  <li key={index} className="text-sm text-amber-700">{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
        
        <CardFooter>
          {verificationResult.verificationLevel !== VerificationLevel.AUTOMATIC && (
            <Button 
              onClick={handleSubmitForReview} 
              className="w-full"
            >
              إرسال للمراجعة العلمية
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };
  
  // Get text representation of verification level
  const getVerificationLevelText = (level: VerificationLevel) => {
    switch (level) {
      case VerificationLevel.AUTOMATIC:
        return 'تحقق آلي';
      case VerificationLevel.SCHOLAR_LIGHT:
        return 'مراجعة عالم (خفيفة)';
      case VerificationLevel.SCHOLAR_DEEP:
        return 'مراجعة عالم (عميقة)';
      case VerificationLevel.COMMITTEE:
        return 'مراجعة لجنة علماء';
      default:
        return 'غير معروف';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h2 className="text-2xl font-bold mb-2">حماية المعرفة الإسلامية</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          أدوات لحماية المحتوى الإسلامي وضمان سلامته وموافقته للمبادئ الإسلامية
          في عصر الذكاء الاصطناعي وانتشار المعلومات المغلوطة
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-1 md:grid-cols-3 w-full mb-6">
          <TabsTrigger value="verification">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>التحقق من المحتوى</span>
            </div>
          </TabsTrigger>
          
          <TabsTrigger value="guidelines">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>المبادئ التوجيهية</span>
            </div>
          </TabsTrigger>
          
          <TabsTrigger value="deepfake">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              <span>كشف المحتوى المزيف</span>
            </div>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="verification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>التحقق من المحتوى الإسلامي</CardTitle>
              <CardDescription>
                أدخل المحتوى للتحقق من توافقه مع المبادئ الإسلامية
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleVerifyContent)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>فئة المحتوى</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر فئة المحتوى" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="general">محتوى عام</SelectItem>
                            <SelectItem value="quran">قرآن</SelectItem>
                            <SelectItem value="hadith">حديث</SelectItem>
                            <SelectItem value="fiqh">فقه</SelectItem>
                            <SelectItem value="aqeedah">عقيدة</SelectItem>
                            <SelectItem value="seerah">سيرة</SelectItem>
                            <SelectItem value="fatwa">فتوى</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          اختر الفئة المناسبة للمحتوى للحصول على تحقق أكثر دقة
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>المحتوى</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="أدخل المحتوى هنا للتحقق من توافقه مع المبادئ الإسلامية..."
                            className="h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          يجب أن يكون المحتوى باللغة العربية أو الإنجليزية
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isVerifying}
                  >
                    {isVerifying ? 'جاري التحقق...' : 'تحقق من المحتوى'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          {renderVerificationResult()}
        </TabsContent>
        
        <TabsContent value="guidelines" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>المبادئ التوجيهية للمحتوى الإسلامي</CardTitle>
              <CardDescription>
                مبادئ النامي لضمان سلامة المحتوى الإسلامي في التطبيقات التقنية
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="general">
                  <AccordionTrigger>المبادئ العامة</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc list-inside space-y-2">
                      <li>احترام مبادئ وقيم الإسلام في كل المحتوى</li>
                      <li>تجنب الترويج للسلوكيات المخالفة للتعاليم الإسلامية</li>
                      <li>احترام العلماء وآرائهم</li>
                      <li>إعطاء الأولوية للمصادر الإسلامية الموثوقة</li>
                      <li>توضيح مستويات اليقين في المسائل الدينية</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="quran">
                  <AccordionTrigger>مبادئ المحتوى القرآني</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc list-inside space-y-2">
                      <li>التحقق دائماً من الاقتباسات القرآنية مقابل المصادر الموثوقة</li>
                      <li>توفير السياق للآيات القرآنية عند الاقتباس</li>
                      <li>تضمين النص العربي والترجمة عند الإمكان</li>
                      <li>الإشارة إلى رقم السورة والآية لأي اقتباس قرآني</li>
                      <li>عدم محاولة التفسير دون الرجوع للمصادر العلمية</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="hadith">
                  <AccordionTrigger>مبادئ الأحاديث النبوية</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc list-inside space-y-2">
                      <li>التحقق من صحة الحديث قبل مشاركته</li>
                      <li>تضمين سلسلة الرواة عند توفرها</li>
                      <li>ذكر مصدر الحديث (البخاري، مسلم، إلخ)</li>
                      <li>الإشارة إلى تصنيف الحديث (صحيح، حسن، ضعيف)</li>
                      <li>توفير سياق الحديث عندما يكون ذلك ضرورياً</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="fiqh">
                  <AccordionTrigger>مبادئ المحتوى الفقهي</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc list-inside space-y-2">
                      <li>الاعتراف بوجود آراء مختلفة بين المذاهب عند الاقتضاء</li>
                      <li>توضيح المذهب أو رأي العالم الذي يتم عرضه</li>
                      <li>تجنب تقديم رأي فقهي واحد كما لو كان الرأي الوحيد الصحيح</li>
                      <li>ذكر الدليل وراء المواقف الفقهية عند الإمكان</li>
                      <li>التمييز بين الواجب والمستحب والمباح</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="deepfake" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>كشف المحتوى المزيف</CardTitle>
              <CardDescription>
                أدوات للكشف عن المحتوى المزيف والصور والفيديوهات المعدلة بالذكاء الاصطناعي
              </CardDescription>
            </CardHeader>
            
            <CardContent className="text-center py-12">
              <Lock className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium">هذه الميزة قيد التطوير</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
                نعمل على تطوير أدوات متقدمة للكشف عن المحتوى المزيف باستخدام تقنيات الذكاء الاصطناعي.
                ستكون هذه الميزة متاحة قريباً.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KnowledgeProtection;
