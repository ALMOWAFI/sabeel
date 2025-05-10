/**
 * Community Page
 * 
 * Combines job openings and WhatsApp groups in one interface
 */

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, MessageSquare } from 'lucide-react';
import JobOpeningsBoard from '@/components/community/JobOpeningsBoard';
import WhatsAppGroupJoin from '@/components/community/WhatsAppGroupJoin';

const CommunityPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">مجتمع سبيل</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          استكشف الفرص الوظيفية في مجال المعرفة الإسلامية وانضم إلى مجموعات واتساب للتواصل مع طلاب العلم والمهتمين
        </p>
      </div>
      
      <Tabs defaultValue="jobs" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="jobs" className="flex items-center justify-center">
            <Briefcase className="mr-2 h-4 w-4" />
            <span>الوظائف المتاحة</span>
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="flex items-center justify-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>مجموعات واتساب</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="jobs">
          <JobOpeningsBoard />
        </TabsContent>
        
        <TabsContent value="whatsapp">
          <WhatsAppGroupJoin />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityPage;
