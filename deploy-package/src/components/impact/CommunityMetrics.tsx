/**
 * CommunityMetrics.tsx
 * 
 * Component for displaying key impact metrics of the Sabeel community
 * Shows collective achievements and social impact stats
 */

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Users, 
  Heart, 
  Star, 
  Clock, 
  Award, 
  Bookmark,
  MapPin,
  GraduationCap
} from 'lucide-react';

interface MetricProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
  change?: number; // Percentage change
  target?: number; // Goal target
  current?: number; // Current progress
  className?: string;
}

export interface CommunityMetricsProps {
  metrics: MetricProps[];
  isLoading?: boolean;
}

const Metric: React.FC<MetricProps> = ({
  title,
  value,
  icon,
  description,
  change,
  target,
  current,
  className
}) => {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-6">
        <div className="flex justify-between">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            <div className="text-2xl font-bold">{value}</div>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
        </div>
        
        {target && current !== undefined && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span>{current}</span>
              <span className="text-muted-foreground">الهدف: {target}</span>
            </div>
            <Progress value={(current / target) * 100} className="h-1" />
          </div>
        )}
        
        <div className="mt-4 flex items-baseline justify-between">
          <p className="text-sm text-muted-foreground">{description}</p>
          {change !== undefined && (
            <div className={`text-xs font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const CommunityMetrics: React.FC<CommunityMetricsProps> = ({
  metrics,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
        {[...Array(8)].map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded"></div>
                  <div className="h-8 w-16 bg-muted rounded"></div>
                </div>
                <div className="h-12 w-12 rounded-full bg-muted"></div>
              </div>
              <div className="mt-4 h-4 w-full bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Metric key={index} {...metric} />
      ))}
    </div>
  );
};

// Sample community metrics data for showcase
export const getSampleMetrics = (): MetricProps[] => [
  {
    title: "إجمالي القراء",
    value: "24,583",
    icon: <Users className="h-6 w-6 text-primary" />,
    description: "عدد المستخدمين النشطين هذا الشهر",
    change: 12.4
  },
  {
    title: "ختمات القرآن",
    value: "3,827",
    icon: <BookOpen className="h-6 w-6 text-emerald-500" />,
    description: "ختمات القرآن المكتملة في المجتمع",
    change: 8.3,
    current: 3827,
    target: 5000
  },
  {
    title: "ساعات التعلم",
    value: "125,472",
    icon: <Clock className="h-6 w-6 text-blue-500" />,
    description: "إجمالي ساعات التعلم المجتمعية",
    change: 15.7
  },
  {
    title: "المقالات المنشورة",
    value: "843",
    icon: <Bookmark className="h-6 w-6 text-amber-500" />,
    description: "مقالات وكتب تم نشرها بواسطة المجتمع",
    change: 5.2
  },
  {
    title: "الأسئلة المجاب عنها",
    value: "12,391",
    icon: <GraduationCap className="h-6 w-6 text-indigo-500" />,
    description: "أسئلة تمت الإجابة عليها في المنتدى",
    change: 23.6
  },
  {
    title: "البلدان المشاركة",
    value: "78",
    icon: <MapPin className="h-6 w-6 text-rose-500" />,
    description: "عدد البلدان التي ينتمي إليها الأعضاء",
    change: 3.1
  },
  {
    title: "الإنجازات المكتسبة",
    value: "56,935",
    icon: <Award className="h-6 w-6 text-yellow-500" />,
    description: "إنجازات حصل عليها أعضاء المجتمع",
    change: 18.9
  },
  {
    title: "المساهمات التطوعية",
    value: "3,254",
    icon: <Heart className="h-6 w-6 text-red-500" />,
    description: "ساعات التطوع في مشاريع المجتمع",
    change: 7.5,
    current: 3254,
    target: 5000
  }
];

export default CommunityMetrics;
