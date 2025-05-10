/**
 * IslamicEventsManager.tsx
 * 
 * Admin panel component for managing Islamic events calendar
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, ListFilter, BellRing, Plus } from 'lucide-react';
import { IslamicCalendarService } from '@/services/IslamicCalendarService';
import { EventsList } from './EventsList';
import { EventForm } from './EventForm';
import { EventNotifications } from './EventNotifications';

export interface IslamicEvent {
  id: string;
  titleArabic: string;
  titleEnglish: string;
  description: string;
  descriptionArabic?: string;
  dateHijri: string;
  dateGregorian: string;
  type: 'islamic' | 'ottoman' | 'historical' | 'custom';
  isPublished: boolean;
  notifyBefore: number[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

const IslamicEventsManager: React.FC = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<IslamicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<IslamicEvent | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [filter, setFilter] = useState<string>('all');
  
  const calendarService = new IslamicCalendarService();
  
  useEffect(() => {
    fetchEvents();
  }, []);
  
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const fetchedEvents = await calendarService.getAllEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        variant: "destructive",
        title: "خطأ في تحميل الأحداث",
        description: "تعذر تحميل قائمة الأحداث الإسلامية"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddEvent = () => {
    setSelectedEvent(null);
    setIsFormOpen(true);
  };
  
  const handleEditEvent = (event: IslamicEvent) => {
    setSelectedEvent(event);
    setIsFormOpen(true);
  };
  
  const handlePublishToggle = async (event: IslamicEvent) => {
    try {
      await calendarService.updateEvent({
        ...event,
        isPublished: !event.isPublished
      });
      
      // Update local state
      setEvents(prevEvents => 
        prevEvents.map(e => 
          e.id === event.id ? { ...e, isPublished: !e.isPublished } : e
        )
      );
      
      toast({
        title: event.isPublished ? "تم إلغاء النشر" : "تم النشر",
        description: `تم ${event.isPublished ? 'إلغاء نشر' : 'نشر'} الحدث بنجاح`
      });
    } catch (error) {
      console.error('Error toggling publication status:', error);
      toast({
        variant: "destructive",
        title: "خطأ في تحديث حالة النشر",
        description: "تعذر تحديث حالة نشر الحدث"
      });
    }
  };
  
  const handleDeleteEvent = async (eventId: string) => {
    try {
      await calendarService.deleteEvent(eventId);
      
      // Update local state
      setEvents(prevEvents => prevEvents.filter(e => e.id !== eventId));
      
      toast({
        title: "تم الحذف",
        description: "تم حذف الحدث بنجاح"
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        variant: "destructive",
        title: "خطأ في حذف الحدث",
        description: "تعذر حذف الحدث"
      });
    }
  };
  
  const getFilteredEvents = () => {
    if (filter === 'all') return events;
    return events.filter(event => event.type === filter);
  };
  
  const handleFormSubmit = async (eventData: Partial<IslamicEvent>) => {
    try {
      if (selectedEvent) {
        // Update existing event
        const updatedEvent = await calendarService.updateEvent({
          ...selectedEvent,
          ...eventData
        });
        
        // Update local state
        setEvents(prevEvents => 
          prevEvents.map(e => e.id === updatedEvent.id ? updatedEvent : e)
        );
        
        toast({
          title: "تم التحديث",
          description: "تم تحديث الحدث بنجاح"
        });
      } else {
        // Create new event
        const newEvent = await calendarService.createEvent(eventData as Omit<IslamicEvent, 'id'>);
        
        // Update local state
        setEvents(prevEvents => [...prevEvents, newEvent]);
        
        toast({
          title: "تمت الإضافة",
          description: "تم إضافة الحدث بنجاح"
        });
      }
      
      // Close form
      setIsFormOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        variant: "destructive",
        title: "خطأ في حفظ الحدث",
        description: "تعذر حفظ الحدث"
      });
    }
  };
  
  const handleCancelForm = () => {
    setIsFormOpen(false);
    setSelectedEvent(null);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-right">إدارة الأحداث الإسلامية</CardTitle>
            <CardDescription className="text-right">
              إضافة وتعديل الأحداث الإسلامية والتاريخية في التقويم
            </CardDescription>
          </div>
          <Button onClick={handleAddEvent}>
            <Plus className="mr-2 h-4 w-4" />
            إضافة حدث جديد
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {isFormOpen ? (
          <EventForm 
            event={selectedEvent} 
            onSubmit={handleFormSubmit} 
            onCancel={handleCancelForm}
          />
        ) : (
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <ListFilter className="h-4 w-4" />
                <span>تصفية:</span>
                <select 
                  className="border rounded p-1"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">الكل</option>
                  <option value="islamic">الأعياد الإسلامية</option>
                  <option value="ottoman">أحداث عثمانية</option>
                  <option value="historical">أحداث تاريخية</option>
                  <option value="custom">أحداث مخصصة</option>
                </select>
              </div>
              
              <TabsList>
                <TabsTrigger value="all" className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  جميع الأحداث
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center">
                  <BellRing className="mr-2 h-4 w-4" />
                  إشعارات
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="mt-0">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Spinner size="lg" />
                </div>
              ) : (
                <EventsList 
                  events={getFilteredEvents()} 
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                  onPublishToggle={handlePublishToggle}
                />
              )}
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-0">
              <EventNotifications events={events} />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default IslamicEventsManager;
