export interface Project {
  id: string;
  title: string;
  progress: number;
  members: number;
  priority: 'عالي' | 'متوسط' | 'منخفض';
  deadline: string;
}

export interface Profile {
  id: string;
  name: string;
  role: string;
  expertise: string;
  status: 'متصل' | 'غير متصل' | 'مشغول';
  avatar: string;
  bio?: string;
}

export interface Resource {
  id: string;
  title: string;
  type: string;
  access: 'كامل' | 'مقيد';
  lastUpdated: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  participants: number;
}
