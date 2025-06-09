/**
 * JobOpeningsBoard.tsx
 * 
 * Component for displaying available job positions and opportunities
 * in Islamic organizations and Sabeel platform itself
 * Using Appwrite backend
 */

import React, { useState, useEffect } from 'react';
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
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";

// Import centralized Appwrite services
import appwriteService from '@/services/AppwriteService';
import appwriteAuthBridge from '@/services/AppwriteAuthBridge';
import { Query, ID } from 'appwrite';

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
  const [jobs, setJobs] = useState<JobPosition[]>([]);
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

  // Database configuration from centralized service
  const databaseId = appwriteService.databaseId;
  const jobCollectionId = appwriteService.collections.jobOpenings; // Collection for jobs
  const activityCollectionId = appwriteService.collections.userActivities; // Collection for user activities

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  // Fetch jobs from Appwrite
  const fetchJobs = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Use the centralized appwriteService
      const databases = appwriteService.databases;
      
      // Create query based on filters
      let queries = [];
      if (filter !== 'all') {
        queries.push(Query.equal('category', filter));
      }
      
      // Fetch job listings
      const response = await databases.listDocuments(
        databaseId,
        jobCollectionId,
        queries
      );
      
      if (!response || !response.documents) {
        throw new Error('Failed to fetch job listings');
      }
      
      // Format the job data
      const formattedJobs = response.documents.map((job: any) => ({
        id: job.$id,
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
      
      setJobs(formattedJobs);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load job openings. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Search jobs
  const searchJobs = async () => {
    if (!searchQuery.trim()) {
      fetchJobs();
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch all documents and filter them on the client side
      // Using our unified DataService abstraction
      const databases = appwriteService.databases;
      
      const response = await databases.listDocuments(
        databaseId,
        jobCollectionId
      );
      
      if (!response || !response.documents) {
        throw new Error('Failed to fetch job listings');
      }
      
      // Filter jobs by title or description containing the search query
      const searchLower = searchQuery.toLowerCase();
      const filteredJobs = response.documents.filter((job: any) => {
        return (
          (job.title && job.title.toLowerCase().includes(searchLower)) ||
          (job.description && job.description.toLowerCase().includes(searchLower)) ||
          (job.organization && job.organization.toLowerCase().includes(searchLower))
        );
      });
      
      // If filter is applied, further filter by category
      const categoryFilteredJobs = filter !== 'all' 
        ? filteredJobs.filter((job: any) => job.category === filter)
        : filteredJobs;
      
      // Format the job data
      const formattedJobs = categoryFilteredJobs.map((job: any) => ({
        id: job.$id,
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
      
      setJobs(formattedJobs);
    } catch (err) {
      console.error('Error searching jobs:', err);
      setError('Failed to search job openings. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle filter change
  const handleFilterChange = (value: string) => {
    setFilter(value);
    
    // Re-fetch jobs with new filter
    if (searchQuery) {
      searchJobs();
    } else {
      fetchJobs();
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchJobs();
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
    
    // Validate form
    if (!applicationData.name || !applicationData.email) {
      setSubmitResult({
        success: false,
        message: 'Please fill in all required fields',
      });
      return;
    }
    
    setIsSubmitting(true);
    setSubmitResult(null);
    
    try {
      // Get the current user
      const userData = await appwriteAuthBridge.getCurrentUser();
      
      if (!userData) {
        setSubmitResult({
          success: false,
          message: 'You must be logged in to apply for jobs',
        });
        return;
      }
      
      // We would upload the resume to Appwrite Storage in a real implementation
      // For now, we'll just log that a resume was attached
      const resumeSubmitted = applicationData.resume !== null;
      
      // Save application to user_activities collection using our centralized service
      const databases = appwriteService.databases;
      const document = await databases.createDocument(
        databaseId,
        activityCollectionId,
        ID.unique(),
        {
          user_id: userData.userId,
          activity_type: 'job_application',
          details: {
            job_id: selectedJobId,
            name: applicationData.name,
            email: applicationData.email,
            phone: applicationData.phone,
            coverletter: applicationData.coverletter,
            resume_submitted: resumeSubmitted,
            application_date: new Date().toISOString(),
          }
        }
      );
      
      // Success
      setSubmitResult({
        success: true,
        message: 'Your application has been submitted successfully!',
      });
      
      // Reset form
      setApplicationData({
        name: '',
        email: '',
        phone: '',
        coverletter: '',
        resume: null,
      });
      
      // Close dialog after a short delay
      setTimeout(() => {
        setSelectedJobId(null);
      }, 2000);
      
    } catch (err) {
      console.error('Error submitting application:', err);
      setSubmitResult({
        success: false,
        message: 'Failed to submit your application. Please try again later.',
      });
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
          {jobs.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
              <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">لا توجد وظائف متاحة حالياً</h3>
              <p className="text-gray-500">
                لم نجد أي وظائف تطابق معايير البحث. يرجى المحاولة مرة أخرى لاحقاً.
              </p>
            </div>
          ) : (
            jobs.map((job) => (
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
