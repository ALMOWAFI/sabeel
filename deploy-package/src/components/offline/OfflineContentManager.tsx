/**
 * OfflineContentManager.tsx
 * 
 * Component for managing offline content
 * Allows users to browse, download, and manage saved content for offline use
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { 
  Download, 
  Wifi, 
  WifiOff, 
  Book, 
  BookText, 
  Trash2, 
  AlertCircle,
  HardDrive, 
  CheckCircle, 
  BookOpen, 
  FileText,
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import offlineContentService, { 
  OfflineContentMetadata,
  OfflineContentType,
  DownloadProgress
} from '@/services/OfflineContentService';

// Format file size for display
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// Content item component
interface ContentItemProps {
  content: OfflineContentMetadata;
  onDownload: (contentId: string) => void;
  onDelete: (contentId: string) => void;
  downloadProgress?: DownloadProgress;
}

const ContentItem: React.FC<ContentItemProps> = ({
  content,
  onDownload,
  onDelete,
  downloadProgress
}) => {
  const isDownloading = downloadProgress?.status === 'downloading';
  const isDownloaded = content.isDownloaded;
  const hasError = downloadProgress?.status === 'error';
  
  // Icon based on content type
  const getContentIcon = (type: OfflineContentType) => {
    switch (type) {
      case 'quran':
        return <BookOpen className="h-5 w-5" />;
      case 'hadith':
        return <BookText className="h-5 w-5" />;
      case 'article':
        return <FileText className="h-5 w-5" />;
      case 'book':
        return <Book className="h-5 w-5" />;
      case 'dua':
        return <BookOpen className="h-5 w-5" />;
      case 'quiz':
        return <FileText className="h-5 w-5" />;
      case 'glossary':
        return <BookText className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mr-4">
            {getContentIcon(content.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div className="text-right truncate">
                <h3 className="text-base font-medium">{content.title}</h3>
                <div className="flex flex-wrap justify-end gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {content.type}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {content.language}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="mt-3 text-sm flex justify-between items-center">
              <span className="text-muted-foreground">
                {formatFileSize(content.size)}
              </span>
              <span className="text-muted-foreground text-xs">
                آخر تحديث: {new Date(content.lastUpdated).toLocaleDateString('ar-SA')}
              </span>
            </div>
            
            {(isDownloading || hasError) && (
              <div className="mt-3 space-y-1">
                {isDownloading && (
                  <>
                    <Progress value={downloadProgress?.progress || 0} className="h-1" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{downloadProgress?.progress || 0}%</span>
                      <span>
                        {formatFileSize(downloadProgress?.bytesDownloaded || 0)} / 
                        {formatFileSize(downloadProgress?.totalBytes || 0)}
                      </span>
                    </div>
                  </>
                )}
                
                {hasError && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>خطأ في التنزيل</AlertTitle>
                    <AlertDescription className="text-xs">
                      {downloadProgress?.error || 'حدث خطأ أثناء تنزيل المحتوى'}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          {isDownloaded ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onDelete(content.id)}
              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              حذف
            </Button>
          ) : isDownloading ? (
            <Button variant="outline" size="sm" disabled>
              <Spinner className="mr-2 h-4 w-4" />
              جاري التنزيل...
            </Button>
          ) : (
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => onDownload(content.id)}
            >
              <Download className="mr-2 h-4 w-4" />
              تنزيل
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Storage usage component
interface StorageUsageProps {
  used: number;
  available: number;
}

const StorageUsage: React.FC<StorageUsageProps> = ({ used, available }) => {
  const usagePercentage = Math.min(100, Math.round((used / available) * 100)) || 0;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">استخدام التخزين</CardTitle>
        <CardDescription className="text-right">
          مساحة التخزين المستخدمة للمحتوى غير المتصل
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <div className="flex items-center">
              <HardDrive className="h-4 w-4 mr-2" />
              <span>{formatFileSize(used)}</span>
            </div>
            <span className="text-muted-foreground">
              من أصل {formatFileSize(available)}
            </span>
          </div>
          
          <Progress value={usagePercentage} className="h-2" />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>المستخدم: {usagePercentage}%</span>
            <span>المتبقي: {formatFileSize(available - used)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main component
const OfflineContentManager: React.FC = () => {
  const { toast } = useToast();
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [availableContent, setAvailableContent] = useState<OfflineContentMetadata[]>([]);
  const [downloadedContent, setDownloadedContent] = useState<OfflineContentMetadata[]>([]);
  const [storageUsage, setStorageUsage] = useState<{ used: number; available: number }>({ used: 0, available: 0 });
  const [downloadProgress, setDownloadProgress] = useState<Record<string, DownloadProgress>>({});
  const [activeTab, setActiveTab] = useState<string>('available');
  
  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Check if online
        setIsOnline(offlineContentService.isOnline());
        
        // Get available content
        const content = await offlineContentService.getAvailableContent();
        setAvailableContent(content);
        
        // Get downloaded content
        const downloaded = content.filter(item => item.isDownloaded);
        setDownloadedContent(downloaded);
        
        // Get storage usage
        const usage = await offlineContentService.getStorageUsage();
        setStorageUsage(usage);
      } catch (error) {
        console.error('Error loading offline content data:', error);
        toast({
          variant: "destructive",
          title: "خطأ في تحميل البيانات",
          description: "تعذر تحميل بيانات المحتوى غير المتصل"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Set up online/offline listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    offlineContentService.registerConnectivityListeners(handleOnline, handleOffline);
    
    return () => {
      offlineContentService.unregisterConnectivityListeners(handleOnline, handleOffline);
    };
  }, [toast]);
  
  // Handle download content
  const handleDownload = async (contentId: string) => {
    try {
      // Find content item
      const contentItem = availableContent.find(item => item.id === contentId);
      if (!contentItem) return;
      
      // Check if online
      if (!isOnline) {
        toast({
          variant: "destructive",
          title: "أنت غير متصل",
          description: "يرجى الاتصال بالإنترنت لتنزيل المحتوى"
        });
        return;
      }
      
      // Check storage
      const usage = await offlineContentService.getStorageUsage();
      if (usage.available - usage.used < contentItem.requiredStorage) {
        toast({
          variant: "destructive",
          title: "مساحة غير كافية",
          description: `تحتاج إلى ${formatFileSize(contentItem.requiredStorage)} من المساحة المتاحة`
        });
        return;
      }
      
      // Start download
      offlineContentService.downloadContent(
        contentId,
        (progress) => {
          // Update progress
          setDownloadProgress(prev => ({
            ...prev,
            [contentId]: progress
          }));
          
          // If completed, refresh downloaded list
          if (progress.status === 'completed') {
            // Update content lists
            setAvailableContent(prev => 
              prev.map(item => 
                item.id === contentId ? { ...item, isDownloaded: true } : item
              )
            );
            
            setDownloadedContent(prev => {
              const exists = prev.some(item => item.id === contentId);
              if (exists) return prev;
              
              const newItem = availableContent.find(item => item.id === contentId);
              return newItem ? [...prev, { ...newItem, isDownloaded: true }] : prev;
            });
            
            // Refresh storage usage
            offlineContentService.getStorageUsage().then(setStorageUsage);
            
            // Show success toast
            toast({
              title: "تم التنزيل بنجاح",
              description: `تم تنزيل "${contentItem.title}" للاستخدام دون اتصال`,
              variant: "default"
            });
          }
          
          // If error, show toast
          if (progress.status === 'error') {
            toast({
              variant: "destructive",
              title: "فشل التنزيل",
              description: progress.error || "حدث خطأ أثناء تنزيل المحتوى"
            });
          }
        }
      );
    } catch (error) {
      console.error(`Error downloading content ${contentId}:`, error);
      toast({
        variant: "destructive",
        title: "فشل التنزيل",
        description: "حدث خطأ أثناء تنزيل المحتوى"
      });
    }
  };
  
  // Handle delete content
  const handleDelete = async (contentId: string) => {
    try {
      // Find content item
      const contentItem = availableContent.find(item => item.id === contentId);
      if (!contentItem) return;
      
      // Delete content
      const success = await offlineContentService.deleteContent(contentId);
      
      if (success) {
        // Update content lists
        setAvailableContent(prev => 
          prev.map(item => 
            item.id === contentId ? { ...item, isDownloaded: false } : item
          )
        );
        
        setDownloadedContent(prev => 
          prev.filter(item => item.id !== contentId)
        );
        
        // Refresh storage usage
        const usage = await offlineContentService.getStorageUsage();
        setStorageUsage(usage);
        
        // Show success toast
        toast({
          title: "تم الحذف بنجاح",
          description: `تم حذف "${contentItem.title}" من التخزين المحلي`,
          variant: "default"
        });
      } else {
        throw new Error('Failed to delete content');
      }
    } catch (error) {
      console.error(`Error deleting content ${contentId}:`, error);
      toast({
        variant: "destructive",
        title: "فشل الحذف",
        description: "حدث خطأ أثناء حذف المحتوى"
      });
    }
  };
  
  // Handle clear all content
  const handleClearAll = async () => {
    try {
      // Confirm with user
      if (!window.confirm('هل أنت متأكد من أنك تريد حذف كل المحتوى المحفوظ؟')) {
        return;
      }
      
      // Clear all content
      const success = await offlineContentService.clearAllContent();
      
      if (success) {
        // Update content lists
        setAvailableContent(prev => 
          prev.map(item => ({ ...item, isDownloaded: false }))
        );
        
        setDownloadedContent([]);
        
        // Refresh storage usage
        const usage = await offlineContentService.getStorageUsage();
        setStorageUsage(usage);
        
        // Show success toast
        toast({
          title: "تم حذف كل المحتوى",
          description: "تم حذف جميع المحتويات المحفوظة بنجاح",
          variant: "default"
        });
      } else {
        throw new Error('Failed to clear all content');
      }
    } catch (error) {
      console.error('Error clearing all content:', error);
      toast({
        variant: "destructive",
        title: "فشل حذف المحتوى",
        description: "حدث خطأ أثناء حذف المحتوى المحفوظ"
      });
    }
  };
  
  // Check for content updates
  const checkForUpdates = async () => {
    try {
      setLoading(true);
      
      // Check if online
      if (!isOnline) {
        toast({
          variant: "destructive",
          title: "أنت غير متصل",
          description: "يرجى الاتصال بالإنترنت للتحقق من التحديثات"
        });
        return;
      }
      
      // Check for updates
      const outdatedContent = await offlineContentService.checkForContentUpdates();
      
      // Refresh content lists
      const content = await offlineContentService.getAvailableContent();
      setAvailableContent(content);
      
      const downloaded = content.filter(item => item.isDownloaded);
      setDownloadedContent(downloaded);
      
      // Show results
      if (outdatedContent.length > 0) {
        toast({
          title: "تحديثات متاحة",
          description: `يوجد ${outdatedContent.length} محتوى بحاجة للتحديث`,
          variant: "default"
        });
      } else {
        toast({
          title: "المحتوى محدث",
          description: "كل المحتوى المحفوظ محدث",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
      toast({
        variant: "destructive",
        title: "فشل التحقق من التحديثات",
        description: "حدث خطأ أثناء التحقق من تحديثات المحتوى"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">المحتوى غير المتصل</h1>
          <p className="text-muted-foreground">
            إدارة المحتوى المحفوظ للاستخدام بدون اتصال بالإنترنت
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={checkForUpdates} disabled={loading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            تحديث
          </Button>
          <div className={`flex items-center px-3 py-1 rounded-md text-sm ${
            isOnline ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {isOnline ? (
              <>
                <Wifi className="h-4 w-4 mr-2" />
                متصل
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 mr-2" />
                غير متصل
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Storage usage */}
      <StorageUsage 
        used={storageUsage.used} 
        available={storageUsage.available} 
      />
      
      {!isOnline && downloadedContent.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>أنت غير متصل بالإنترنت</AlertTitle>
          <AlertDescription>
            لم يتم تنزيل أي محتوى للاستخدام دون اتصال. يرجى الاتصال بالإنترنت وتنزيل المحتوى.
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="available" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full md:w-[400px] mb-4">
          <TabsTrigger value="available">
            المحتوى المتاح
          </TabsTrigger>
          <TabsTrigger value="downloaded" className="relative">
            المحتوى المحفوظ
            {downloadedContent.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {downloadedContent.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="available">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
              {[...Array(6)].map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <div className="h-12 w-12 rounded-lg bg-muted"></div>
                      <div className="flex-1 ml-4 space-y-2">
                        <div className="h-5 bg-muted rounded w-3/4"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                        <div className="h-4 bg-muted rounded w-1/4"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableContent.length === 0 ? (
                <div className="col-span-full py-12 text-center">
                  <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">لا يوجد محتوى متاح</h3>
                  <p className="text-muted-foreground mt-2">
                    لم يتم العثور على أي محتوى متاح للتنزيل
                  </p>
                </div>
              ) : (
                availableContent.map(content => (
                  <ContentItem
                    key={content.id}
                    content={content}
                    onDownload={handleDownload}
                    onDelete={handleDelete}
                    downloadProgress={downloadProgress[content.id]}
                  />
                ))
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="downloaded">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
              {[...Array(3)].map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <div className="h-12 w-12 rounded-lg bg-muted"></div>
                      <div className="flex-1 ml-4 space-y-2">
                        <div className="h-5 bg-muted rounded w-3/4"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                        <div className="h-4 bg-muted rounded w-1/4"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {downloadedContent.length === 0 ? (
                <Card className="py-12 text-center">
                  <CardContent>
                    <Download className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">لا يوجد محتوى محفوظ</h3>
                    <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                      لم تقم بتنزيل أي محتوى للاستخدام غير المتصل بعد. قم بتنزيل المحتوى من علامة التبويب "المحتوى المتاح".
                    </p>
                    <div className="mt-6">
                      <Button onClick={() => setActiveTab('available')}>
                        استعراض المحتوى المتاح
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">
                      المحتوى المحفوظ ({downloadedContent.length})
                    </h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleClearAll}
                      className="text-red-500"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      حذف الكل
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {downloadedContent.map(content => (
                      <ContentItem
                        key={content.id}
                        content={content}
                        onDownload={handleDownload}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-right">عن المحتوى غير المتصل</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 ml-3 flex-shrink-0" />
              <p className="text-right">
                يمكنك تنزيل المحتوى الإسلامي الأساسي مثل القرآن الكريم والأحاديث للوصول إليه دون اتصال بالإنترنت.
              </p>
            </div>
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 ml-3 flex-shrink-0" />
              <p className="text-right">
                المحتوى المحفوظ متاح بالكامل حتى عندما تكون غير متصل بالإنترنت، مما يتيح لك مواصلة دراستك في أي وقت وأي مكان.
              </p>
            </div>
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 ml-3 flex-shrink-0" />
              <p className="text-right">
                يمكنك إدارة المساحة المستخدمة عن طريق حذف المحتوى الذي لم تعد بحاجة إليه دون اتصال.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfflineContentManager;
