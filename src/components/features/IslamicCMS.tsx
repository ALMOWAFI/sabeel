import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import {
  PlusCircle, Trash2, Filter, Eye, Edit, 
  CheckCircle, Save, ArrowUpDown, Search
} from 'lucide-react';

// Content item interface
interface ContentItem {
  id: string;
  title: string;
  type: 'article' | 'hadith' | 'quran' | 'fiqh' | 'lecture';
  language: string;
  status: 'published' | 'draft' | 'review';
  author: string;
  createdAt: string;
  tags: string[];
}

const IslamicCMS: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('content');
  const [contentItems, setContentItems] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'أحكام الصيام في شهر رمضان',
      type: 'fiqh',
      language: 'arabic',
      status: 'published',
      author: 'د. أحمد محمد',
      createdAt: '2024-05-01',
      tags: ['رمضان', 'صيام', 'فقه']
    },
    {
      id: '2',
      title: 'Virtues of Ramadan',
      type: 'article',
      language: 'english',
      status: 'published',
      author: 'Dr. Abdullah Khan',
      createdAt: '2024-04-29',
      tags: ['ramadan', 'fasting', 'virtues']
    },
    {
      id: '3',
      title: 'تفسير سورة البقرة - الآيات 183-185',
      type: 'quran',
      language: 'arabic',
      status: 'review',
      author: 'د. محمد العثيمين',
      createdAt: '2024-04-25',
      tags: ['تفسير', 'البقرة', 'صيام']
    }
  ]);
  
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [editItem, setEditItem] = useState<ContentItem | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editType, setEditType] = useState<string>('');
  const [editLanguage, setEditLanguage] = useState<string>('');
  const [editStatus, setEditStatus] = useState<string>('');
  const [editTags, setEditTags] = useState<string>('');
  const [editContent, setEditContent] = useState<string>('');
  
  // Filter content items based on current filters and search
  const filteredItems = contentItems.filter(item => {
    const typeMatch = filterType === 'all' || item.type === filterType;
    const statusMatch = filterStatus === 'all' || item.status === filterStatus;
    const searchMatch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return typeMatch && statusMatch && searchMatch;
  });
  
  // Handle content edit
  const handleEdit = (item: ContentItem) => {
    setEditItem(item);
    setEditTitle(item.title);
    setEditType(item.type);
    setEditLanguage(item.language);
    setEditStatus(item.status);
    setEditTags(item.tags.join(', '));
    setEditContent('This is sample content for ' + item.title);
    
    setActiveTab('edit');
  };
  
  // Handle content deletion
  const handleDelete = (id: string) => {
    setContentItems(contentItems.filter(item => item.id !== id));
    toast({
      title: "تم حذف المحتوى",
      description: "تم حذف المحتوى بنجاح من نظام إدارة المحتوى",
    });
  };
  
  // Handle save content changes
  const handleSaveChanges = () => {
    if (!editItem) return;
    
    const updatedItems = contentItems.map(item => {
      if (item.id === editItem.id) {
        return {
          ...item,
          title: editTitle,
          type: editType as any,
          language: editLanguage,
          status: editStatus as any,
          tags: editTags.split(',').map(tag => tag.trim())
        };
      }
      return item;
    });
    
    setContentItems(updatedItems);
    setActiveTab('content');
    
    toast({
      title: "تم حفظ التغييرات",
      description: "تم تحديث المحتوى بنجاح",
    });
  };
  
  // Handle content creation
  const handleCreateContent = () => {
    const newId = (contentItems.length + 1).toString();
    
    const newItem: ContentItem = {
      id: newId,
      title: editTitle || 'محتوى جديد',
      type: (editType || 'article') as any,
      language: editLanguage || 'arabic',
      status: 'draft',
      author: 'المستخدم الحالي',
      createdAt: new Date().toISOString().split('T')[0],
      tags: editTags ? editTags.split(',').map(tag => tag.trim()) : []
    };
    
    setContentItems([newItem, ...contentItems]);
    setActiveTab('content');
    
    // Reset form
    setEditItem(null);
    setEditTitle('');
    setEditType('');
    setEditLanguage('');
    setEditStatus('');
    setEditTags('');
    setEditContent('');
    
    toast({
      title: "تم إنشاء المحتوى",
      description: "تم إنشاء محتوى جديد بنجاح",
    });
  };
  
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-sabeel-primary">نظام إدارة المحتوى الإسلامي</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">
            المحتوى
          </TabsTrigger>
          <TabsTrigger value="create">
            إنشاء محتوى جديد
          </TabsTrigger>
          <TabsTrigger value="edit" disabled={!editItem}>
            تحرير المحتوى
          </TabsTrigger>
        </TabsList>
        
        {/* Content Management Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>إدارة المحتوى</span>
                <Button onClick={() => {
                  setEditItem(null);
                  setEditTitle('');
                  setEditType('');
                  setEditLanguage('');
                  setEditStatus('');
                  setEditTags('');
                  setEditContent('');
                  setActiveTab('create');
                }}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  إنشاء محتوى
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Label>نوع المحتوى:</Label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="جميع الأنواع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأنواع</SelectItem>
                      <SelectItem value="article">مقالات</SelectItem>
                      <SelectItem value="hadith">أحاديث</SelectItem>
                      <SelectItem value="quran">قرآن وتفسير</SelectItem>
                      <SelectItem value="fiqh">فقه</SelectItem>
                      <SelectItem value="lecture">محاضرات</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <Label>الحالة:</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="جميع الحالات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="published">منشور</SelectItem>
                      <SelectItem value="review">قيد المراجعة</SelectItem>
                      <SelectItem value="draft">مسودة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2 ml-auto">
                  <Input
                    placeholder="بحث..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-[200px]"
                  />
                  <Button variant="outline" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Content Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">العنوان</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>اللغة</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>المؤلف</TableHead>
                    <TableHead>التصنيفات</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                        لا توجد نتائج مطابقة للبحث
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.type}</Badge>
                        </TableCell>
                        <TableCell>{item.language}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              item.status === 'published' ? 'default' :
                              item.status === 'review' ? 'secondary' : 'outline'
                            }
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.author}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {item.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Create Content Tab */}
        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>إنشاء محتوى جديد</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">العنوان</Label>
                    <Input
                      id="title"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="أدخل عنوان المحتوى"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">نوع المحتوى</Label>
                    <Select value={editType} onValueChange={setEditType}>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="اختر نوع المحتوى" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="article">مقال</SelectItem>
                        <SelectItem value="hadith">حديث</SelectItem>
                        <SelectItem value="quran">قرآن وتفسير</SelectItem>
                        <SelectItem value="fiqh">فقه</SelectItem>
                        <SelectItem value="lecture">محاضرة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="language">اللغة</Label>
                    <Select value={editLanguage} onValueChange={setEditLanguage}>
                      <SelectTrigger id="language">
                        <SelectValue placeholder="اختر لغة المحتوى" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="arabic">العربية</SelectItem>
                        <SelectItem value="english">الإنجليزية</SelectItem>
                        <SelectItem value="french">الفرنسية</SelectItem>
                        <SelectItem value="urdu">الأردية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tags">التصنيفات</Label>
                    <Input
                      id="tags"
                      value={editTags}
                      onChange={(e) => setEditTags(e.target.value)}
                      placeholder="أدخل التصنيفات مفصولة بفواصل"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">المحتوى</Label>
                  <Textarea
                    id="content"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="أدخل محتوى المقال..."
                    className="min-h-[300px]"
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setActiveTab('content')}>
                    إلغاء
                  </Button>
                  <Button onClick={handleCreateContent}>
                    <Save className="mr-2 h-4 w-4" />
                    إنشاء محتوى
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Edit Content Tab */}
        <TabsContent value="edit" className="space-y-4">
          {editItem && (
            <Card>
              <CardHeader>
                <CardTitle>تحرير المحتوى: {editItem.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-title">العنوان</Label>
                      <Input
                        id="edit-title"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-type">نوع المحتوى</Label>
                      <Select value={editType} onValueChange={setEditType}>
                        <SelectTrigger id="edit-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="article">مقال</SelectItem>
                          <SelectItem value="hadith">حديث</SelectItem>
                          <SelectItem value="quran">قرآن وتفسير</SelectItem>
                          <SelectItem value="fiqh">فقه</SelectItem>
                          <SelectItem value="lecture">محاضرة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-language">اللغة</Label>
                      <Select value={editLanguage} onValueChange={setEditLanguage}>
                        <SelectTrigger id="edit-language">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="arabic">العربية</SelectItem>
                          <SelectItem value="english">الإنجليزية</SelectItem>
                          <SelectItem value="french">الفرنسية</SelectItem>
                          <SelectItem value="urdu">الأردية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-status">الحالة</Label>
                      <Select value={editStatus} onValueChange={setEditStatus}>
                        <SelectTrigger id="edit-status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="published">منشور</SelectItem>
                          <SelectItem value="review">قيد المراجعة</SelectItem>
                          <SelectItem value="draft">مسودة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-tags">التصنيفات</Label>
                      <Input
                        id="edit-tags"
                        value={editTags}
                        onChange={(e) => setEditTags(e.target.value)}
                        placeholder="أدخل التصنيفات مفصولة بفواصل"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-content">المحتوى</Label>
                    <Textarea
                      id="edit-content"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[300px]"
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setActiveTab('content')}>
                      إلغاء
                    </Button>
                    <Button onClick={handleSaveChanges}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      حفظ التغييرات
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IslamicCMS;
