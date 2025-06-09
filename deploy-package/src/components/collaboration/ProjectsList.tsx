/**
 * ProjectsList.tsx
 * 
 * Displays a list of collaborative projects between scholars and technologists.
 * Projects are categorized by type and filtered based on user role and preferences.
 */

import React, { useState, useEffect } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  Code, 
  Users, 
  Calendar, 
  Clock, 
  AlertCircle,
  Search,
  Filter,
  CheckCircle,
  LucideShield,
  Database
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DataService from '@/services/DataService';
import NAMIService from '@/services/NAMIService';
import { Collections } from '@/types/collections';

// Project status types
type ProjectStatus = 'active' | 'planning' | 'completed' | 'needs_review';

// Project category types
type ProjectCategory = 'knowledge_protection' | 'education' | 'community' | 'ai_development' | 'research';

// Project interface
interface Project {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  scholarCount: number;
  techCount: number;
  createdAt: string;
  deadline?: string;
  requiredSkills: string[];
  requiredKnowledge: string[];
  leaderId: string;
  leaderName: string;
  leaderRole: 'scholar' | 'technologist' | 'both';
  needsScholar: boolean;
  needsTechnologist: boolean;
  aiProtection: boolean;
}

interface ProjectsListProps {
  userRole: 'scholar' | 'technologist' | 'both' | 'observer';
}

