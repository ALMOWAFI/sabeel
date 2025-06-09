/**
 * IslamicAIVerifier.tsx
 * 
 * A component that verifies AI-generated content against Islamic principles
 * using the NAMI framework. This serves as a practical implementation of
 * the core Sabeel vision of protecting Islamic knowledge in the AI era.
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
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Alert,
  AlertTitle,
  AlertDescription
} from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CheckCircle,
  AlertTriangle,
  X,
  Shield,
  BookOpen,
  FileCheck,
  UserCheck,
  History
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner';

// Import our NAMI service
import NAMIService, { ContentCategory, VerificationLevel } from '@/services/NAMIService';
import DataService from '@/services/DataService';

// Content categories for verification
const CONTENT_CATEGORIES = [
  { id: 'general', name: 'محتوى عام', icon: <FileCheck className="h-4 w-4" /> },
  { id: 'quran', name: 'قرآن', icon: <BookOpen className="h-4 w-4" /> },
  { id: 'hadith', name: 'حديث', icon: <BookOpen className="h-4 w-4" /> },
  { id: 'fiqh', name: 'فقه', icon: <BookOpen className="h-4 w-4" /> },
  { id: 'aqeedah', name: 'عقيدة', icon: <BookOpen className="h-4 w-4" /> },
  { id: 'seerah', name: 'سيرة', icon: <BookOpen className="h-4 w-4" /> },
  { id: 'fatwa', name: 'فتوى', icon: <BookOpen className="h-4 w-4" /> }
];

interface VerificationResult {
  id: string;
  content: string;
  category: ContentCategory;
  timestamp: string;
  result: {
    isValid: boolean;
    concerns: string[];
    suggestions: string[];
    verificationLevel: VerificationLevel;
  };
  reviewStatus?: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewComments?: string;
}

const IslamicAIVerifier: React.FC = () => {
  const [inputContent, setInputContent] = useState('');
  const [contentCategory, setContentCategory] = useState<ContentCategory>(ContentCategory.GENERAL);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isSubmittingForReview, setIsSubmittingForReview] = useState(false);
  const [verificationHistory, setVerificationHistory] = useState<VerificationResult[]>([]);
  const [hasLoadedHistory, setHasLoadedHistory] = useState(false);
  const [activeTab, setActiveTab] = useState('verify');
  
  const { toast } = useToast();
  
  // Verify the content against Islamic principles
  const handleVerify = async () => {
    if (!inputContent.trim()) {
      toast({
        title: 'المحتوى مطلوب',
        description: 'الرجاء إدخال المحتوى للتحقق منه',
        variant: 'destructive'
      });
      return;
    }
    
    setIsVerifying(true);
    
    try {
      // Use the NAMI service to verify content
      const result = await NAMIService.verifyContent(inputContent, contentCategory);
      
      // Create a verification result object
      const verificationObject: VerificationResult = {
        id: `verify-${Date.now()}`,
        content: inputContent,
        category: contentCategory,
        timestamp: new Date().toISOString(),
        result: {
          isValid: result.isValid,
          concerns: result.concerns,
          suggestions: result.suggestions,
          verificationLevel: result.verificationLevel
        }
      };
      
      setVerificationResult(verificationObject);
      
      // Add to local history
      setVerificationHistory(prev => [verificationObject, ...prev]);
      
      // Show toast based on result
      if (result.isValid) {
        toast({
          title: 'تم التحقق من المحتوى',
          description: 'المحتوى متوافق مع المبادئ الإسلامية',
          variant: 'default'
        });
      } else {
        toast({
          title: 'تم العثور على مشكلات',
          description: `${result.concerns.length} مشكلة تم اكتشافها في المحتوى`,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
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
    
    setIsSubmittingForReview(true);
    
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
      
      // Manual handling for scholar review since we can't call submitForScholarReview yet
      // This is a placeholder that simulates the submission process
      // In a real implementation, this would be handled by the NAMIService.submitForScholarReview method
      
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a fake review ID
      const reviewId = `review-${Date.now()}`;
      
      // Update the verification result with review status
      setVerificationResult(prev => prev ? {
        ...prev,
        reviewStatus: 'pending'
      } : null);
      
      toast({
        title: 'تم إرسال المحتوى للمراجعة',
        description: 'سيتم إشعارك عند اكتمال المراجعة من قبل العلماء',
        variant: 'default'
      });
      
      // Store in verification history for demo purposes
      const updatedResult: VerificationResult = {
        ...verificationResult,
        reviewStatus: 'pending'
      };
      setVerificationHistory(prev => [
        updatedResult,
        ...prev.filter(item => item.id !== updatedResult.id)
      ]);
      
    } catch (error) {
      console.error('Error simulating review submission:', error);
      toast({
        title: 'خطأ في الإرسال',
        description: 'حدث خطأ أثناء إرسال المحتوى للمراجعة',
        variant: 'destructive'
      });
    } finally {
      setIsSubmittingForReview(false);
    }
  };
  
  // Load verification history
  const loadVerificationHistory = async () => {
    // In a real implementation, this would load from the database
    // For now, we'll use local state as a demonstration
    setHasLoadedHistory(true);
  };
  
  // Load history when tab changes to history
  React.useEffect(() => {
    if (activeTab === 'history' && !hasLoadedHistory) {
      loadVerificationHistory();
    }
  }, [activeTab, hasLoadedHistory]);
  
  // Render verification result
  const renderVerificationResult = () => {
    if (!verificationResult) return null;
    
    return (
      <Card className={`mt-6 ${verificationResult.result.isValid ? 'border-green-200' : 'border-red-200'}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            {verificationResult.result.isValid ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
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
            مستوى التحقق: {getVerificationLevelText(verificationResult.result.verificationLevel)}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {verificationResult.result.concerns.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium mb-2 text-red-600">المشكلات المكتشفة:</h4>
              <ul className="list-disc list-inside space-y-1">
                {verificationResult.result.concerns.map((concern, index) => (
                  <li key={index} className="text-sm text-red-700">{concern}</li>
                ))}
              </ul>
            </div>
          )}
          
          {verificationResult.result.suggestions.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 text-amber-600">اقتراحات للتحسين:</h4>
              <ul className="list-disc list-inside space-y-1">
                {verificationResult.result.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-amber-700">{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
        
        <CardFooter>
          {verificationResult.result.verificationLevel !== VerificationLevel.AUTOMATIC && (
            <Button 
              onClick={handleSubmitForReview} 
              disabled={isSubmittingForReview || verificationResult.reviewStatus === 'pending'}
              className="w-full"
            >
              {isSubmittingForReview ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  جاري الإرسال...
                </>
              ) : verificationResult.reviewStatus === 'pending' ? (
                'تم إرسال المحتوى للمراجعة العلمية'
              ) : (
                'إرسال للمراجعة العلمية'
              )}
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
  
  // Render verification history item
  const renderHistoryItem = (item: VerificationResult) => (
    <Card key={item.id} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base flex items-center gap-2">
            {CONTENT_CATEGORIES.find(cat => cat.id === item.category)?.icon}
            <span>{CONTENT_CATEGORIES.find(cat => cat.id === item.category)?.name}</span>
          </CardTitle>
          <Badge variant={item.result.isValid ? 'default' : 'destructive'}>
            {item.result.isValid ? 'متوافق' : 'يحتاج مراجعة'}
          </Badge>
        </div>
        <CardDescription>
          {new Date(item.timestamp).toLocaleString('ar')}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="border-r-2 border-gray-200 dark:border-gray-700 pr-4 mb-2">
          <p className="text-sm line-clamp-2">
            {item.content}
          </p>
        </div>
        
        {item.reviewStatus && (
          <div className="flex items-center gap-2 mt-2">
            {item.reviewStatus === 'pending' ? (
              <Badge variant="outline" className="border-amber-500 text-amber-500">
                قيد المراجعة العلمية
              </Badge>
            ) : item.reviewStatus === 'approved' ? (
              <Badge variant="outline" className="border-green-500 text-green-500">
                تمت الموافقة من قبل العلماء
              </Badge>
            ) : (
              <Badge variant="outline" className="border-red-500 text-red-500">
                مرفوض من قبل العلماء
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" onClick={() => {
          setInputContent(item.content);
          setContentCategory(item.category);
          setVerificationResult(item);
          setActiveTab('verify');
        }}>
          إعادة التحقق
        </Button>
      </CardFooter>
    </Card>
  );
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="text-center mb-8">
        <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h1 className="text-2xl font-bold mb-2">أداة التحقق الإسلامي للذكاء الاصطناعي</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          تحقق من توافق محتوى الذكاء الاصطناعي مع المبادئ الإسلامية وقواعد النامي
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full mb-6">
          <TabsTrigger value="verify">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>التحقق من المحتوى</span>
            </div>
          </TabsTrigger>
          
          <TabsTrigger value="history">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span>سجل التحقق</span>
            </div>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="verify" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>التحقق من محتوى الذكاء الاصطناعي</CardTitle>
              <CardDescription>
                أدخل المحتوى الذي تريد التحقق من توافقه مع المبادئ الإسلامية
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">فئة المحتوى</label>
                <Select
                  value={contentCategory}
                  onValueChange={(value) => setContentCategory(value as ContentCategory)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر فئة المحتوى" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTENT_CATEGORIES.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          {category.icon}
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">اختر الفئة المناسبة للمحتوى للحصول على تحقق أكثر دقة</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">المحتوى</label>
                <Textarea
                  value={inputContent}
                  onChange={(e) => setInputContent(e.target.value)}
                  placeholder="أدخل المحتوى هنا للتحقق من توافقه مع المبادئ الإسلامية..."
                  className="h-48 resize-none"
                />
              </div>
            </CardContent>
            
            <CardFooter>
              <Button
                onClick={handleVerify}
                disabled={isVerifying || !inputContent.trim()}
                className="w-full"
              >
                {isVerifying ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    جاري التحقق...
                  </>
                ) : (
                  'تحقق من المحتوى'
                )}
              </Button>
            </CardFooter>
          </Card>
          
          {renderVerificationResult()}
          
          <Alert className="mt-8">
            <Shield className="h-4 w-4" />
            <AlertTitle>حول أداة التحقق</AlertTitle>
            <AlertDescription>
              <p className="mt-2">
                تستخدم أداة التحقق الإسلامي للذكاء الاصطناعي إطار عمل النامي (النظام الإسلامي للذكاء الاصطناعي) للتحقق من توافق المحتوى الذي ينتجه الذكاء الاصطناعي مع المبادئ الإسلامية.
              </p>
              <p className="mt-2">
                تعمل الأداة على تحليل المحتوى باستخدام مجموعة من القواعد والمبادئ التوجيهية، وتحديد أي مشكلات أو مخاوف قد تتعارض مع الشريعة الإسلامية أو القيم الإسلامية.
              </p>
            </AlertDescription>
          </Alert>
        </TabsContent>
        
        <TabsContent value="history">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>سجل التحقق</CardTitle>
              <CardDescription>
                سجل عمليات التحقق السابقة من محتوى الذكاء الاصطناعي
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {verificationHistory.length === 0 ? (
                <div className="text-center py-8">
                  <History className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-500">لا توجد عمليات تحقق سابقة</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {verificationHistory.map(renderHistoryItem)}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IslamicAIVerifier;
