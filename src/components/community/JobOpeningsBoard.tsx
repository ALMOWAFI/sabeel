/**
 * JobOpeningsBoard.tsx
 * 
 * Component for displaying available job positions and opportunities
 * in Islamic organizations and Sabeel platform itself
 */

import React, { useState, useEffect } from 'react';
import supabase from '@/lib/supabaseConfig';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Briefcase, MapPin, Clock, Filter, Search, ExternalLink, Send } from 'lucide-react';

// Job position interface
interface JobPosition {
  id: string;
  title: string;
  organization: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'volunteer' | 'internship' | 'remote';
  category: 'teaching' | 'research' | 'tech' | 'admin' | 'community' | 'other';
  description: string;
  requirements: string[];
  contactEmail: string;
  postedDate: string;
  applicationDeadline?: string;
  isRemote: boolean;
}

const JobOpeningsBoard: React.FC = () => {
  const [jobs, setJobs] = useState<JobPosition[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [applicationData, setApplicationData] = useState({
    name: '',
    email: '',
    phone: '',
    coverLetter: '',
    resumeUrl: ''
  });
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  
  // Fetch job openings from Supabase
  useEffect(() => {
    async function fetchJobs() {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('job_openings')
          .select('*')
          .eq('is_active', true)
          .order('posted_date', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        if (data) {
          // Map database columns to component props
          const mappedJobs = data.map(job => ({
            id: job.id,
            title: job.title,
            organization: job.organization,
            location: job.location,
            type: job.is_remote ? 'remote' : (job.employment_type || 'full-time') as 'full-time' | 'part-time' | 'contract' | 'volunteer' | 'internship' | 'remote',
            category: job.category as 'teaching' | 'research' | 'tech' | 'admin' | 'community' | 'other',
            description: job.description,
            requirements: job.skills_required || [],
            contactEmail: job.contact_email,
            postedDate: new Date(job.posted_date).toISOString().split('T')[0],
            applicationDeadline: job.closing_date ? new Date(job.closing_date).toISOString().split('T')[0] : undefined,
            isRemote: job.is_remote
          }));
          
          setJobs(mappedJobs);
        }
      } catch (error) {
        console.error('Error fetching job openings:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchJobs();
  }, []);  
  
  // Handle filter change
  const handleFilterChange = (value: string) => {
    setFilter(value);
  };
  
  // Handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Search jobs in Supabase using text search
      const { data, error } = await supabase
        .from('job_openings')
        .select('*')
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,organization.ilike.%${searchQuery}%`)
        .eq('is_active', true);
      
      if (error) throw error;
      
      if (data) {
        // Map database columns to component props as before
        const mappedJobs = data.map(job => ({
          id: job.id,
          title: job.title,
          organization: job.organization,
          location: job.location,
          type: job.is_remote ? 'remote' : (job.employment_type || 'full-time') as 'full-time' | 'part-time' | 'contract' | 'volunteer' | 'internship' | 'remote',
          category: job.category as 'teaching' | 'research' | 'tech' | 'admin' | 'community' | 'other',
          description: job.description,
          requirements: job.skills_required || [],
          contactEmail: job.contact_email,
          postedDate: new Date(job.posted_date).toISOString().split('T')[0],
          applicationDeadline: job.closing_date ? new Date(job.closing_date).toISOString().split('T')[0] : undefined,
          isRemote: job.is_remote
        }));
        
        setJobs(mappedJobs);
      }
    } catch (error) {
      console.error('Error searching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle application input change
  const handleApplicationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setApplicationData(prev => ({ ...prev, [name]: value }));
  };
  
  // Submit job application
  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('يرجى تسجيل الدخول أولاً قبل التقديم على الوظيفة');
        return;
      }
      
      // Store application in user_activities table
      const { error } = await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: 'job_application',
          details: {
            job_id: selectedJobId,
            name: applicationData.name,
            phone: applicationData.phone,
            coverLetter: applicationData.coverLetter,
            resumeUrl: applicationData.resumeUrl,
            applicationDate: new Date().toISOString()
          }
        });
      
      if (error) throw error;
      
      // Reset form
      setApplicationData({
        name: '',
        email: '',
        phone: '',
        coverLetter: '',
        resumeUrl: ''
      });
      
      setSelectedJobId(null);
      
      // Show success message
      alert('تم إرسال طلبك بنجاح!');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('حدث خطأ أثناء تقديم الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get filtered jobs
  const getFilteredJobs = () => {
    if (filter === 'all') return jobs;
    return jobs.filter(job => 
      filter === 'remote' ? job.isRemote : 
      job.type === filter || job.category === filter
    );
  };
  
  // Get selected job
  const getSelectedJob = () => {
    if (!selectedJobId) return null;
    return jobs.find(job => job.id === selectedJobId);
  };
  
  // Format date to localized string
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'غير محدد';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-SA');
    } catch (error) {
      return dateString;
    }
  };
  
  // Get type badge
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'full-time':
        return <Badge variant="default" className="bg-green-600">دوام كامل</Badge>;
      case 'part-time':
        return <Badge variant="default" className="bg-blue-600">دوام جزئي</Badge>;
      case 'contract':
        return <Badge variant="default" className="bg-amber-600">عقد</Badge>;
      case 'volunteer':
        return <Badge variant="default" className="bg-purple-600">تطوع</Badge>;
      case 'internship':
        return <Badge variant="default" className="bg-pink-600">تدريب</Badge>;
      case 'remote':
        return <Badge variant="default" className="bg-indigo-600">عن بعد</Badge>;
      default:
        return <Badge variant="outline">غير محدد</Badge>;
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-primary">فرص العمل والتطوع</h2>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <Input 
            placeholder="ابحث عن وظيفة..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <div className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin mr-2"></div>
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            بحث
          </Button>
        </form>
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Filter className="h-4 w-4" />
          <Label>تصفية:</Label>
          <select 
            className="border rounded p-2"
            value={filter}
            onChange={(e) => handleFilterChange(e.target.value)}
            disabled={isLoading}
          >
            <option value="all">جميع الوظائف</option>
            <option value="remote">عمل عن بعد</option>
            <option value="full-time">دوام كامل</option>
            <option value="part-time">دوام جزئي</option>
            <option value="contract">عقد</option>
            <option value="volunteer">تطوع</option>
            <option value="teaching">تدريس</option>
            <option value="research">بحث</option>
            <option value="tech">تقنية</option>
            <option value="admin">إدارة</option>
          </select>
        </div>
      </div>
      
      {isLoading && jobs.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg text-muted-foreground">جارِ تحميل فرص العمل...</p>
        </div>
      ) : (
        <Tabs defaultValue="all" onValueChange={handleFilterChange} className="w-full">
          <TabsList className="mb-6 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            <TabsTrigger value="all">الكل</TabsTrigger>
            <TabsTrigger value="teaching">تعليم</TabsTrigger>
            <TabsTrigger value="research">بحوث</TabsTrigger>
            <TabsTrigger value="tech">تقنية</TabsTrigger>
            <TabsTrigger value="admin">إدارة</TabsTrigger>
            <TabsTrigger value="remote">عن بعد</TabsTrigger>
            <TabsTrigger value="volunteer">تطوع</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6">
            {getFilteredJobs().length === 0 ? (
              <div className="text-center py-12 border rounded-lg">
                <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  لا توجد وظائف متاحة تطابق معايير البحث
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredJobs().map(job => (
                  <Card key={job.id} className="overflow-hidden transition-all hover:shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{job.title}</CardTitle>
                          <CardDescription>{job.organization}</CardDescription>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {getTypeBadge(job.type)}
                          {job.isRemote && <Badge variant="outline">عن بعد</Badge>}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="text-sm">
                      <div className="flex items-center justify-end mb-2 text-muted-foreground space-x-4 rtl:space-x-reverse">
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 ml-1" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 ml-1" />
                          <span>آخر موعد: {formatDate(job.applicationDeadline)}</span>
                        </div>
                      </div>
                      
                      <p className="text-right line-clamp-3 mb-4 h-16">
                        {job.description}
                      </p>
                      
                      <div className="flex justify-between items-center pt-2">
                        <Dialog onOpenChange={(open) => {
                          if (open) setSelectedJobId(job.id);
                        }}>
                          <DialogTrigger asChild>
                            <Button variant="default" size="sm">
                              <Send className="mr-1 h-3 w-3" />
                              تقديم طلب
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle className="text-right">
                                التقديم على وظيفة: {job.title}
                              </DialogTitle>
                              <DialogDescription className="text-right">
                                قم بتعبئة النموذج أدناه للتقديم على هذه الوظيفة في {job.organization}
                              </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmitApplication} className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="name" className="text-right block">الاسم الكامل</Label>
                                  <Input
                                    id="name"
                                    name="name"
                                    value={applicationData.name}
                                    onChange={handleApplicationChange}
                                    required
                                    className="text-right"
                                    disabled={isLoading}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="email" className="text-right block">البريد الإلكتروني</Label>
                                  <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={applicationData.email}
                                    onChange={handleApplicationChange}
                                    required
                                    className="text-right"
                                    disabled={isLoading}
                                  />
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="phone" className="text-right block">رقم الهاتف</Label>
                                <Input
                                  id="phone"
                                  name="phone"
                                  value={applicationData.phone}
                                  onChange={handleApplicationChange}
                                  className="text-right"
                                  disabled={isLoading}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="resumeUrl" className="text-right block">رابط السيرة الذاتية</Label>
                                <Input
                                  id="resumeUrl"
                                  name="resumeUrl"
                                  placeholder="https://drive.google.com/..."
                                  value={applicationData.resumeUrl}
                                  onChange={handleApplicationChange}
                                  className="text-right"
                                  disabled={isLoading}
                                />
                                <p className="text-xs text-muted-foreground text-right">
                                  يمكنك تقديم رابط لسيرتك الذاتية على Google Drive أو Dropbox أو OneDrive
                                </p>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="coverLetter" className="text-right block">رسالة تقديم</Label>
                                <textarea
                                  id="coverLetter"
                                  name="coverLetter"
                                  rows={5}
                                  value={applicationData.coverLetter}
                                  onChange={handleApplicationChange}
                                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background text-right"
                                  required
                                  disabled={isLoading}
                                ></textarea>
                              </div>
                              
                              <DialogFooter>
                                <Button type="submit" disabled={isLoading}>
                                  {isLoading ? (
                                    <div className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin mr-2"></div>
                                  ) : 'إرسال الطلب'}
                                </Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                        
                        <Button variant="outline" size="sm">
                          <ExternalLink className="mr-1 h-3 w-3" />
                          عرض التفاصيل
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Other tab contents will filter automatically by the handleFilterChange function */}
          <TabsContent value="teaching" className="space-y-6">
            {/* Using same structure as "all" tab but filtered by category */}
          </TabsContent>
          <TabsContent value="research" className="space-y-6">
            {/* Using same structure as "all" tab but filtered by category */}
          </TabsContent>
          <TabsContent value="tech" className="space-y-6">
            {/* Using same structure as "all" tab but filtered by category */}
          </TabsContent>
          <TabsContent value="admin" className="space-y-6">
            {/* Using same structure as "all" tab but filtered by category */}
          </TabsContent>
          <TabsContent value="remote" className="space-y-6">
            {/* Using same structure as "all" tab but filtered by category */}
          </TabsContent>
          <TabsContent value="volunteer" className="space-y-6">
            {/* Using same structure as "all" tab but filtered by category */}
          </TabsContent>
        </Tabs>
      )}
      
      <div className="text-center mt-8 border-t pt-6">
        <p className="text-sm text-muted-foreground">
          هل لديك فرصة عمل تريد الإعلان عنها؟{' '}
          <a href="/contact" className="text-primary font-medium hover:underline">
            تواصل معنا
          </a>
        </p>
      </div>
    </div>
  );
};

export default JobOpeningsBoard;
