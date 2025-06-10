// CanvasService.ts
// Service for fetching Canvas LMS data (real API or mock fallback)

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';
const API_BASE_URL = import.meta.env.VITE_CANVAS_API_URL || '/api/canvas';

export interface Course {
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

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'assignment' | 'lecture' | 'exam' | 'other';
  course?: string;
}

export class CanvasService {
  async getCourses(): Promise<Course[]> {
    if (USE_MOCK_DATA) return this.getMockCourses();
    try {
      const res = await fetch(`${API_BASE_URL}/courses`, { credentials: 'include' });
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch (e) {
      return this.getMockCourses();
    }
  }

  async getAssignments(): Promise<any[]> {
    if (USE_MOCK_DATA) return this.getMockAssignments();
    try {
      const res = await fetch(`${API_BASE_URL}/assignments`, { credentials: 'include' });
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch (e) {
      return this.getMockAssignments();
    }
  }

  async getCalendarEvents(): Promise<CalendarEvent[]> {
    if (USE_MOCK_DATA) return this.getMockCalendarEvents();
    try {
      const res = await fetch(`${API_BASE_URL}/calendar`, { credentials: 'include' });
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch (e) {
      return this.getMockCalendarEvents();
    }
  }

  // --- Mock Data ---
  private getMockCourses(): Course[] {
    return [
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
  }

  private getMockAssignments(): any[] {
    return [
      { id: 'a1', title: 'تحليل نصوص', dueDate: '2023-06-20', course: 'أصول الفقه' },
      { id: 'a2', title: 'بحث في أسباب النزول', dueDate: '2023-06-18', course: 'علوم القرآن' }
    ];
  }

  private getMockCalendarEvents(): CalendarEvent[] {
    return [
      { id: '1', title: 'محاضرة أصول الفقه', date: '2023-06-15', type: 'lecture', course: 'أصول الفقه' },
      { id: '2', title: 'تسليم بحث أسباب النزول', date: '2023-06-18', type: 'assignment', course: 'علوم القرآن' },
      { id: '3', title: 'اختبار منتصف الفصل', date: '2023-06-22', type: 'exam', course: 'اللغة العربية المتقدمة' },
      { id: '4', title: 'حلقة نقاش', date: '2023-06-25', type: 'other', course: 'أصول الفقه' }
    ];
  }
}

export const canvasService = new CanvasService(); 