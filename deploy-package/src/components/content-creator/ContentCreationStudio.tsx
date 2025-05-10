/**
 * ContentCreationStudio.tsx
 * 
 * Rich content creation and publishing platform for Islamic scholars and educators
 * Allows creation of various content types with moderation workflow
 * Integrated with Supabase database for content management
 */

import React, { useState, useEffect } from 'react';
import supabaseAuthService from '@/services/SupabaseAuthService';
import supabaseDatabaseService from '@/services/SupabaseDatabaseService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { 
  Book, 
  FileText, 
  Video, 
  MessageSquare, 
  FileQuestion,
  Upload,
  Save,
  Info,
  Eye,
  BookOpen,
  Clock
} from 'lucide-react';

// Draft interface for content creation
interface ContentDraft {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  contentType: 'article' | 'book' | 'video' | 'course' | 'question';
  status: 'draft' | 'published' | 'pending' | 'rejected';
  tags: string[];
  language: string;
  coverImage?: string;
  resources?: Array<{
    type: string;
    url: string;
    title: string;
  }>;
  categories: string[];
  lastUpdated: string;
  publishDate?: string;
  isPublic: boolean;
  source?: string;
  requiresReview: boolean;
}

// Map Supabase content item to our ContentDraft interface
const mapContentItemToDraft = (item: any): ContentDraft => {
  return {
    id: item.id,
    title: item.title,
    content: item.content,
    excerpt: item.summary || '',
    contentType: item.category.includes('book') ? 'book' : 
                item.category.includes('video') ? 'video' : 
                item.category.includes('course') ? 'course' : 
                item.category.includes('question') ? 'question' : 'article',
    status: item.status,
    tags: item.tags || [],
    language: item.language,
    coverImage: item.cover_image_url,
    categories: [item.category],
    lastUpdated: new Date(item.updated_at).toISOString().split('T')[0],
    publishDate: item.published_at ? new Date(item.published_at).toISOString().split('T')[0] : undefined,
    isPublic: item.status === 'published',
    requiresReview: true,
    source: item.source
  };
};

