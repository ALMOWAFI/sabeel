/**
 * ContentCreationStudio.tsx
 * 
 * Rich content creation and publishing platform for Islamic scholars and educators
 * Allows creation of various content types with moderation workflow
 * Integrated with the unified DataService for content management
 */

import React, { useState, useEffect } from 'react';
import dataService from '@/services/DataService';
import { Collections } from '@/types/collections';
import { User } from '@/types/user';
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
  status: 'draft' | 'published' | 'pending' | 'rejected' | 'in_review';
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

// Map backend content item to our ContentDraft interface
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
    lastUpdated: new Date(item.updated_at || item.$updatedAt).toISOString().split('T')[0],
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
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
    if (!formData.title || !formData.content) {
      toast({ variant: "destructive", title: "يرجى ملء الحقول المطلوبة", description: "العنوان والمحتوى مطلوبان" });
      return;
    }
    
    if (!currentUser) {
      toast({ variant: "destructive", title: "يرجى تسجيل الدخول", description: "يجب تسجيل الدخول لحفظ المحتوى" });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const contentItem = {
        title: formData.title,
        content: formData.content,
        summary: formData.excerpt || formData.content.substring(0, 150) + '...',
        category: contentType,
        tags: formData.tags.split(',').map(tag => tag.trim()),
        status: 'draft' as ContentDraft['status'],
        author_id: currentUser.userId,
        language: formData.language,
        read_time_minutes: Math.ceil(formData.content.length / 1000)
      };
      
      const savedItem = await dataService.createDocument(Collections.CONTENT_ITEMS, contentItem);
      
      const newDraft = mapContentItemToDraft(savedItem);
      setDrafts(prev => [newDraft, ...prev]);
      
      toast({ title: "تم الحفظ", description: "تم حفظ المحتوى كمسودة" });
      
      setActiveTab('drafts');
      clearForm();
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({ variant: "destructive", title: "خطأ في الحفظ", description: "حدث خطأ أثناء حفظ المسودة" });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Publish content
  const handlePublish = async (draftId: string) => {
    if (!currentUser) return;
    
    try {
      setIsLoading(true);
      const updatedContent = { 
        status: 'published' as ContentDraft['status'],
        published_at: new Date().toISOString()
      };
      
      await dataService.updateDocument(Collections.CONTENT_ITEMS, draftId, updatedContent);
      
      setDrafts(prev => prev.map(d => d.id === draftId ? { ...d, status: 'published' } : d));
      
      toast({ title: "تم النشر", description: "تم نشر المحتوى بنجاح" });
    } catch (error) {
      console.error('Error publishing content:', error);
      toast({ variant: "destructive", title: "خطأ في النشر", description: "حدث خطأ أثناء نشر المحتوى" });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete draft
  const handleDeleteDraft = async (draftId: string) => {
    if (!currentUser) return;
    
    try {
      setIsLoading(true);
      await dataService.deleteDocument(Collections.CONTENT_ITEMS, draftId);
      setDrafts(prev => prev.filter(d => d.id !== draftId));
      toast({ title: "تم الحذف", description: "تم حذف المسودة بنجاح" });
    } catch (error) {
      console.error('Error deleting draft:', error);
      toast({ variant: "destructive", title: "خطأ في الحذف", description: "حدث خطأ أثناء حذف المسودة" });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch user and drafts on component mount
  useEffect(() => {
    const checkUserAndFetchData = async () => {
      setIsLoading(true);
      try {
        const user = await dataService.getCurrentUser();
        setCurrentUser(user);
        
        if (user) {
          const contentItems = await dataService.listDocuments<any>(
            Collections.CONTENT_ITEMS, 
            { author_id: user.userId }
          );
          const userDrafts = contentItems.map(mapContentItemToDraft);
          setDrafts(userDrafts);
        } else {
          setDrafts([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({ variant: "destructive", title: "خطأ", description: "فشل تحميل البيانات" });
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUserAndFetchData();
  }, [toast]);
  
  return (
    <div dir="rtl" className="container mx-auto p-4 font-amiri">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">استوديو صناعة المحتوى</CardTitle>
          <CardDescription>منصة متكاملة لإنشاء وإدارة المحتوى الإسلامي</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">إنشاء جديد</TabsTrigger>
              <TabsTrigger value="drafts">المسودات ({drafts.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="create">
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">العنوان</Label>
                    <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="عنوان المحتوى" />
                  </div>
                  <div>
                    <Label>نوع المحتوى</Label>
                    <Select onValueChange={handleContentTypeChange} defaultValue={contentType}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع المحتوى" />
                      </SelectTrigger>
                      <SelectContent>
                        {contentTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center">
                              {type.icon} {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="content">المحتوى</Label>
                  <Textarea 
                    id="content" 
                    name="content" 
                    value={formData.content} 
                    onChange={handleInputChange} 
                    placeholder="اكتب المحتوى هنا..." 
                    rows={15}
                  />
                </div>
                <div>
                  <Label htmlFor="excerpt">مقتطف</Label>
                  <Textarea id="excerpt" name="excerpt" value={formData.excerpt} onChange={handleInputChange} placeholder="مقتطف قصير للمحتوى" rows={3} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tags">الوسوم (مفصولة بفاصلة)</Label>
                    <Input id="tags" name="tags" value={formData.tags} onChange={handleInputChange} placeholder="مثال: فقه, حديث, سيرة" />
                  </div>
                  <div>
                    <Label htmlFor="categories">الفئة</Label>
                    <Input id="categories" name="categories" value={formData.categories} onChange={handleInputChange} placeholder="مثال: العقيدة الإسلامية" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Switch id="isPublic" checked={formData.isPublic} onCheckedChange={(c) => handleSwitchChange('isPublic', c)} />
                    <Label htmlFor="isPublic">مرئي للعامة</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Switch id="requiresReview" checked={formData.requiresReview} onCheckedChange={(c) => handleSwitchChange('requiresReview', c)} />
                    <Label htmlFor="requiresReview">يتطلب مراجعة</Label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2 space-x-reverse pt-4">
                <Button variant="outline" onClick={clearForm}>مسح</Button>
                <Button onClick={handleSaveDraft} disabled={isLoading}>
                  {isLoading ? 'جاري الحفظ...' : <><Save className="h-4 w-4 ml-2" /> حفظ كمسودة</>}
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="drafts">
              <div className="space-y-4 py-4">
                {isLoading ? (
                  <p>جاري تحميل المسودات...</p>
                ) : drafts.length === 0 ? (
                  <p>لا يوجد مسودات حالياً.</p>
                ) : (
                  drafts.map(draft => (
                    <Card key={draft.id} className="flex flex-col sm:flex-row items-start gap-4 p-4">
                      <div className="flex-grow">
                        <CardTitle className="text-lg font-bold">{draft.title}</CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                          <span className="inline-flex items-center">
                            {contentTypes.find(ct => ct.value === draft.contentType)?.icon}
                            <span className="mr-1">{contentTypes.find(ct => ct.value === draft.contentType)?.label}</span>
                          </span>
                          <span className="mx-2">|</span>
                          <span className="inline-flex items-center">
                            <Clock className="h-4 w-4 ml-1" />
                            آخر تحديث: {draft.lastUpdated}
                          </span>
                        </p>
                        <p className="text-sm mt-2">{draft.excerpt}</p>
                        <div className="mt-2">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${draft.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {draft.status === 'published' ? 'منشور' : 'مسودة'}
                          </span>
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