const ProjectsList: React.FC<ProjectsListProps> = ({ userRole }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Filter projects when active filter or search query changes
  useEffect(() => {
    filterProjects();
  }, [activeFilter, searchQuery, projects]);

  // Fetch projects from database
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await DataService.listDocuments(Collections.SCHOLAR_TECHNOLOGIST_PROJECTS);
      
      // Map backend data to project interface
      const mappedProjects: Project[] = data.map((project: any) => ({
        id: project.id,
        title: project.title,
        description: project.description,
        category: project.category,
        status: project.status,
        scholarCount: project.scholar_count || 0,
        techCount: project.tech_count || 0,
        createdAt: project.created_at,
        deadline: project.deadline,
        requiredSkills: project.required_skills || [],
        requiredKnowledge: project.required_knowledge || [],
        leaderId: project.leader_id,
        leaderName: project.leader_name,
        leaderRole: project.leader_role,
        needsScholar: project.needs_scholar,
        needsTechnologist: project.needs_technologist,
        aiProtection: project.ai_protection
      }));
      
      setProjects(mappedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        variant: 'destructive',
        title: 'خطأ في تحميل المشاريع',
        description: 'حدث خطأ أثناء تحميل المشاريع. يرجى المحاولة مرة أخرى.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter projects based on active filter and search query
  const filterProjects = () => {
    let filtered = [...projects];
    
    // Apply category/status filters
    if (activeFilter !== 'all') {
      if (activeFilter === 'needs_scholar') {
        filtered = filtered.filter(project => project.needsScholar);
      } else if (activeFilter === 'needs_technologist') {
        filtered = filtered.filter(project => project.needsTechnologist);
      } else if (activeFilter === 'ai_protection') {
        filtered = filtered.filter(project => project.aiProtection);
      } else {
        // Filter by category or status
        filtered = filtered.filter(
          project => project.category === activeFilter || project.status === activeFilter
        );
      }
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        project => 
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.leaderName.toLowerCase().includes(query) ||
          project.requiredSkills.some(skill => skill.toLowerCase().includes(query)) ||
          project.requiredKnowledge.some(knowledge => knowledge.toLowerCase().includes(query))
      );
    }
    
    setFilteredProjects(filtered);
  };

  // Create a new project
  const handleCreateProject = () => {
    // Navigate to project creation page or open modal
    toast({
      title: 'إنشاء مشروع جديد',
      description: 'تم تفعيل هذه الميزة قريباً.'
    });
  };

  // Join a project
  const handleJoinProject = (projectId: string) => {
    toast({
      title: 'طلب الانضمام',
      description: 'تم إرسال طلب الانضمام إلى المشروع، وسيتم إشعارك عند الرد.'
    });
  };

  // Get status badge
  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">نشط</Badge>;
      case 'planning':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">قيد التخطيط</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-gray-500">مكتمل</Badge>;
      case 'needs_review':
        return <Badge variant="default" className="bg-amber-500">يحتاج مراجعة</Badge>;
      default:
        return <Badge>غير معروف</Badge>;
    }
  };

  // Get category icon
  const getCategoryIcon = (category: ProjectCategory) => {
    switch (category) {
      case 'knowledge_protection':
        return <LucideShield className="h-5 w-5 text-red-500" />;
      case 'education':
        return <BookOpen className="h-5 w-5 text-amber-500" />;
      case 'community':
        return <Users className="h-5 w-5 text-blue-500" />;
      case 'ai_development':
        return <Code className="h-5 w-5 text-purple-500" />;
      case 'research':
        return <Database className="h-5 w-5 text-emerald-500" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  // Render loading skeleton
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 rounded-md animate-pulse mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 bg-gray-200 rounded-md animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  // Check if no projects
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium">لا توجد مشاريع متاحة حالياً</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          لم يتم العثور على أي مشاريع. يمكنك إنشاء مشروع جديد للبدء في التعاون.
        </p>
        <Button onClick={handleCreateProject} className="mt-4">
          إنشاء مشروع جديد
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="البحث عن مشاريع..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        
        <Button onClick={handleCreateProject} className="whitespace-nowrap">
          إنشاء مشروع جديد
        </Button>
      </div>

      {/* Project filters */}
      <Tabs value={activeFilter} onValueChange={setActiveFilter} className="mb-4">
        <TabsList className="w-full overflow-x-auto flex-nowrap">
          <TabsTrigger value="all">جميع المشاريع</TabsTrigger>
          <TabsTrigger value="active">المشاريع النشطة</TabsTrigger>
          <TabsTrigger value="planning">قيد التخطيط</TabsTrigger>
          <TabsTrigger value="needs_review">بحاجة للمراجعة</TabsTrigger>
          <TabsTrigger value="knowledge_protection">حماية المعرفة</TabsTrigger>
          <TabsTrigger value="ai_development">تطوير الذكاء الاصطناعي</TabsTrigger>
          {userRole === 'scholar' && <TabsTrigger value="needs_scholar">تحتاج علماء</TabsTrigger>}
          {userRole === 'technologist' && <TabsTrigger value="needs_technologist">تحتاج تقنيين</TabsTrigger>}
        </TabsList>
      </Tabs>

      {/* Projects grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-2" />
          <h3 className="text-base font-medium">لا توجد مشاريع تطابق معايير البحث</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            جرب تغيير معايير البحث أو الفلتر المستخدم.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <Card key={project.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex gap-2 items-center">
                    {getCategoryIcon(project.category)}
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                  </div>
                  {getStatusBadge(project.status)}
                </div>
                <CardDescription>{project.description.substring(0, 120)}...</CardDescription>
              </CardHeader>
              
              <CardContent className="pb-2">
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.aiProtection && (
                    <Badge variant="outline" className="border-emerald-500 text-emerald-500">
                      <LucideShield className="h-3 w-3 mr-1" />
                      حماية بالذكاء الاصطناعي
                    </Badge>
                  )}
                  {project.needsScholar && (
                    <Badge variant="outline" className="border-amber-500 text-amber-500">
                      <BookOpen className="h-3 w-3 mr-1" />
                      يحتاج علماء
                    </Badge>
                  )}
                  {project.needsTechnologist && (
                    <Badge variant="outline" className="border-blue-500 text-blue-500">
                      <Code className="h-3 w-3 mr-1" />
                      يحتاج تقنيين
                    </Badge>
                  )}
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{project.scholarCount} من العلماء و {project.techCount} من التقنيين</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>تاريخ البدء: {new Date(project.createdAt).toLocaleDateString('ar-SA')}</span>
                  </div>
                  
                  {project.deadline && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>الموعد النهائي: {new Date(project.deadline).toLocaleDateString('ar-SA')}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="pt-2">
                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={() => handleJoinProject(project.id)}
                  disabled={
                    (project.needsScholar === false && userRole === 'scholar') ||
                    (project.needsTechnologist === false && userRole === 'technologist')
                  }
                >
                  {(project.needsScholar === false && userRole === 'scholar') ||
                   (project.needsTechnologist === false && userRole === 'technologist')
                    ? 'المشروع مكتمل العضوية'
                    : 'الانضمام للمشروع'
                  }
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsList;
