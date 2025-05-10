/**
 * ImpactTimeline.tsx
 * 
 * Component for displaying a timeline of community impact events
 * Shows major milestones, achievements, and growth of the Sabeel platform
 */

import React from 'react';
import { Check, Calendar, Users, Award, BookOpen, Heart, Star, Globe, GraduationCap } from 'lucide-react';
import { cn } from "@/lib/utils";

interface TimelineEventProps {
  date: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight?: boolean;
  className?: string;
}

export interface ImpactTimelineProps {
  className?: string;
}

const TimelineEvent: React.FC<TimelineEventProps> = ({
  date,
  title,
  description,
  icon,
  highlight = false,
  className
}) => {
  return (
    <div className={cn("relative pb-12", className)}>
      {/* Vertical line */}
      <div className="absolute left-5 top-5 h-full w-px bg-border" />
      
      {/* Event content */}
      <div className="flex group">
        {/* Icon */}
        <div className={cn(
          "z-10 flex h-10 w-10 items-center justify-center rounded-full border bg-background",
          highlight ? "border-primary text-primary" : "border-muted-foreground/30 text-muted-foreground/50"
        )}>
          {icon}
        </div>
        
        {/* Text content */}
        <div className="flex-1 mr-5 space-y-1 text-right">
          <div className="text-xs text-muted-foreground">{date}</div>
          <h4 className="text-sm font-medium leading-none">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
};

// Sample timeline events for the community impact
const getSampleTimelineEvents = (): TimelineEventProps[] => [
  {
    date: "أكتوبر 2025",
    title: "وصول عدد المستخدمين إلى 25,000",
    description: "نمو مجتمع سبيل ليصل إلى 25 ألف مستخدم نشط من مختلف أنحاء العالم",
    icon: <Users className="h-5 w-5" />,
    highlight: true
  },
  {
    date: "سبتمبر 2025",
    title: "إطلاق تطبيق الجوال",
    description: "إطلاق تطبيق سبيل للهواتف الذكية (iOS وأندرويد) لتسهيل الوصول إلى المحتوى",
    icon: <Globe className="h-5 w-5" />,
    highlight: true
  },
  {
    date: "أغسطس 2025",
    title: "تجاوز 50,000 ساعة تعلم",
    description: "قضى مجتمع سبيل أكثر من 50 ألف ساعة في التعلم والقراءة على المنصة",
    icon: <GraduationCap className="h-5 w-5" />,
    highlight: false
  },
  {
    date: "يوليو 2025",
    title: "إكمال 3,500 ختمة للقرآن",
    description: "وصل مجتمع سبيل إلى 3,500 ختمة للقرآن الكريم بشكل جماعي",
    icon: <BookOpen className="h-5 w-5" />,
    highlight: false
  },
  {
    date: "يونيو 2025",
    title: "تجاوز 10,000 إجابة في المنتدى",
    description: "تم الإجابة على أكثر من 10 آلاف سؤال في منتدى سبيل للمعرفة الإسلامية",
    icon: <Check className="h-5 w-5" />,
    highlight: false
  },
  {
    date: "مايو 2025",
    title: "إطلاق ميزة التعلم الشخصي",
    description: "إطلاق ميزة مسارات التعلم الشخصية المدعومة بالذكاء الاصطناعي",
    icon: <Star className="h-5 w-5" />,
    highlight: true
  },
  {
    date: "أبريل 2025",
    title: "تجاوز 700 مقال تعليمي",
    description: "نشر أكثر من 700 مقال تعليمي عالي الجودة بواسطة مجتمع العلماء والمساهمين",
    icon: <BookOpen className="h-5 w-5" />,
    highlight: false
  },
  {
    date: "مارس 2025",
    title: "إطلاق الإصدار 2.0",
    description: "إطلاق الإصدار الثاني من منصة سبيل مع واجهة مستخدم محسنة وميزات جديدة",
    icon: <Calendar className="h-5 w-5" />,
    highlight: true
  },
  {
    date: "فبراير 2025",
    title: "وصول المستخدمين إلى 15,000",
    description: "نمو مجتمع سبيل ليصل إلى 15 ألف مستخدم نشط",
    icon: <Users className="h-5 w-5" />,
    highlight: false
  },
  {
    date: "يناير 2025",
    title: "إطلاق برنامج المتطوعين",
    description: "إطلاق برنامج للمتطوعين للمساعدة في تطوير المحتوى ومراجعته",
    icon: <Heart className="h-5 w-5" />,
    highlight: false
  },
  {
    date: "ديسمبر 2024",
    title: "وصول ختمات القرآن إلى 1,000",
    description: "إكمال 1,000 ختمة للقرآن الكريم بشكل جماعي في مجتمع سبيل",
    icon: <Award className="h-5 w-5" />,
    highlight: true
  }
];

const ImpactTimeline: React.FC<ImpactTimelineProps> = ({ className }) => {
  const timelineEvents = getSampleTimelineEvents();
  
  return (
    <div className={cn("space-y-0", className)}>
      {timelineEvents.map((event, index) => (
        <TimelineEvent
          key={index}
          {...event}
          className={index === timelineEvents.length - 1 ? "pb-0" : undefined}
        />
      ))}
    </div>
  );
};

export default ImpactTimeline;
