/**
 * JobOpeningsBoard.tsx
 * 
 * Component for displaying available job positions and opportunities
 * in Islamic organizations and Sabeel platform itself.
 * This component is now backend-agnostic, using a unified DataService.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
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
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";

// Import the unified DataService
import dataService from '@/services/DataService';
import { Collections } from '@/types/collections';

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
  const { toast } = useToast();
  const [allJobs, setAllJobs] = useState<JobPosition[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobPosition[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [applicationData, setApplicationData] = useState({
    name: '',
    email: '',
    phone: '',
    coverletter: '',
    resume: null as File | null,
  });
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch all jobs on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const jobListings = await dataService.listDocuments(Collections.JOB_OPENINGS);
        
        const formattedJobs = jobListings.map((job: any) => ({
          id: job.id,
          title: job.title || 'Untitled Position',
          organization: job.organization || 'Unknown Organization',
          location: job.location || 'Remote',
          type: job.employment_type || 'full-time',
          category: job.category || 'other',
          description: job.description || 'No description provided',
          requirements: job.skills_required || [],
          contactEmail: job.contact_email || 'contact@example.com',
          postedDate: job.posted_date ? new Date(job.posted_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          applicationDeadline: job.closing_date ? new Date(job.closing_date).toISOString().split('T')[0] : undefined,
          isRemote: job.is_remote || false,
        }));

        setAllJobs(formattedJobs);
        setFilteredJobs(formattedJobs);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load job openings. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Apply filters and search on the client side
  useEffect(() => {
    let jobs = allJobs;

    // Apply category filter
    if (filter !== 'all') {
      jobs = jobs.filter(job => job.category === filter);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const lowercasedQuery = searchQuery.toLowerCase();
      jobs = jobs.filter(job => 
        job.title.toLowerCase().includes(lowercasedQuery) ||
        job.organization.toLowerCase().includes(lowercasedQuery) ||
        job.description.toLowerCase().includes(lowercasedQuery)
      );
    }

    setFilteredJobs(jobs);
  }, [filter, searchQuery, allJobs]);

  // Handle filter change
  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is now reactive, this function just prevents form submission
  };

  // Handle application form input changes
  const handleApplicationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setApplicationData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file upload for resume
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setApplicationData(prev => ({
        ...prev,
        resume: e.target.files![0],
      }));
    }
  };

  // Handle application submission
  const handleSubmitApplication = async () => {
    if (!selectedJobId) return;

    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const currentUser = await dataService.getCurrentUser();
      if (!currentUser) {
        throw new Error('You must be logged in to apply.');
      }

      let resumeUrl = '';
      if (applicationData.resume) {
        const resumePath = await dataService.uploadFile('resumes', applicationData.resume);
        resumeUrl = dataService.getFilePreview('resumes', resumePath);
      }

      // Record the application in the user activity collection
      await dataService.createDocument(Collections.USER_ACTIVITIES, {
        user_id: currentUser.userId,
        activity_type: 'job_application',
        metadata: {
          job_id: selectedJobId,
          applicant_name: applicationData.name,
          applicant_email: applicationData.email,
          cover_letter: applicationData.coverletter,
          resume_url: resumeUrl,
        },
        status: 'submitted',
      });

      setSubmitResult({ success: true, message: 'Application submitted successfully!' });
      toast({ title: 'Success', description: 'Your application has been sent.' });

      // Close dialog after a short delay on success
      setTimeout(() => {
        setSelectedJobId(null);
      }, 2000);

    } catch (error: any) {
      console.error('Application submission error:', error);
      setSubmitResult({ success: false, message: `Submission failed: ${error.message}` });
      toast({ variant: 'destructive', title: 'Error', description: `Failed to submit application: ${error.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the category badge with appropriate color
  const renderCategoryBadge = (category: string) => {
    const categoryColors: Record<string, string> = {
      teaching: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
      research: 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100',
      tech: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
      admin: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
      community: 'bg-pink-100 text-pink-800 dark:bg-pink-800 dark:text-pink-100',
      other: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
    };
    
    return (
      <Badge className={`${categoryColors[category] || 'bg-gray-100 text-gray-800'}`}>
        {getCategoryLabel(category)}
      </Badge>
    );
  };

  // Get localized category label
  const getCategoryLabel = (category: string) => {
    const categoryLabels: Record<string, string> = {
      teaching: 'تعليم',
      research: 'بحث علمي',
      tech: 'تقنية',
      admin: 'إدارة',
      community: 'مجتمع',
      other: 'أخرى',
      all: 'جميع المجالات',
    };
    
    return categoryLabels[category] || category;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  // Get days remaining until deadline
  const getDaysRemaining = (deadline?: string) => {
    if (!deadline) return null;
    
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-right">فرص العمل</h2>
          <p className="text-gray-500 text-right mt-1">
            استعرض الوظائف المتاحة في المؤسسات والمنظمات الإسلامية
          </p>
        </div>
        
        <form onSubmit={handleSearchSubmit} className="flex w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="ابحث عن وظيفة..."
              className="pl-8 text-right w-full"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <Button type="submit" className="mr-2">بحث</Button>
        </form>
      </div>

      <Tabs defaultValue="all" onValueChange={handleFilterChange}>
        <TabsList className="grid grid-cols-3 md:grid-cols-7 h-auto">
          <TabsTrigger value="all">{getCategoryLabel('all')}</TabsTrigger>
          <TabsTrigger value="teaching">{getCategoryLabel('teaching')}</TabsTrigger>
          <TabsTrigger value="research">{getCategoryLabel('research')}</TabsTrigger>
          <TabsTrigger value="tech">{getCategoryLabel('tech')}</TabsTrigger>
          <TabsTrigger value="admin">{getCategoryLabel('admin')}</TabsTrigger>
          <TabsTrigger value="community">{getCategoryLabel('community')}</TabsTrigger>
          <TabsTrigger value="other">{getCategoryLabel('other')}</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Error alert */}
      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4 text-right">
          <p className="font-semibold">خطأ:</p>
          <p>{error}</p>
        </div>
      )}
      
      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
        </div>
      ) : (
        /* Job listings */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
              <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">لا توجد وظائف متاحة حالياً</h3>
              <p className="text-gray-500">
                لم نجد أي وظائف تطابق معايير البحث. يرجى المحاولة مرة أخرى لاحقاً.
              </p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <Card key={job.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-shrink-0">
                      {renderCategoryBadge(job.category)}
                    </div>
                    <div className="text-right">
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <CardDescription>{job.organization}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="text-right">
                  <div className="space-y-4">
                    <div className="flex justify-end items-center text-gray-500 space-x-4 space-x-reverse">
                      <div className="flex items-center">
                        <span>{job.location}</span>
                        <MapPin className="mr-1 h-4 w-4" />
                      </div>
                      {job.isRemote && (
                        <Badge variant="outline" className="mr-2">عن بعد</Badge>
                      )}
                    </div>
                    
                    <p className="line-clamp-3 text-gray-700">
                      {job.description}
                    </p>
                    
                    <div className="flex flex-wrap justify-end gap-2 text-xs">
                      {job.requirements.slice(0, 3).map((req, index) => (
                        <Badge key={index} variant="secondary">{req}</Badge>
                      ))}
                      {job.requirements.length > 3 && (
                        <Badge variant="secondary">+{job.requirements.length - 3}</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
                <Separator />
                <CardFooter className="pt-4 flex justify-between">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        onClick={() => setSelectedJobId(job.id)}
                        className="bg-sabeel-primary hover:bg-sabeel-primary/90"
                      >
                        التقديم للوظيفة
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle className="text-right">
                          التقديم لوظيفة: {job.title}
                        </DialogTitle>
                        <DialogDescription className="text-right">
                          أكمل النموذج التالي للتقدم لهذه الوظيفة
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-right block">الاسم *</Label>
                          <Input
                            id="name"
                            name="name"
                            placeholder="الاسم الكامل"
                            className="text-right"
                            value={applicationData.name}
                            onChange={handleApplicationChange}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-right block">البريد الإلكتروني *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="example@domain.com"
                            className="text-right"
                            value={applicationData.email}
                            onChange={handleApplicationChange}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-right block">رقم الهاتف</Label>
                          <Input
                            id="phone"
                            name="phone"
                            placeholder="رقم الهاتف"
                            className="text-right"
                            value={applicationData.phone}
                            onChange={handleApplicationChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="coverletter" className="text-right block">رسالة تقديم</Label>
                          <textarea
                            id="coverletter"
                            name="coverletter"
                            placeholder="اكتب نبذة عن نفسك وسبب اهتمامك بهذه الوظيفة"
                            className="w-full min-h-[100px] p-2 border border-gray-300 rounded-md text-right"
                            value={applicationData.coverletter}
                            onChange={handleApplicationChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="resume" className="text-right block">السيرة الذاتية</Label>
                          <Input
                            id="resume"
                            name="resume"
                            type="file"
                            className="text-right"
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx"
                          />
                          <p className="text-xs text-gray-500 text-right">
                            يمكنك إرفاق ملف PDF أو Word
                          </p>
                        </div>
                        
                        {submitResult && (
                          <div className={`p-3 rounded-md text-right ${
                            submitResult.success
                              ? 'bg-green-50 text-green-800'
                              : 'bg-red-50 text-red-800'
                          }`}>
                            {submitResult.message}
                          </div>
                        )}
                      </div>
                      <DialogFooter className="flex justify-between">
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          onClick={handleSubmitApplication}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                              جاري الإرسال...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              إرسال الطلب
                            </>
                          )}
                        </Button>
                        
                        <Button variant="outline" onClick={() => {
                          setSelectedJobId(null);
                          setSubmitResult(null);
                        }}>
                          إلغاء
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <div className="text-xs text-gray-500 text-right">
                    <div>تاريخ النشر: {formatDate(job.postedDate)}</div>
                    {job.applicationDeadline && (
                      <div className="flex items-center">
                        <Clock className="ml-1 h-3 w-3" />
                        <span>
                          {getDaysRemaining(job.applicationDeadline)} يوم متبقي
                        </span>
                      </div>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default JobOpeningsBoard;
