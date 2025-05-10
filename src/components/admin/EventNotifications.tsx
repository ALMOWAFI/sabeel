/**
 * EventNotifications.tsx
 * 
 * Component to manage notifications for upcoming Islamic events
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { BellRing, Calendar, Send, Check } from 'lucide-react';
import { IslamicCalendarService } from '@/services/IslamicCalendarService';
import { IslamicEvent } from './IslamicEventsManager';

interface EventNotificationsProps {
  events: IslamicEvent[];
}

export const EventNotifications: React.FC<EventNotificationsProps> = ({ events }) => {
  const { toast } = useToast();
  const [upcomingEvents, setUpcomingEvents] = useState<Array<IslamicEvent & { daysUntil: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [sendingNotification, setSendingNotification] = useState<string | null>(null);
  
  const calendarService = new IslamicCalendarService();
  
  useEffect(() => {
    fetchUpcomingEvents();
  }, [events]);
  
  const fetchUpcomingEvents = async () => {
    setLoading(true);
    try {
      // Get events coming up in the next 60 days
      const upcoming = await calendarService.getUpcomingEvents(60);
      setUpcomingEvents(upcoming);
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      toast({
        variant: "destructive",
        title: "خطأ في تحميل الأحداث القادمة",
        description: "تعذر تحميل قائمة الأحداث القادمة"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSendNotification = async (eventId: string) => {
    setSendingNotification(eventId);
    try {
      await calendarService.sendEventNotification(eventId);
      
      toast({
        title: "تم إرسال الإشعار",
        description: "تم إرسال الإشعار بنجاح"
      });
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        variant: "destructive",
        title: "خطأ في إرسال الإشعار",
        description: "تعذر إرسال الإشعار"
      });
    } finally {
      setSendingNotification(null);
    }
  };
  
  const getEventTypeBadge = (type: string) => {
    switch (type) {
      case 'islamic':
        return <Badge variant="default" className="bg-green-600">الأعياد الإسلامية</Badge>;
      case 'ottoman':
        return <Badge variant="default" className="bg-amber-600">أحداث عثمانية</Badge>;
      case 'historical':
        return <Badge variant="default" className="bg-blue-600">أحداث تاريخية</Badge>;
      case 'custom':
        return <Badge variant="default" className="bg-purple-600">أحداث مخصصة</Badge>;
      default:
        return <Badge variant="outline">غير معروف</Badge>;
    }
  };
  
  // Format date to localized string
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-SA');
    } catch (error) {
      return dateString;
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">الأحداث القادمة والإشعارات</h3>
        <Button 
          variant="outline" 
          onClick={fetchUpcomingEvents}
          size="sm"
        >
          <Calendar className="mr-2 h-4 w-4" />
          تحديث
        </Button>
      </div>
      
      {upcomingEvents.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              لا توجد أحداث قادمة في الـ 60 يوماً القادمة
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="rtl:text-right space-y-2 flex-1">
                    <div className="flex items-center justify-end mb-2">
                      {getEventTypeBadge(event.type)}
                      <Badge variant="outline" className="mr-2">
                        بعد {event.daysUntil} يوم
                      </Badge>
                    </div>
                    
                    <h4 className="font-semibold text-lg">{event.titleArabic}</h4>
                    <p className="text-sm text-muted-foreground">{event.titleEnglish}</p>
                    
                    <div className="flex items-center text-sm text-muted-foreground space-x-4 space-x-reverse mt-2">
                      <span>{event.dateHijri} هـ</span>
                      <span>•</span>
                      <span>{formatDate(event.dateGregorian)}</span>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-sm text-right">{event.descriptionArabic || event.description}</p>
                    </div>
                    
                    <div className="mt-4 flex items-center space-x-2 space-x-reverse">
                      <BellRing className="h-4 w-4" />
                      <span className="text-sm">إشعار قبل:</span>
                      <div className="flex flex-wrap gap-2">
                        {event.notifyBefore.map(days => (
                          <Badge key={days} variant="outline">
                            {days} {days === 1 ? 'يوم' : 'أيام'}
                          </Badge>
                        ))}
                        {event.notifyBefore.length === 0 && (
                          <span className="text-sm text-muted-foreground">لا توجد إشعارات</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mr-4 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendNotification(event.id)}
                      disabled={!!sendingNotification}
                    >
                      {sendingNotification === event.id ? (
                        <>
                          <Spinner className="mr-2" size="sm" />
                          جاري الإرسال...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          إرسال إشعار الآن
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">تاريخ الإشعارات المرسلة</h3>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Display notification history */}
              <div className="flex items-center justify-between p-2 border-b">
                <span className="text-sm">10/05/2025</span>
                <div className="flex flex-1 mx-4">
                  <div className="text-sm text-right">تم إرسال إشعار بمناسبة ليلة القدر</div>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  <Check className="mr-1 h-3 w-3" />
                  تم الإرسال
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-2 border-b">
                <span className="text-sm">01/05/2025</span>
                <div className="flex flex-1 mx-4">
                  <div className="text-sm text-right">تم إرسال إشعار ببداية شهر رمضان</div>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  <Check className="mr-1 h-3 w-3" />
                  تم الإرسال
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-2">
                <span className="text-sm">15/04/2025</span>
                <div className="flex flex-1 mx-4">
                  <div className="text-sm text-right">تم إرسال إشعار بذكرى فتح القسطنطينية</div>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  <Check className="mr-1 h-3 w-3" />
                  تم الإرسال
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
