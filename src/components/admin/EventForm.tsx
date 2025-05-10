/**
 * EventForm.tsx
 * 
 * Form for adding and editing Islamic events
 */

import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MultiSelect } from "@/components/ui/multi-select";
import { Calendar as CalendarIcon, Save, X, Info } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { IslamicEvent } from './IslamicEventsManager';

interface EventFormProps {
  event: IslamicEvent | null;
  onSubmit: (data: Partial<IslamicEvent>) => Promise<void>;
  onCancel: () => void;
}

const notificationOptions = [
  { value: "1", label: "يوم واحد قبل الحدث" },
  { value: "3", label: "3 أيام قبل الحدث" },
  { value: "7", label: "أسبوع قبل الحدث" },
  { value: "14", label: "أسبوعين قبل الحدث" },
  { value: "30", label: "شهر قبل الحدث" }
];

export const EventForm: React.FC<EventFormProps> = ({
  event,
  onSubmit,
  onCancel
}) => {
  const isEditing = !!event;
  
  const [formData, setFormData] = useState({
    titleArabic: event?.titleArabic || '',
    titleEnglish: event?.titleEnglish || '',
    description: event?.description || '',
    descriptionArabic: event?.descriptionArabic || '',
    dateHijri: event?.dateHijri || '',
    dateGregorian: event?.dateGregorian ? new Date(event.dateGregorian) : new Date(),
    type: event?.type || 'islamic',
    isPublished: event?.isPublished || false,
    notifyBefore: event?.notifyBefore || [],
    imageUrl: event?.imageUrl || ''
  });
  
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
    event?.notifyBefore ? event.notifyBefore.map(day => day.toString()) : []
  );
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, type: value as IslamicEvent['type'] }));
  };
  
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, dateGregorian: date }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare data for submission
    const eventData: Partial<IslamicEvent> = {
      ...formData,
      dateGregorian: formData.dateGregorian.toISOString(),
      notifyBefore: selectedNotifications.map(day => parseInt(day))
    };
    
    await onSubmit(eventData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{isEditing ? 'تعديل حدث' : 'إضافة حدث جديد'}</h2>
        <div className="flex space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            إلغاء
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            حفظ
          </Button>
        </div>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titleArabic" className="text-right block">عنوان الحدث (بالعربية)</Label>
            <Input
              id="titleArabic"
              name="titleArabic"
              value={formData.titleArabic}
              onChange={handleChange}
              className="text-right"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="titleEnglish" className="text-right block">عنوان الحدث (بالإنجليزية)</Label>
            <Input
              id="titleEnglish"
              name="titleEnglish"
              value={formData.titleEnglish}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dateHijri" className="text-right block">التاريخ الهجري</Label>
            <div className="flex items-center">
              <Input
                id="dateHijri"
                name="dateHijri"
                value={formData.dateHijri}
                onChange={handleChange}
                className="text-right"
                placeholder="مثال: 1 محرم"
                required
              />
              <div className="mr-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !formData.dateGregorian && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dateGregorian ? (
                        format(formData.dateGregorian, "PPP", { locale: arSA })
                      ) : (
                        <span>اختر تاريخ</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.dateGregorian}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <Label className="text-right block">نوع الحدث</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={handleTypeChange}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2 space-x-reverse rtl:space-x-reverse">
                <RadioGroupItem value="islamic" id="islamic" />
                <Label htmlFor="islamic">الأعياد الإسلامية</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse rtl:space-x-reverse">
                <RadioGroupItem value="ottoman" id="ottoman" />
                <Label htmlFor="ottoman">أحداث عثمانية</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse rtl:space-x-reverse">
                <RadioGroupItem value="historical" id="historical" />
                <Label htmlFor="historical">أحداث تاريخية</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse rtl:space-x-reverse">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom">أحداث مخصصة</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="text-right block">رابط الصورة (اختياري)</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="text-right dir-ltr"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description" className="text-right block">وصف الحدث (بالإنجليزية)</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="h-24"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="descriptionArabic" className="text-right block">وصف الحدث (بالعربية)</Label>
            <Textarea
              id="descriptionArabic"
              name="descriptionArabic"
              value={formData.descriptionArabic}
              onChange={handleChange}
              className="h-24 text-right"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-right block">إشعارات قبل الحدث</Label>
            <MultiSelect
              options={notificationOptions}
              selected={selectedNotifications}
              onChange={setSelectedNotifications}
              placeholder="اختر توقيتات الإشعارات"
            />
            <p className="text-sm text-muted-foreground text-right mt-1">
              <Info className="h-3 w-3 inline-block ml-1" />
              سيتم إرسال إشعارات للمسؤولين في هذه الأوقات قبل الحدث
            </p>
          </div>
          
          <Card className="mt-4">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <Switch
                  id="isPublished"
                  checked={formData.isPublished}
                  onCheckedChange={(checked) => handleSwitchChange('isPublished', checked)}
                />
                <Label htmlFor="isPublished" className="text-right">نشر الحدث للمستخدمين</Label>
              </div>
              <p className="text-sm text-muted-foreground mt-2 text-right">
                عند تفعيل هذا الخيار، سيظهر الحدث للمستخدمين في التطبيق
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
};
