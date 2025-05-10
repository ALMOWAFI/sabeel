import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, BookOpen, Users, CheckCircle } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  code: string;
  instructor: string;
  progress: number;
  nextAssignment?: {
    title: string;
    dueDate: string;
  };
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'assignment' | 'lecture' | 'exam' | 'other';
  course?: string;
}

export function CanvasDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch Canvas LMS data
    setTimeout(() => {
      // Mock courses data
      const mockCourses = [
        {
          id: '1',
          title: 'أصول الفقه',
          code: 'ISL-301',
          instructor: 'د. محمد عبدالله',
          progress: 65,
          nextAssignment: {
            title: 'تحليل نصوص من كتاب الرسالة للإمام الشافعي',
            dueDate: '2023-06-20'
          }
        },
        {
          id: '2',
          title: 'علوم القرآن',
          code: 'QUR-201',
          instructor: 'د. أحمد الزهراني',
          progress: 42,
          nextAssignment: {
            title: 'بحث في أسباب النزول',
            dueDate: '2023-06-18'
          }
        },
        {
          id: '3',
          title: 'اللغة العربية المتقدمة',
          code: 'ARB-401',
          instructor: 'د. سارة المهدي',
          progress: 78
        }
      ];

      // Mock calendar events
      const mockEvents = [
        { id: '1', title: 'محاضرة أصول الفقه', date: '2023-06-15', type: 'lecture', course: 'أصول الفقه' },
        { id: '2', title: 'تسليم بحث أسباب النزول', date: '2023-06-18', type: 'assignment', course: 'علوم القرآن' },
        { id: '3', title: 'اختبار منتصف الفصل', date: '2023-06-22', type: 'exam', course: 'اللغة العربية المتقدمة' },
        { id: '4', title: 'حلقة نقاش', date: '2023-06-25', type: 'other', course: 'أصول الفقه' }
      ];

      setCourses(mockCourses);
      setEvents(mockEvents);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="courses">
        <TabsList className="mb-4">
          <TabsTrigger value="courses">المقررات الدراسية</TabsTrigger>
          <TabsTrigger value="calendar">التقويم الأكاديمي</TabsTrigger>
          <TabsTrigger value="assignments">الواجبات</TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="calendar">
          <CalendarView events={events} />
        </TabsContent>
        
        <TabsContent value="assignments">
          <AssignmentsList courses={courses} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{course.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{course.code}</p>
          </div>
          <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
            {course.progress}%
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{course.instructor}</span>
          </div>
          
          {course.nextAssignment && (
            <div className="border-t pt-2 mt-2">
              <p className="text-xs text-muted-foreground mb-1">الواجب القادم:</p>
              <p className="text-sm font-medium">{course.nextAssignment.title}</p>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <Clock className="mr-1 h-3 w-3" />
                <span>تاريخ التسليم: {course.nextAssignment.dueDate}</span>
              </div>
            </div>
          )}
          
          <Button variant="outline" size="sm" className="w-full mt-2">
            عرض المقرر
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CalendarView({ events }: { events: CalendarEvent[] }) {
  // Group events by date
  const eventsByDate = events.reduce((acc, event) => {
    const date = event.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);

  // Sort dates
  const sortedDates = Object.keys(eventsByDate).sort();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          التقويم الأكاديمي
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sortedDates.map(date => (
            <div key={date} className="border-b pb-4 last:border-0">
              <h3 className="font-medium text-lg mb-3">{new Date(date).toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
              <div className="space-y-3">
                {eventsByDate[date].map(event => (
                  <div key={event.id} className="flex items-start space-x-4 rtl:space-x-reverse p-3 border rounded-md">
                    <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full 
                      ${event.type === 'lecture' ? 'bg-blue-100 text-blue-600' : ''}
                      ${event.type === 'assignment' ? 'bg-amber-100 text-amber-600' : ''}
                      ${event.type === 'exam' ? 'bg-red-100 text-red-600' : ''}
                      ${event.type === 'other' ? 'bg-purple-100 text-purple-600' : ''}
                    `}>
                      {event.type === 'lecture' && <BookOpen className="h-5 w-5" />}
                      {event.type === 'assignment' && <CheckCircle className="h-5 w-5" />}
                      {event.type === 'exam' && <span className="font-bold">E</span>}
                      {event.type === 'other' && <span className="font-bold">O</span>}
                    </div>
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      {event.course && <p className="text-sm text-muted-foreground">{event.course}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AssignmentsList({ courses }: { courses: Course[] }) {
  // Filter courses with upcoming assignments
  const coursesWithAssignments = courses.filter(course => course.nextAssignment);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">الواجبات القادمة</CardTitle>
      </CardHeader>
      <CardContent>
        {coursesWithAssignments.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">لا توجد واجبات قادمة</p>
        ) : (
          <div className="space-y-4">
            {coursesWithAssignments.map(course => (
              <div key={course.id} className="border rounded-md p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{course.nextAssignment?.title}</h3>
                    <p className="text-sm text-muted-foreground">{course.title} ({course.code})</p>
                  </div>
                  <div className="text-sm font-medium">
                    {course.nextAssignment?.dueDate}
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button size="sm">تسليم الواجب</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, BookOpen, Users, CheckCircle } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  code: string;
  instructor: string;
  progress: number;
  nextAssignment?: {
    title: string;
    dueDate: string;
  };
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'assignment' | 'lecture' | 'exam' | 'other';
  course?: string;
}

export function CanvasDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch Canvas LMS data
    setTimeout(() => {
      // Mock courses data
      const mockCourses = [
        {
          id: '1',
          title: 'أصول الفقه',
          code: 'ISL-301',
          instructor: 'د. محمد عبدالله',
          progress: 65,
          nextAssignment: {
            title: 'تحليل نصوص من كتاب الرسالة للإمام الشافعي',
            dueDate: '2023-06-20'
          }
        },
        {
          id: '2',
          title: 'علوم القرآن',
          code: 'QUR-201',
          instructor: 'د. أحمد الزهراني',
          progress: 42,
          nextAssignment: {
            title: 'بحث في أسباب النزول',
            dueDate: '2023-06-18'
          }
        },
        {
          id: '3',
          title: 'اللغة العربية المتقدمة',
          code: 'ARB-401',
          instructor: 'د. سارة المهدي',
          progress: 78
        }
      ];

      // Mock calendar events
      const mockEvents = [
        { id: '1', title: 'محاضرة أصول الفقه', date: '2023-06-15', type: 'lecture', course: 'أصول الفقه' },
        { id: '2', title: 'تسليم بحث أسباب النزول', date: '2023-06-18', type: 'assignment', course: 'علوم القرآن' },
        { id: '3', title: 'اختبار منتصف الفصل', date: '2023-06-22', type: 'exam', course: 'اللغة العربية المتقدمة' },
        { id: '4', title: 'حلقة نقاش', date: '2023-06-25', type: 'other', course: 'أصول الفقه' }
      ];

      setCourses(mockCourses);
      setEvents(mockEvents);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="courses">
        <TabsList className="mb-4">
          <TabsTrigger value="courses">المقررات الدراسية</TabsTrigger>
          <TabsTrigger value="calendar">التقويم الأكاديمي</TabsTrigger>
          <TabsTrigger value="assignments">الواجبات</TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="calendar">
          <CalendarView events={events} />
        </TabsContent>
        
        <TabsContent value="assignments">
          <AssignmentsList courses={courses} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{course.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{course.code}</p>
          </div>
          <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
            {course.progress}%
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{course.instructor}</span>
          </div>
          
          {course.nextAssignment && (
            <div className="border-t pt-2 mt-2">
              <p className="text-xs text-muted-foreground mb-1">الواجب القادم:</p>
              <p className="text-sm font-medium">{course.nextAssignment.title}</p>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <Clock className="mr-1 h-3 w-3" />
                <span>تاريخ التسليم: {course.nextAssignment.dueDate}</span>
              </div>
            </div>
          )}
          
          <Button variant="outline" size="sm" className="w-full mt-2">
            عرض المقرر
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CalendarView({ events }: { events: CalendarEvent[] }) {
  // Group events by date
  const eventsByDate = events.reduce((acc, event) => {
    const date = event.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);

  // Sort dates
  const sortedDates = Object.keys(eventsByDate).sort();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          التقويم الأكاديمي
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sortedDates.map(date => (
            <div key={date} className="border-b pb-4 last:border-0">
              <h3 className="font-medium text-lg mb-3">{new Date(date).toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
              <div className="space-y-3">
                {eventsByDate[date].map(event => (
                  <div key={event.id} className="flex items-start space-x-4 rtl:space-x-reverse p-3 border rounded-md">
                    <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full 
                      ${event.type === 'lecture' ? 'bg-blue-100 text-blue-600' : ''}
                      ${event.type === 'assignment' ? 'bg-amber-100 text-amber-600' : ''}
                      ${event.type === 'exam' ? 'bg-red-100 text-red-600' : ''}
                      ${event.type === 'other' ? 'bg-purple-100 text-purple-600' : ''}
                    `}>
                      {event.type === 'lecture' && <BookOpen className="h-5 w-5" />}
                      {event.type === 'assignment' && <CheckCircle className="h-5 w-5" />}
                      {event.type === 'exam' && <span className="font-bold">E</span>}
                      {event.type === 'other' && <span className="font-bold">O</span>}
                    </div>
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      {event.course && <p className="text-sm text-muted-foreground">{event.course}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AssignmentsList({ courses }: { courses: Course[] }) {
  // Filter courses with upcoming assignments
  const coursesWithAssignments = courses.filter(course => course.nextAssignment);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">الواجبات القادمة</CardTitle>
      </CardHeader>
      <CardContent>
        {coursesWithAssignments.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">لا توجد واجبات قادمة</p>
        ) : (
          <div className="space-y-4">
            {coursesWithAssignments.map(course => (
              <div key={course.id} className="border rounded-md p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{course.nextAssignment?.title}</h3>
                    <p className="text-sm text-muted-foreground">{course.title} ({course.code})</p>
                  </div>
                  <div className="text-sm font-medium">
                    {course.nextAssignment?.dueDate}
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button size="sm">تسليم الواجب</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, BookOpen, Users, CheckCircle } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  code: string;
  instructor: string;
  progress: number;
  nextAssignment?: {
    title: string;
    dueDate: string;
  };
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'assignment' | 'lecture' | 'exam' | 'other';
  course?: string;
}

export function CanvasDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch Canvas LMS data
    setTimeout(() => {
      // Mock courses data
      const mockCourses = [
        {
          id: '1',
          title: 'أصول الفقه',
          code: 'ISL-301',
          instructor: 'د. محمد عبدالله',
          progress: 65,
          nextAssignment: {
            title: 'تحليل نصوص من كتاب الرسالة للإمام الشافعي',
            dueDate: '2023-06-20'
          }
        },
        {
          id: '2',
          title: 'علوم القرآن',
          code: 'QUR-201',
          instructor: 'د. أحمد الزهراني',
          progress: 42,
          nextAssignment: {
            title: 'بحث في أسباب النزول',
            dueDate: '2023-06-18'
          }
        },
        {
          id: '3',
          title: 'اللغة العربية المتقدمة',
          code: 'ARB-401',
          instructor: 'د. سارة المهدي',
          progress: 78
        }
      ];

      // Mock calendar events
      const mockEvents = [
        { id: '1', title: 'محاضرة أصول الفقه', date: '2023-06-15', type: 'lecture', course: 'أصول الفقه' },
        { id: '2', title: 'تسليم بحث أسباب النزول', date: '2023-06-18', type: 'assignment', course: 'علوم القرآن' },
        { id: '3', title: 'اختبار منتصف الفصل', date: '2023-06-22', type: 'exam', course: 'اللغة العربية المتقدمة' },
        { id: '4', title: 'حلقة نقاش', date: '2023-06-25', type: 'other', course: 'أصول الفقه' }
      ];

      setCourses(mockCourses);
      setEvents(mockEvents);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="courses">
        <TabsList className="mb-4">
          <TabsTrigger value="courses">المقررات الدراسية</TabsTrigger>
          <TabsTrigger value="calendar">التقويم الأكاديمي</TabsTrigger>
          <TabsTrigger value="assignments">الواجبات</TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="calendar">
          <CalendarView events={events} />
        </TabsContent>
        
        <TabsContent value="assignments">
          <AssignmentsList courses={courses} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{course.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{course.code}</p>
          </div>
          <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
            {course.progress}%
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{course.instructor}</span>
          </div>
          
          {course.nextAssignment && (
            <div className="border-t pt-2 mt-2">
              <p className="text-xs text-muted-foreground mb-1">الواجب القادم:</p>
              <p className="text-sm font-medium">{course.nextAssignment.title}</p>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <Clock className="mr-1 h-3 w-3" />
                <span>تاريخ التسليم: {course.nextAssignment.dueDate}</span>
              </div>
            </div>
          )}
          
          <Button variant="outline" size="sm" className="w-full mt-2">
            عرض المقرر
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CalendarView({ events }: { events: CalendarEvent[] }) {
  // Group events by date
  const eventsByDate = events.reduce((acc, event) => {
    const date = event.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);

  // Sort dates
  const sortedDates = Object.keys(eventsByDate).sort();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          التقويم الأكاديمي
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sortedDates.map(date => (
            <div key={date} className="border-b pb-4 last:border-0">
              <h3 className="font-medium text-lg mb-3">{new Date(date).toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
              <div className="space-y-3">
                {eventsByDate[date].map(event => (
                  <div key={event.id} className="flex items-start space-x-4 rtl:space-x-reverse p-3 border rounded-md">
                    <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full 
                      ${event.type === 'lecture' ? 'bg-blue-100 text-blue-600' : ''}
                      ${event.type === 'assignment' ? 'bg-amber-100 text-amber-600' : ''}
                      ${event.type === 'exam' ? 'bg-red-100 text-red-600' : ''}
                      ${event.type === 'other' ? 'bg-purple-100 text-purple-600' : ''}
                    `}>
                      {event.type === 'lecture' && <BookOpen className="h-5 w-5" />}
                      {event.type === 'assignment' && <CheckCircle className="h-5 w-5" />}
                      {event.type === 'exam' && <span className="font-bold">E</span>}
                      {event.type === 'other' && <span className="font-bold">O</span>}
                    </div>
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      {event.course && <p className="text-sm text-muted-foreground">{event.course}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AssignmentsList({ courses }: { courses: Course[] }) {
  // Filter courses with upcoming assignments
  const coursesWithAssignments = courses.filter(course => course.nextAssignment);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">الواجبات القادمة</CardTitle>
      </CardHeader>
      <CardContent>
        {coursesWithAssignments.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">لا توجد واجبات قادمة</p>
        ) : (
          <div className="space-y-4">
            {coursesWithAssignments.map(course => (
              <div key={course.id} className="border rounded-md p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{course.nextAssignment?.title}</h3>
                    <p className="text-sm text-muted-foreground">{course.title} ({course.code})</p>
                  </div>
                  <div className="text-sm font-medium">
                    {course.nextAssignment?.dueDate}
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button size="sm">تسليم الواجب</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, BookOpen, Users, CheckCircle } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  code: string;
  instructor: string;
  progress: number;
  nextAssignment?: {
    title: string;
    dueDate: string;
  };
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'assignment' | 'lecture' | 'exam' | 'other';
  course?: string;
}

export function CanvasDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch Canvas LMS data
    setTimeout(() => {
      // Mock courses data
      const mockCourses = [
        {
          id: '1',
          title: 'أصول الفقه',
          code: 'ISL-301',
          instructor: 'د. محمد عبدالله',
          progress: 65,
          nextAssignment: {
            title: 'تحليل نصوص من كتاب الرسالة للإمام الشافعي',
            dueDate: '2023-06-20'
          }
        },
        {
          id: '2',
          title: 'علوم القرآن',
          code: 'QUR-201',
          instructor: 'د. أحمد الزهراني',
          progress: 42,
          nextAssignment: {
            title: 'بحث في أسباب النزول',
            dueDate: '2023-06-18'
          }
        },
        {
          id: '3',
          title: 'اللغة العربية المتقدمة',
          code: 'ARB-401',
          instructor: 'د. سارة المهدي',
          progress: 78
        }
      ];

      // Mock calendar events
      const mockEvents = [
        { id: '1', title: 'محاضرة أصول الفقه', date: '2023-06-15', type: 'lecture', course: 'أصول الفقه' },
        { id: '2', title: 'تسليم بحث أسباب النزول', date: '2023-06-18', type: 'assignment', course: 'علوم القرآن' },
        { id: '3', title: 'اختبار منتصف الفصل', date: '2023-06-22', type: 'exam', course: 'اللغة العربية المتقدمة' },
        { id: '4', title: 'حلقة نقاش', date: '2023-06-25', type: 'other', course: 'أصول الفقه' }
      ];

      setCourses(mockCourses);
      setEvents(mockEvents);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="courses">
        <TabsList className="mb-4">
          <TabsTrigger value="courses">المقررات الدراسية</TabsTrigger>
          <TabsTrigger value="calendar">التقويم الأكاديمي</TabsTrigger>
          <TabsTrigger value="assignments">الواجبات</TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="calendar">
          <CalendarView events={events} />
        </TabsContent>
        
        <TabsContent value="assignments">
          <AssignmentsList courses={courses} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{course.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{course.code}</p>
          </div>
          <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
            {course.progress}%
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{course.instructor}</span>
          </div>
          
          {course.nextAssignment && (
            <div className="border-t pt-2 mt-2">
              <p className="text-xs text-muted-foreground mb-1">الواجب القادم:</p>
              <p className="text-sm font-medium">{course.nextAssignment.title}</p>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <Clock className="mr-1 h-3 w-3" />
                <span>تاريخ التسليم: {course.nextAssignment.dueDate}</span>
              </div>
            </div>
          )}
          
          <Button variant="outline" size="sm" className="w-full mt-2">
            عرض المقرر
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CalendarView({ events }: { events: CalendarEvent[] }) {
  // Group events by date
  const eventsByDate = events.reduce((acc, event) => {
    const date = event.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);

  // Sort dates
  const sortedDates = Object.keys(eventsByDate).sort();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          التقويم الأكاديمي
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sortedDates.map(date => (
            <div key={date} className="border-b pb-4 last:border-0">
              <h3 className="font-medium text-lg mb-3">{new Date(date).toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
              <div className="space-y-3">
                {eventsByDate[date].map(event => (
                  <div key={event.id} className="flex items-start space-x-4 rtl:space-x-reverse p-3 border rounded-md">
                    <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full 
                      ${event.type === 'lecture' ? 'bg-blue-100 text-blue-600' : ''}
                      ${event.type === 'assignment' ? 'bg-amber-100 text-amber-600' : ''}
                      ${event.type === 'exam' ? 'bg-red-100 text-red-600' : ''}
                      ${event.type === 'other' ? 'bg-purple-100 text-purple-600' : ''}
                    `}>
                      {event.type === 'lecture' && <BookOpen className="h-5 w-5" />}
                      {event.type === 'assignment' && <CheckCircle className="h-5 w-5" />}
                      {event.type === 'exam' && <span className="font-bold">E</span>}
                      {event.type === 'other' && <span className="font-bold">O</span>}
                    </div>
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      {event.course && <p className="text-sm text-muted-foreground">{event.course}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AssignmentsList({ courses }: { courses: Course[] }) {
  // Filter courses with upcoming assignments
  const coursesWithAssignments = courses.filter(course => course.nextAssignment);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">الواجبات القادمة</CardTitle>
      </CardHeader>
      <CardContent>
        {coursesWithAssignments.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">لا توجد واجبات قادمة</p>
        ) : (
          <div className="space-y-4">
            {coursesWithAssignments.map(course => (
              <div key={course.id} className="border rounded-md p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{course.nextAssignment?.title}</h3>
                    <p className="text-sm text-muted-foreground">{course.title} ({course.code})</p>
                  </div>
                  <div className="text-sm font-medium">
                    {course.nextAssignment?.dueDate}
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button size="sm">تسليم الواجب</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, BookOpen, Users, CheckCircle } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  code: string;
  instructor: string;
  progress: number;
  nextAssignment?: {
    title: string;
    dueDate: string;
  };
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'assignment' | 'lecture' | 'exam' | 'other';
  course?: string;
}

export function CanvasDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch Canvas LMS data
    setTimeout(() => {
      // Mock courses data
      const mockCourses = [
        {
          id: '1',
          title: 'أصول الفقه',
          code: 'ISL-301',
          instructor: 'د. محمد عبدالله',
          progress: 65,
          nextAssignment: {
            title: 'تحليل نصوص من كتاب الرسالة للإمام الشافعي',
            dueDate: '2023-06-20'
          }
        },
        {
          id: '2',
          title: 'علوم القرآن',
          code: 'QUR-201',
          instructor: 'د. أحمد الزهراني',
          progress: 42,
          nextAssignment: {
            title: 'بحث في أسباب النزول',
            dueDate: '2023-06-18'
          }
        },
        {
          id: '3',
          title: 'اللغة العربية المتقدمة',
          code: 'ARB-401',
          instructor: 'د. سارة المهدي',
          progress: 78
        }
      ];

      // Mock calendar events
      const mockEvents = [
        { id: '1', title: 'محاضرة أصول الفقه', date: '2023-06-15', type: 'lecture', course: 'أصول الفقه' },
        { id: '2', title: 'تسليم بحث أسباب النزول', date: '2023-06-18', type: 'assignment', course: 'علوم القرآن' },
        { id: '3', title: 'اختبار منتصف الفصل', date: '2023-06-22', type: 'exam', course: 'اللغة العربية المتقدمة' },
        { id: '4', title: 'حلقة نقاش', date: '2023-06-25', type: 'other', course: 'أصول الفقه' }
      ];

      setCourses(mockCourses);
      setEvents(mockEvents);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="courses">
        <TabsList className="mb-4">
          <TabsTrigger value="courses">المقررات الدراسية</TabsTrigger>
          <TabsTrigger value="calendar">التقويم الأكاديمي</TabsTrigger>
          <TabsTrigger value="assignments">الواجبات</TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="calendar">
          <CalendarView events={events} />
        </TabsContent>
        
        <TabsContent value="assignments">
          <AssignmentsList courses={courses} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{course.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{course.code}</p>
          </div>
          <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
            {course.progress}%
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{course.instructor}</span>
          </div>
          
          {course.nextAssignment && (
            <div className="border-t pt-2 mt-2">
              <p className="text-xs text-muted-foreground mb-1">الواجب القادم:</p>
              <p className="text-sm font-medium">{course.nextAssignment.title}</p>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <Clock className="mr-1 h-3 w-3" />
                <span>تاريخ التسليم: {course.nextAssignment.dueDate}</span>
              </div>
            </div>
          )}
          
          <Button variant="outline" size="sm" className="w-full mt-2">
            عرض المقرر
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CalendarView({ events }: { events: CalendarEvent[] }) {
  // Group events by date
  const eventsByDate = events.reduce((acc, event) => {
    const date = event.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);

  // Sort dates
  const sortedDates = Object.keys(eventsByDate).sort();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          التقويم الأكاديمي
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sortedDates.map(date => (
            <div key={date} className="border-b pb-4 last:border-0">
              <h3 className="font-medium text-lg mb-3">{new Date(date).toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
              <div className="space-y-3">
                {eventsByDate[date].map(event => (
                  <div key={event.id} className="flex items-start space-x-4 rtl:space-x-reverse p-3 border rounded-md">
                    <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full 
                      ${event.type === 'lecture' ? 'bg-blue-100 text-blue-600' : ''}
                      ${event.type === 'assignment' ? 'bg-amber-100 text-amber-600' : ''}
                      ${event.type === 'exam' ? 'bg-red-100 text-red-600' : ''}
                      ${event.type === 'other' ? 'bg-purple-100 text-purple-600' : ''}
                    `}>
                      {event.type === 'lecture' && <BookOpen className="h-5 w-5" />}
                      {event.type === 'assignment' && <CheckCircle className="h-5 w-5" />}
                      {event.type === 'exam' && <span className="font-bold">E</span>}
                      {event.type === 'other' && <span className="font-bold">O</span>}
                    </div>
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      {event.course && <p className="text-sm text-muted-foreground">{event.course}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AssignmentsList({ courses }: { courses: Course[] }) {
  // Filter courses with upcoming assignments
  const coursesWithAssignments = courses.filter(course => course.nextAssignment);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">الواجبات القادمة</CardTitle>
      </CardHeader>
      <CardContent>
        {coursesWithAssignments.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">لا توجد واجبات قادمة</p>
        ) : (
          <div className="space-y-4">
            {coursesWithAssignments.map(course => (
              <div key={course.id} className="border rounded-md p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{course.nextAssignment?.title}</h3>
                    <p className="text-sm text-muted-foreground">{course.title} ({course.code})</p>
                  </div>
                  <div className="text-sm font-medium">
                    {course.nextAssignment?.dueDate}
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button size="sm">تسليم الواجب</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, BookOpen, Users, CheckCircle } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  code: string;
  instructor: string;
  progress: number;
  nextAssignment?: {
    title: string;
    dueDate: string;
  };
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'assignment' | 'lecture' | 'exam' | 'other';
  course?: string;
}

export function CanvasDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch Canvas LMS data
    setTimeout(() => {
      // Mock courses data
      const mockCourses = [
        {
          id: '1',
          title: 'أصول الفقه',
          code: 'ISL-301',
          instructor: 'د. محمد عبدالله',
          progress: 65,
          nextAssignment: {
            title: 'تحليل نصوص من كتاب الرسالة للإمام الشافعي',
            dueDate: '2023-06-20'
          }
        },
        {
          id: '2',
          title: 'علوم القرآن',
          code: 'QUR-201',
          instructor: 'د. أحمد الزهراني',
          progress: 42,
          nextAssignment: {
            title: 'بحث في أسباب النزول',
            dueDate: '2023-06-18'
          }
        },
        {
          id: '3',
          title: 'اللغة العربية المتقدمة',
          code: 'ARB-401',
          instructor: 'د. سارة المهدي',
          progress: 78
        }
      ];

      // Mock calendar events
      const mockEvents = [
        { id: '1', title: 'محاضرة أصول الفقه', date: '2023-06-15', type: 'lecture', course: 'أصول الفقه' },
        { id: '2', title: 'تسليم بحث أسباب النزول', date: '2023-06-18', type: 'assignment', course: 'علوم القرآن' },
        { id: '3', title: 'اختبار منتصف الفصل', date: '2023-06-22', type: 'exam', course: 'اللغة العربية المتقدمة' },
        { id: '4', title: 'حلقة نقاش', date: '2023-06-25', type: 'other', course: 'أصول الفقه' }
      ];

      setCourses(mockCourses);
      setEvents(mockEvents);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="courses">
        <TabsList className="mb-4">
          <TabsTrigger value="courses">المقررات الدراسية</TabsTrigger>
          <TabsTrigger value="calendar">التقويم الأكاديمي</TabsTrigger>
          <TabsTrigger value="assignments">الواجبات</TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="calendar">
          <CalendarView events={events} />
        </TabsContent>
        
        <TabsContent value="assignments">
          <AssignmentsList courses={courses} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{course.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{course.code}</p>
          </div>
          <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
            {course.progress}%
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{course.instructor}</span>
          </div>
          
          {course.nextAssignment && (
            <div className="border-t pt-2 mt-2">
              <p className="text-xs text-muted-foreground mb-1">الواجب القادم:</p>
              <p className="text-sm font-medium">{course.nextAssignment.title}</p>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <Clock className="mr-1 h-3 w-3" />
                <span>تاريخ التسليم: {course.nextAssignment.dueDate}</span>
              </div>
            </div>
          )}
          
          <Button variant="outline" size="sm" className="w-full mt-2">
            عرض المقرر
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CalendarView({ events }: { events: CalendarEvent[] }) {
  // Group events by date
  const eventsByDate = events.reduce((acc, event) => {
    const date = event.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);

  // Sort dates
  const sortedDates = Object.keys(eventsByDate).sort();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          التقويم الأكاديمي
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sortedDates.map(date => (
            <div key={date} className="border-b pb-4 last:border-0">
              <h3 className="font-medium text-lg mb-3">{new Date(date).toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
              <div className="space-y-3">
                {eventsByDate[date].map(event => (
                  <div key={event.id} className="flex items-start space-x-4 rtl:space-x-reverse p-3 border rounded-md">
                    <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full 
                      ${event.type === 'lecture' ? 'bg-blue-100 text-blue-600' : ''}
                      ${event.type === 'assignment' ? 'bg-amber-100 text-amber-600' : ''}
                      ${event.type === 'exam' ? 'bg-red-100 text-red-600' : ''}
                      ${event.type === 'other' ? 'bg-purple-100 text-purple-600' : ''}
                    `}>
                      {event.type === 'lecture' && <BookOpen className="h-5 w-5" />}
                      {event.type === 'assignment' && <CheckCircle className="h-5 w-5" />}
                      {event.type === 'exam' && <span className="font-bold">E</span>}
                      {event.type === 'other' && <span className="font-bold">O</span>}
                    </div>
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      {event.course && <p className="text-sm text-muted-foreground">{event.course}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AssignmentsList({ courses }: { courses: Course[] }) {
  // Filter courses with upcoming assignments
  const coursesWithAssignments = courses.filter(course => course.nextAssignment);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">الواجبات القادمة</CardTitle>
      </CardHeader>
      <CardContent>
        {coursesWithAssignments.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">لا توجد واجبات قادمة</p>
        ) : (
          <div className="space-y-4">
            {coursesWithAssignments.map(course => (
              <div key={course.id} className="border rounded-md p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{course.nextAssignment?.title}</h3>
                    <p className="text-sm text-muted-foreground">{course.title} ({course.code})</p>
                  </div>
                  <div className="text-sm font-medium">
                    {course.nextAssignment?.dueDate}
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button size="sm">تسليم الواجب</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, BookOpen, Users, CheckCircle } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  code: string;
  instructor: string;
  progress: number;
  nextAssignment?: {
    title: string;
    dueDate: string;
  };
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'assignment' | 'lecture' | 'exam' | 'other';
  course?: string;
}

export function CanvasDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch Canvas LMS data
    setTimeout(() => {
      // Mock courses data
      const mockCourses = [
        {
          id: '1',
          title: 'أصول الفقه',
          code: 'ISL-301',
          instructor: 'د. محمد عبدالله',
          progress: 65,
          nextAssignment: {
            title: 'تحليل نصوص من كتاب الرسالة للإمام الشافعي',
            dueDate: '2023-06-20'
          }
        },
        {
          id: '2',
          title: 'علوم القرآن',
          code: 'QUR-201',
          instructor: 'د. أحمد الزهراني',
          progress: 42,
          nextAssignment: {
            title: 'بحث في أسباب النزول',
            dueDate: '2023-06-18'
          }
        },
        {
          id: '3',
          title: 'اللغة العربية المتقدمة',
          code: 'ARB-401',
          instructor: 'د. سارة المهدي',
          progress: 78
        }
      ];

      // Mock calendar events
      const mockEvents = [
        { id: '1', title: 'محاضرة أصول الفقه', date: '2023-06-15', type: 'lecture', course: 'أصول الفقه' },
        { id: '2', title: 'تسليم بحث أسباب النزول', date: '2023-06-18', type: 'assignment', course: 'علوم القرآن' },
        { id: '3', title: 'اختبار منتصف الفصل', date: '2023-06-22', type: 'exam', course: 'اللغة العربية المتقدمة' },
        { id: '4', title: 'حلقة نقاش', date: '2023-06-25', type: 'other', course: 'أصول الفقه' }
      ];

      setCourses(mockCourses);
      setEvents(mockEvents);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="courses">
        <TabsList className="mb-4">
          <TabsTrigger value="courses">المقررات الدراسية</TabsTrigger>
          <TabsTrigger value="calendar">التقويم الأكاديمي</TabsTrigger>
          <TabsTrigger value="assignments">الواجبات</TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="calendar">
          <CalendarView events={events} />
        </TabsContent>
        
        <TabsContent value="assignments">
          <AssignmentsList courses={courses} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{course.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{course.code}</p>
          </div>
          <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
            {course.progress}%
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{course.instructor}</span>
          </div>
          
          {course.nextAssignment && (
            <div className="border-t pt-2 mt-2">
              <p className="text-xs text-muted-foreground mb-1">الواجب القادم:</p>
              <p className="text-sm font-medium">{course.nextAssignment.title}</p>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <Clock className="mr-1 h-3 w-3" />
                <span>تاريخ التسليم: {course.nextAssignment.dueDate}</span>
              </div>
            </div>
          )}
          
          <Button variant="outline" size="sm" className="w-full mt-2">
            عرض المقرر
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CalendarView({ events }: { events: CalendarEvent[] }) {
  // Group events by date
  const eventsByDate = events.reduce((acc, event) => {
    const date = event.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);

  // Sort dates
  const sortedDates = Object.keys(eventsByDate).sort();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          التقويم الأكاديمي
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sortedDates.map(date => (
            <div key={date} className="border-b pb-4 last:border-0">
              <h3 className="font-medium text-lg mb-3">{new Date(date).toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
              <div className="space-y-3">
                {eventsByDate[date].map(event => (
                  <div key={event.id} className="flex items-start space-x-4 rtl:space-x-reverse p-3 border rounded-md">
                    <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full 
                      ${event.type === 'lecture' ? 'bg-blue-100 text-blue-600' : ''}
                      ${event.type === 'assignment' ? 'bg-amber-100 text-amber-600' : ''}
                      ${event.type === 'exam' ? 'bg-red-100 text-red-600' : ''}
                      ${event.type === 'other' ? 'bg-purple-100 text-purple-600' : ''}
                    `}>
                      {event.type === 'lecture' && <BookOpen className="h-5 w-5" />}
                      {event.type === 'assignment' && <CheckCircle className="h-5 w-5" />}
                      {event.type === 'exam' && <span className="font-bold">E</span>}
                      {event.type === 'other' && <span className="font-bold">O</span>}
                    </div>
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      {event.course && <p className="text-sm text-muted-foreground">{event.course}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AssignmentsList({ courses }: { courses: Course[] }) {
  // Filter courses with upcoming assignments
  const coursesWithAssignments = courses.filter(course => course.nextAssignment);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">الواجبات القادمة</CardTitle>
      </CardHeader>
      <CardContent>
        {coursesWithAssignments.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">لا توجد واجبات قادمة</p>
        ) : (
          <div className="space-y-4">
            {coursesWithAssignments.map(course => (
              <div key={course.id} className="border rounded-md p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{course.nextAssignment?.title}</h3>
                    <p className="text-sm text-muted-foreground">{course.title} ({course.code})</p>
                  </div>
                  <div className="text-sm font-medium">
                    {course.nextAssignment?.dueDate}
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button size="sm">تسليم الواجب</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}