const ContentCreationStudio: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('create');
  const [drafts, setDrafts] = useState<ContentDraft[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [contentType, setContentType] = useState<ContentDraft['contentType']>('article');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: '',
    language: 'arabic',
    isPublic: false,
    requiresReview: true,
    categories: ''
  });
  
  // Content type options
  const contentTypes = [
    { value: 'article', label: 'مقالة', icon: <FileText className="h-4 w-4 mr-2" /> },
    { value: 'book', label: 'كتاب', icon: <Book className="h-4 w-4 mr-2" /> },
    { value: 'video', label: 'فيديو', icon: <Video className="h-4 w-4 mr-2" /> },
    { value: 'course', label: 'دورة تعليمية', icon: <BookOpen className="h-4 w-4 mr-2" /> },
    { value: 'question', label: 'سؤال وجواب', icon: <FileQuestion className="h-4 w-4 mr-2" /> }
  ];
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle switch changes
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  // Handle content type change
  const handleContentTypeChange = (value: string) => {
    setContentType(value as ContentDraft['contentType']);
  };
  
  // Clear form
  const clearForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      tags: '',
      language: 'arabic',
      isPublic: false,
      requiresReview: true,
      categories: ''
    });
  };
  
  // Save as draft
  const handleSaveDraft = async () => {
    // Validate form
    if (!formData.title || !formData.content) {
      toast({
        variant: "destructive",
        title: "يرجى ملء الحقول المطلوبة",
        description: "العنوان والمحتوى مطلوبان"
      });
      return;
    }
    
    if (!currentUser) {
      toast({
        variant: "destructive",
        title: "يرجى تسجيل الدخول",
        description: "يجب تسجيل الدخول لحفظ المحتوى"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Create content item in Supabase
      const contentItem = {
        title: formData.title,
        content: formData.content,
        summary: formData.excerpt || formData.content.substring(0, 150) + '...',
        category: contentType,
        tags: formData.tags.split(',').map(tag => tag.trim()),
        status: 'draft' as 'draft' | 'published' | 'rejected' | 'in_review',
        author_id: currentUser.id,
        language: formData.language,
        read_time_minutes: Math.ceil(formData.content.length / 1000)
      };
      
      const savedItem = await supabaseDatabaseService.createContentItem(contentItem);
      
      // Map to ContentDraft and add to state
      const newDraft = mapContentItemToDraft(savedItem);
      setDrafts(prev => [newDraft, ...prev]);
      
      toast({
        title: "تم الحفظ",
        description: "تم حفظ المحتوى كمسودة"
      });
      
      // Switch to drafts tab
      setActiveTab('drafts');
      clearForm();
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        variant: "destructive",
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ المسودة"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Submit for review
  const handleSubmitForReview = async () => {
    // Validate form
    if (!formData.title || !formData.content || !formData.excerpt) {
      toast({
        variant: "destructive",
        title: "يرجى ملء الحقول المطلوبة",
        description: "العنوان والمحتوى والملخص مطلوبة للمراجعة"
      });
      return;
    }
    
    if (!currentUser) {
      toast({
        variant: "destructive",
        title: "يرجى تسجيل الدخول",
        description: "يجب تسجيل الدخول لإرسال المحتوى للمراجعة"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Create content item in Supabase
      const contentItem = {
        title: formData.title,
        content: formData.content,
        summary: formData.excerpt,
        category: contentType,
        tags: formData.tags.split(',').map(tag => tag.trim()),
        status: 'in_review' as 'draft' | 'published' | 'rejected' | 'in_review',
        author_id: currentUser.id,
        language: formData.language,
        read_time_minutes: Math.ceil(formData.content.length / 1000)
      };
      
      const savedItem = await supabaseDatabaseService.createContentItem(contentItem);
      
      // Map to ContentDraft and add to state
      const newSubmission = mapContentItemToDraft(savedItem);
      newSubmission.status = 'pending'; // For UI display purposes
      
      setDrafts(prev => [newSubmission, ...prev]);
      
      toast({
        title: "تم الإرسال للمراجعة",
        description: "تم إرسال المحتوى للمراجعة وسيتم نشره بعد الموافقة عليه"
      });
      
      // Switch to drafts tab
      setActiveTab('drafts');
      clearForm();
    } catch (error) {
      console.error('Error submitting for review:', error);
      toast({
        variant: "destructive",
        title: "خطأ في الإرسال",
        description: "حدث خطأ أثناء إرسال المحتوى للمراجعة"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get status badge for draft
  const getStatusBadge = (status: ContentDraft['status']) => {
    switch (status) {
      case 'published':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">منشور</span>;
      case 'draft':
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">مسودة</span>;
      case 'pending':
        return <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs">قيد المراجعة</span>;
      case 'rejected':
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">مرفوض</span>;
      default:
        return null;
    }
  };
  
  // Get content type icon
  const getContentTypeIcon = (type: ContentDraft['contentType']) => {
    const contentType = contentTypes.find(t => t.value === type);
    return contentType ? contentType.icon : <FileText className="h-4 w-4" />;
  };
  
  // Load user data and drafts
  useEffect(() => {
    const loadUserAndDrafts = async () => {
      try {
        setIsLoading(true);
        
        // Get current user
        const user = await supabaseAuthService.getCurrentUser();
        setCurrentUser(user);
        
        if (user) {
          // Get user's content items
          const contentItems = await supabaseDatabaseService.getContentItemsByAuthor(user.id);
          
          // Map to ContentDraft interface
          const userDrafts = contentItems.map(mapContentItemToDraft);
          setDrafts(userDrafts);
        }
      } catch (error) {
        console.error('Error loading user data and drafts:', error);
        toast({
          variant: "destructive",
          title: "خطأ في التحميل",
          description: "حدث خطأ أثناء تحميل البيانات"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserAndDrafts();
  }, [toast]);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-right">استوديو إنشاء المحتوى</CardTitle>
        <CardDescription className="text-right">
          أنشئ ونشر محتوى تعليمي إسلامي عالي الجودة وشاركه مع المجتمع
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="create" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">إنشاء محتوى جديد</TabsTrigger>
            <TabsTrigger value="drafts">المسودات ({drafts.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="contentType" className="text-right block">نوع المحتوى</Label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {contentTypes.map(type => (
                  <Button
                    key={type.value}
                    type="button"
                    variant={contentType === type.value ? "default" : "outline"}
                    className="flex items-center justify-center"
                    onClick={() => handleContentTypeChange(type.value)}
                  >
                    {type.icon}
                    <span>{type.label}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title" className="text-right block">العنوان</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="text-right"
                placeholder="أدخل عنوان المحتوى..."
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categories" className="text-right block">التصنيفات</Label>
                <Input
                  id="categories"
                  name="categories"
                  value={formData.categories}
                  onChange={handleInputChange}
                  className="text-right"
                  placeholder="عقيدة، فقه، سيرة (مفصولة بفواصل)"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags" className="text-right block">الوسوم</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="text-right"
                  placeholder="أدخل وسوم مفصولة بفواصل"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="excerpt" className="text-right block">ملخص</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                className="text-right h-20"
                placeholder="اكتب ملخصًا قصيرًا للمحتوى..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content" className="text-right block">المحتوى</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                className="text-right h-64"
                placeholder="اكتب المحتوى الكامل هنا..."
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language" className="text-right block">اللغة</Label>
              <Select
                value={formData.language}
                onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="اختر اللغة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="arabic">العربية</SelectItem>
                  <SelectItem value="english">الإنجليزية</SelectItem>
                  <SelectItem value="turkish">التركية</SelectItem>
                  <SelectItem value="french">الفرنسية</SelectItem>
                  <SelectItem value="urdu">الأردية</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="requiresReview">مراجعة المشرفين</Label>
                    <p className="text-sm text-muted-foreground">
                      سيتم مراجعة المحتوى قبل النشر
                    </p>
                  </div>
                  <Switch
                    id="requiresReview"
                    checked={formData.requiresReview}
                    onCheckedChange={(checked) => handleSwitchChange('requiresReview', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isPublic">محتوى عام</Label>
                    <p className="text-sm text-muted-foreground">
                      يمكن للجميع مشاهدة ومشاركة هذا المحتوى
                    </p>
                  </div>
                  <Switch
                    id="isPublic"
                    checked={formData.isPublic}
                    onCheckedChange={(checked) => handleSwitchChange('isPublic', checked)}
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={clearForm}>
                مسح النموذج
              </Button>
              <Button 
                onClick={handleSaveDraft} 
                className="flex items-center gap-2"
                disabled={isLoading || !currentUser}
              >
                {isLoading ? (
                  <div className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin"></div>
                ) : (
                  <Save className="h-4 w-4" />
                )}
                حفظ كمسودة
              </Button>
              <Button
                variant="default"
                onClick={handleSubmitForReview}
                className="flex items-center gap-2"
                disabled={isLoading || !currentUser}
              >
                {isLoading ? (
                  <div className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin"></div>
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                إرسال للمراجعة
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="drafts" className="space-y-4 mt-4">
            <h3 className="text-lg font-semibold mb-4 text-right">المسودات والمحتوى المنتظر</h3>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-2 text-muted-foreground">جارِ التحميل...</p>
              </div>
            ) : drafts.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">لا توجد مسودات</h3>
                  <p className="text-muted-foreground mt-2">
                    ابدأ بإنشاء محتوى جديد
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {drafts.map((draft) => (
                    <Card key={draft.id} className="overflow-hidden">
                      <div className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex flex-col space-y-1 items-end text-right">
                            <div className="flex items-center space-x-2 space-x-reverse">
                              {getStatusBadge(draft.status)}
                              <h3 className="font-semibold text-lg">{draft.title}</h3>
                            </div>
                            <div className="flex items-center text-muted-foreground text-sm">
                              <Clock className="h-3 w-3 ml-1" />
                              <span>آخر تحديث: {draft.lastUpdated}</span>
                              <span className="mx-2">•</span>
                              <div className="flex items-center">
                                {getContentTypeIcon(draft.contentType)}
                                <span className="ml-1">
                                  {contentTypes.find(t => t.value === draft.contentType)?.label}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <p className="mt-2 text-sm text-right line-clamp-2">{draft.excerpt}</p>
                        
                        <div className="mt-4 flex flex-wrap gap-1 justify-end">
                          {draft.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-muted text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="mt-4 flex justify-end space-x-2 space-x-reverse">
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            معاينة
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            تعديل
                          </Button>
                          {draft.status === 'draft' && (
                            <Button size="sm">
                              <Upload className="mr-2 h-4 w-4" />
                              إرسال للمراجعة
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-center border-t p-4">
        <div className="flex items-start space-x-2">
          <Info className="h-4 w-4 mt-0.5 text-blue-500" />
          <p className="text-sm text-muted-foreground">
            نشجع على الالتزام بمعايير الجودة والأمانة العلمية. سيتم مراجعة المحتوى للتأكد من دقته وجودته قبل النشر.
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ContentCreationStudio;
