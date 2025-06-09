/**
 * WhatsAppGroupJoin.tsx
 * 
 * Component for joining WhatsApp community groups related to Islamic knowledge
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { MessageSquare, Users, Clock, Globe, Check, AlertCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import appwriteService from "@/services/AppwriteService";
import appwriteAuthBridge from "@/services/AppwriteAuthBridge";
import { Query, ID } from 'appwrite';

interface WhatsAppGroup {
  id: string;
  name: string;
  description: string;
  category: 'knowledge' | 'quran' | 'fiqh' | 'history' | 'community';
  language: 'arabic' | 'english' | 'turkish' | 'french' | 'urdu';
  memberCount: number;
  inviteLink?: string;
  isPublic: boolean;
}

// This will be loaded from Supabase

const WhatsAppGroupJoin: React.FC = () => {
  const { toast } = useToast();
  const [groups, setGroups] = useState<WhatsAppGroup[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [filter, setFilter] = useState({
    category: 'all',
    language: 'all'
  });
  const [loading, setLoading] = useState(true);
  const [requestFormOpen, setRequestFormOpen] = useState(false);
  const [requestData, setRequestData] = useState({
    name: '',
    email: '',
    phone: '',
    reason: '',
    groupId: ''
  });
  
  // Fetch WhatsApp groups from Appwrite
  useEffect(() => {
    async function fetchGroups() {
      try {
        setLoading(true);
        const databases = appwriteService.databases;
        const databaseId = appwriteService.databaseId;
        const whatsappGroupsCollection = appwriteService.collections.whatsappGroups;
        
        // Fetch WhatsApp groups data
        const response = await databases.listDocuments(
          databaseId,
          whatsappGroupsCollection
        );
        
        if (response && response.documents) {
          // Map database documents to component props
          const mappedGroups = response.documents.map(group => ({
            id: group.$id,
            name: group.name,
            description: group.description,
            category: group.category as 'knowledge' | 'quran' | 'fiqh' | 'history' | 'community',
            language: group.language as 'arabic' | 'english' | 'turkish' | 'french' | 'urdu',
            memberCount: group.member_count,
            inviteLink: group.invite_link,
            isPublic: group.is_public
          }));
          setGroups(mappedGroups);
        }
      } catch (error) {
        console.error('Error fetching WhatsApp groups:', error);
        toast({
          variant: "destructive",
          title: "خطأ في جلب البيانات",
          description: "حدث خطأ أثناء تحميل المجموعات. يرجى المحاولة مرة أخرى."
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchGroups();
  }, [toast]);  // Include toast in dependencies
  
  // Handle joining a group
  const handleJoinGroup = async (group: WhatsAppGroup) => {
    if (group.isPublic && group.inviteLink) {
      window.open(group.inviteLink, '_blank');
      
      // Record this activity in Appwrite
      try {
        // Get current user from our Appwrite auth bridge
        const userData = await appwriteAuthBridge.getCurrentUser();
        
        if (userData) {
          const databases = appwriteService.databases;
          const databaseId = appwriteService.databaseId;
          const userActivitiesCollection = appwriteService.collections.userActivities;
          
          // Log the join action
          await databases.createDocument(
            databaseId,
            userActivitiesCollection,
            ID.unique(),
            {
              user_id: userData.userId,
              activity_type: 'whatsapp_group_join',
              details: { group_id: group.id, group_name: group.name }
            }
          );
          
          // Increment group member count (update the document)
          // Find the group first
          const whatsappGroupsCollection = appwriteService.collections.whatsappGroups;
          const response = await databases.getDocument(
            databaseId, 
            whatsappGroupsCollection, 
            group.id
          );
          
          // Then update the member count
          if (response) {
            await databases.updateDocument(
              databaseId,
              whatsappGroupsCollection,
              group.id,
              {
                member_count: (response.member_count || 0) + 1
              }
            );
          }
        }
      } catch (error) {
        console.error('Error logging group join:', error);
      }
      
      toast({
        title: "تم فتح رابط المجموعة",
        description: `انتقل إلى تطبيق واتساب للانضمام إلى "${group.name}"`
      });
    } else {
      // Open request form for private groups
      setRequestData(prev => ({ ...prev, groupId: group.id }));
      setRequestFormOpen(true);
    }
  };
  
  // Handle request form input change
  const handleRequestChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRequestData(prev => ({ ...prev, [name]: value }));
  };
  
  // Submit join request
  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Get current user from Appwrite auth bridge
      const userData = await appwriteAuthBridge.getCurrentUser();
      
      if (!userData) {
        toast({
          variant: "destructive",
          title: "يرجى تسجيل الدخول",
          description: "يجب تسجيل الدخول لإرسال طلب الانضمام"
        });
        return;
      }
      
      // Insert the join request in user_activities collection using Appwrite
      const databases = appwriteService.databases;
      const databaseId = appwriteService.databaseId;
      const userActivitiesCollection = appwriteService.collections.userActivities;
      
      await databases.createDocument(
        databaseId,
        userActivitiesCollection,
        ID.unique(),
        {
          user_id: userData.userId,
          activity_type: 'whatsapp_group_join_request',
          details: {
            group_id: requestData.groupId,
            name: requestData.name,
            phone: requestData.phone,
            reason: requestData.reason
          }
        }
      );
      
      toast({
        title: "تم إرسال الطلب",
        description: "تم إرسال طلبك للانضمام إلى المجموعة وسيتم مراجعته قريبًا",
      });
      
      // Close form and reset data
      setRequestFormOpen(false);
      setRequestData({
        name: '',
        email: '',
        phone: '',
        reason: '',
        groupId: ''
      });
    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
        variant: "destructive",
        title: "خطأ في إرسال الطلب",
        description: "حدث خطأ أثناء إرسال طلبك. يرجى المحاولة مرة أخرى لاحقًا."
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Filter groups based on category and language
  const getFilteredGroups = () => {
    return groups.filter(group => 
      (filter.category === 'all' || group.category === filter.category) &&
      (filter.language === 'all' || group.language === filter.language)
    );
  };
  
  // Get group for the current request
  const getRequestedGroup = () => {
    return groups.find(group => group.id === requestData.groupId);
  };
  
  // Language display map
  const languageDisplay: Record<string, string> = {
    'arabic': 'العربية',
    'english': 'الإنجليزية',
    'turkish': 'التركية',
    'french': 'الفرنسية',
    'urdu': 'الأردية',
    'all': 'الكل'
  };
  
  // Category display map
  const categoryDisplay: Record<string, string> = {
    'knowledge': 'المعرفة العامة',
    'quran': 'القرآن والتفسير',
    'fiqh': 'الفقه',
    'history': 'التاريخ الإسلامي',
    'community': 'المجتمع',
    'all': 'الكل'
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-right">مجموعات واتساب</CardTitle>
        <CardDescription className="text-right">
          انضم إلى مجموعات واتساب المتخصصة في المعرفة الإسلامية والتواصل مع المجتمع
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-6">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="all" className="flex items-center">
                <MessageSquare className="mr-2 h-4 w-4" />
                المجموعات المتاحة
              </TabsTrigger>
              <TabsTrigger value="create" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                إنشاء مجموعة جديدة
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Label>التصنيف:</Label>
                <Select 
                  value={filter.category}
                  onValueChange={(value) => setFilter(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="اختر التصنيف" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    <SelectItem value="quran">القرآن والتفسير</SelectItem>
                    <SelectItem value="fiqh">الفقه</SelectItem>
                    <SelectItem value="history">التاريخ الإسلامي</SelectItem>
                    <SelectItem value="knowledge">المعرفة العامة</SelectItem>
                    <SelectItem value="community">المجتمع</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Label>اللغة:</Label>
                <Select 
                  value={filter.language}
                  onValueChange={(value) => setFilter(prev => ({ ...prev, language: value }))}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="اختر اللغة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    <SelectItem value="arabic">العربية</SelectItem>
                    <SelectItem value="english">الإنجليزية</SelectItem>
                    <SelectItem value="turkish">التركية</SelectItem>
                    <SelectItem value="french">الفرنسية</SelectItem>
                    <SelectItem value="urdu">الأردية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {getFilteredGroups().map((group) => (
                <Card key={group.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">
                        <Users className="h-3 w-3 mr-1" />{group.memberCount} عضو
                      </Badge>
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <Badge variant="secondary">
                          {categoryDisplay[group.category]}
                        </Badge>
                        <Badge variant="outline">
                          <Globe className="h-3 w-3 mr-1" />{languageDisplay[group.language]}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-right line-clamp-3 h-16">{group.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button onClick={() => handleJoinGroup(group)}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      انضم للمجموعة
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              {getFilteredGroups().length === 0 && (
                <div className="col-span-full text-center py-12">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">لا توجد مجموعات مطابقة</h3>
                  <p className="text-muted-foreground mt-2">
                    حاول تغيير معايير التصفية أو التحقق لاحقًا
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">إنشاء مجموعة واتساب جديدة</CardTitle>
                <CardDescription className="text-right">
                  قم بملء النموذج التالي لإنشاء مجموعة جديدة وإضافتها إلى المنصة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="groupName" className="text-right block">اسم المجموعة</Label>
                      <Input id="groupName" className="text-right" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="groupCategory" className="text-right block">التصنيف</Label>
                      <Select>
                        <SelectTrigger id="groupCategory">
                          <SelectValue placeholder="اختر تصنيفًا" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="quran">القرآن والتفسير</SelectItem>
                          <SelectItem value="fiqh">الفقه</SelectItem>
                          <SelectItem value="history">التاريخ الإسلامي</SelectItem>
                          <SelectItem value="knowledge">المعرفة العامة</SelectItem>
                          <SelectItem value="community">المجتمع</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="groupLanguage" className="text-right block">اللغة الرئيسية</Label>
                      <Select>
                        <SelectTrigger id="groupLanguage">
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
                    
                    <div className="space-y-2">
                      <Label htmlFor="groupLink" className="text-right block">رابط الدعوة للمجموعة</Label>
                      <Input id="groupLink" placeholder="https://chat.whatsapp.com/..." className="dir-ltr text-left" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="groupDescription" className="text-right block">وصف المجموعة</Label>
                    <textarea 
                      id="groupDescription" 
                      rows={4}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background text-right"
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>
                      <Check className="mr-2 h-4 w-4" />
                      إرسال للمراجعة
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {requestFormOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-right">طلب الانضمام إلى المجموعة</CardTitle>
              <CardDescription className="text-right">
                {getRequestedGroup()?.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitRequest} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-right block">الاسم الكامل</Label>
                  <Input
                    id="name"
                    name="name"
                    value={requestData.name}
                    onChange={handleRequestChange}
                    required
                    className="text-right"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-right block">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={requestData.email}
                    onChange={handleRequestChange}
                    required
                    className="text-right"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-right block">رقم الهاتف (واتساب)</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={requestData.phone}
                    onChange={handleRequestChange}
                    required
                    className="text-right"
                    placeholder="+1234567890"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reason" className="text-right block">سبب طلب الانضمام</Label>
                  <textarea
                    id="reason"
                    name="reason"
                    rows={3}
                    value={requestData.reason}
                    onChange={handleRequestChange}
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background text-right"
                  ></textarea>
                </div>
                
                <div className="flex justify-between pt-2">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setRequestFormOpen(false)}
                  >
                    إلغاء
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner className="mr-2" />
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        إرسال الطلب
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </Card>
  );
};

export default WhatsAppGroupJoin;
