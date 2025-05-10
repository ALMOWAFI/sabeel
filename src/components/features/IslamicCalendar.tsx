import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Star,
  Moon,
  Sun,
  Clock,
  MapPin,
  Bell,
  Calendar
} from "lucide-react";

// Mock Islamic months
const islamicMonths = [
  { id: 1, name: "محرم", englishName: "Muharram", days: 30 },
  { id: 2, name: "صفر", englishName: "Safar", days: 29 },
  { id: 3, name: "ربيع الأول", englishName: "Rabi' al-Awwal", days: 30 },
  { id: 4, name: "ربيع الثاني", englishName: "Rabi' al-Thani", days: 29 },
  { id: 5, name: "جمادى الأولى", englishName: "Jumada al-Awwal", days: 30 },
  { id: 6, name: "جمادى الآخرة", englishName: "Jumada al-Thani", days: 29 },
  { id: 7, name: "رجب", englishName: "Rajab", days: 30 },
  { id: 8, name: "شعبان", englishName: "Sha'ban", days: 29 },
  { id: 9, name: "رمضان", englishName: "Ramadan", days: 30 },
  { id: 10, name: "شوال", englishName: "Shawwal", days: 29 },
  { id: 11, name: "ذو القعدة", englishName: "Dhu al-Qi'dah", days: 30 },
  { id: 12, name: "ذو الحجة", englishName: "Dhu al-Hijjah", days: 29 }
];

// Mock Gregorian months for display
const gregorianMonths = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Mock Islamic events and holidays
const islamicEvents = [
  { 
    date: { day: 1, month: 1 }, 
    name: "رأس السنة الهجرية", 
    englishName: "Islamic New Year",
    description: "بداية العام الهجري الجديد، وهو اليوم الذي هاجر فيه النبي محمد ﷺ من مكة إلى المدينة المنورة.",
    type: "holiday"
  },
  { 
    date: { day: 10, month: 1 }, 
    name: "يوم عاشوراء", 
    englishName: "Day of Ashura",
    description: "يوم يصومه المسلمون ويُذكر فيه نجاة نبي الله موسى عليه السلام من فرعون.",
    type: "holiday"
  },
  { 
    date: { day: 12, month: 3 }, 
    name: "المولد النبوي الشريف", 
    englishName: "Mawlid al-Nabi",
    description: "ذكرى مولد النبي محمد ﷺ.",
    type: "holiday"
  },
  { 
    date: { day: 27, month: 7 }, 
    name: "ليلة الإسراء والمعراج", 
    englishName: "Isra and Mi'raj",
    description: "ذكرى رحلة النبي محمد ﷺ من المسجد الحرام إلى المسجد الأقصى ثم إلى السماء.",
    type: "commemoration"
  },
  { 
    date: { day: 15, month: 8 }, 
    name: "ليلة النصف من شعبان", 
    englishName: "Mid-Sha'ban",
    description: "ليلة فضيلة يستحب فيها العبادة والدعاء.",
    type: "commemoration"
  },
  { 
    date: { day: 1, month: 9 }, 
    name: "بداية شهر رمضان", 
    englishName: "Start of Ramadan",
    description: "بداية شهر الصيام، حيث يصوم المسلمون من الفجر حتى المغرب.",
    type: "holiday"
  },
  { 
    date: { day: 27, month: 9 }, 
    name: "ليلة القدر (المحتملة)", 
    englishName: "Laylat al-Qadr",
    description: "ليلة أنزل فيها القرآن، وهي خير من ألف شهر.",
    type: "commemoration"
  },
  { 
    date: { day: 1, month: 10 }, 
    name: "عيد الفطر", 
    englishName: "Eid al-Fitr",
    description: "عيد يحتفل به المسلمون بمناسبة انتهاء شهر رمضان.",
    type: "holiday"
  },
  { 
    date: { day: 10, month: 12 }, 
    name: "عيد الأضحى", 
    englishName: "Eid al-Adha",
    description: "عيد يحتفل به المسلمون بعد أداء مناسك الحج.",
    type: "holiday"
  },
  { 
    date: { day: 9, month: 12 }, 
    name: "يوم عرفة", 
    englishName: "Day of Arafah",
    description: "أهم أيام الحج حيث يقف الحجاج على جبل عرفات.",
    type: "commemoration"
  }
];

// Mock prayer times
const mockPrayerTimes = {
  fajr: "04:23",
  sunrise: "05:52",
  dhuhr: "12:14",
  asr: "15:43",
  maghrib: "18:36",
  isha: "20:06"
};

// Helper Functions
const getCurrentHijriDate = () => {
  // In a real implementation, this would use a proper Hijri calendar library
  // For mock purposes, we'll return a sample date
  return { day: 15, month: 8, year: 1446 };
};

const getDaysInMonth = (year: number, month: number) => {
  // In a real implementation, this would properly calculate days in a Hijri month
  return islamicMonths[(month - 1) % 12].days;
};

const getFirstDayOfMonth = (year: number, month: number) => {
  // In a real implementation, this would calculate the day of week for the 1st of the month
  // For mock purposes, we'll return a random value 0-6 (0 = Sunday)
  return Math.floor(Math.random() * 7);
};

const getGregorianFromHijri = (hijriDate: { day: number, month: number, year: number }) => {
  // In a real implementation, this would convert from Hijri to Gregorian
  // For mock purposes, we'll return a sample date
  return new Date(2025, 4, hijriDate.day);
};

const IslamicCalendar: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [currentHijriDate, setCurrentHijriDate] = useState(getCurrentHijriDate());
  const [displayMonth, setDisplayMonth] = useState(currentHijriDate.month);
  const [displayYear, setDisplayYear] = useState(currentHijriDate.year);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  
  useEffect(() => {
    // Simulate loading calendar data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    // Update events when month changes
    const monthEvents = islamicEvents.filter(event => event.date.month === displayMonth);
    setEvents(monthEvents);
    setSelectedDay(null);
  }, [displayMonth]);
  
  const goToPreviousMonth = () => {
    if (displayMonth === 1) {
      setDisplayMonth(12);
      setDisplayYear(displayYear - 1);
    } else {
      setDisplayMonth(displayMonth - 1);
    }
  };
  
  const goToNextMonth = () => {
    if (displayMonth === 12) {
      setDisplayMonth(1);
      setDisplayYear(displayYear + 1);
    } else {
      setDisplayMonth(displayMonth + 1);
    }
  };
  
  const handleDaySelect = (day: number) => {
    setSelectedDay(day);
  };
  
  const isToday = (day: number) => {
    const today = getCurrentHijriDate();
    return today.day === day && today.month === displayMonth && today.year === displayYear;
  };
  
  const hasEvent = (day: number) => {
    return events.some(event => event.date.day === day);
  };
  
  const dayEvents = (day: number) => {
    return events.filter(event => event.date.day === day);
  };
  
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(displayYear, displayMonth);
    const firstDayOfMonth = getFirstDayOfMonth(displayYear, displayMonth);
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 text-center" />);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isCurrentDay = isToday(day);
      const hasEventOnDay = hasEvent(day);
      const isSelected = selectedDay === day;
      
      days.push(
        <div
          key={day}
          className={`h-10 flex items-center justify-center rounded-full cursor-pointer transition-colors ${
            isCurrentDay ? 'bg-sabeel-primary text-white' : 
            isSelected ? 'bg-sabeel-primary/10 text-sabeel-primary' : 
            'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          onClick={() => handleDaySelect(day)}
        >
          <div className="relative">
            <span>{day}</span>
            {hasEventOnDay && !isCurrentDay && (
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-sabeel-primary" />
            )}
          </div>
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-right">التقويم الهجري</h2>
            <p className="text-gray-500 dark:text-gray-400 text-right">
              {currentHijriDate.day} {islamicMonths[currentHijriDate.month - 1].name} {currentHijriDate.year} هـ
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={displayMonth.toString()} onValueChange={(value) => setDisplayMonth(parseInt(value))}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="اختر الشهر" />
              </SelectTrigger>
              <SelectContent>
                {islamicMonths.map(month => (
                  <SelectItem key={month.id} value={month.id.toString()}>
                    {month.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={displayYear.toString()} onValueChange={(value) => setDisplayYear(parseInt(value))}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="السنة" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(10)].map((_, i) => (
                  <SelectItem key={1445 + i} value={(1445 + i).toString()}>
                    {1445 + i} هـ
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="flex-1 grid grid-cols-1 md:grid-cols-7 gap-4">
        {/* Calendar */}
        <div className="md:col-span-4">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={goToNextMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <CardTitle>
                  {islamicMonths[displayMonth - 1].name} {displayYear} هـ
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-4">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Spinner size="lg" className="mr-2" />
                  <span>جاري تحميل التقويم...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Days of Week */}
                  <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium">
                    <div>الأحد</div>
                    <div>الاثنين</div>
                    <div>الثلاثاء</div>
                    <div>الأربعاء</div>
                    <div>الخميس</div>
                    <div>الجمعة</div>
                    <div>السبت</div>
                  </div>
                  
                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-1">
                    {generateCalendarDays()}
                  </div>
                  
                  {/* Legend */}
                  <div className="flex justify-end items-center space-x-4 rtl:space-x-reverse text-sm pt-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-sabeel-primary ml-1"></div>
                      <span>اليوم</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-sabeel-primary/20 ml-1"></div>
                      <span>يوم محدد</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-1 h-1 rounded-full bg-sabeel-primary ml-1"></div>
                      <span>حدث</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Islamic Events and Prayer Times */}
        <div className="md:col-span-3 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-right">
                {selectedDay ? `أحداث ${selectedDay} ${islamicMonths[displayMonth - 1].name}` : 'أحداث الشهر'}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-4">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <Spinner size="sm" className="mr-2" />
                  <span>جاري التحميل...</span>
                </div>
              ) : selectedDay ? (
                dayEvents(selectedDay).length > 0 ? (
                  <div className="space-y-4">
                    {dayEvents(selectedDay).map((event, index) => (
                      <div 
                        key={index} 
                        className={`p-3 rounded-lg ${
                          event.type === 'holiday' 
                            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                            : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <Badge variant="outline">
                            {event.type === 'holiday' ? 'عطلة' : 'مناسبة'}
                          </Badge>
                          <h3 className="font-medium text-right">{event.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-right">
                          {event.description}
                        </p>
                      </div>
                    ))
                  }
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">لا توجد أحداث</h3>
                    <p className="text-gray-500">
                      لا توجد أحداث أو مناسبات إسلامية في هذا اليوم.
                    </p>
                  </div>
                )
              ) : (
                <div className="space-y-3">
                  {events.length > 0 ? events.map((event, index) => (
                    <div 
                      key={index}
                      className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer"
                      onClick={() => handleDaySelect(event.date.day)}
                    >
                      <Badge variant={event.type === 'holiday' ? 'default' : 'secondary'}>
                        {event.date.day}
                      </Badge>
                      <div className="text-right">
                        <p className="font-medium">{event.name}</p>
                        <p className="text-xs text-gray-500">{event.englishName}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">
                        لا توجد أحداث أو مناسبات إسلامية في هذا الشهر.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-right">أوقات الصلاة</CardTitle>
              <CardDescription className="text-right">
                مكة المكرمة - {new Date().toLocaleDateString('ar-SA', { day: 'numeric', month: 'long', year: 'numeric' })}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                <div className="flex justify-between items-center p-3">
                  <Badge>{mockPrayerTimes.fajr}</Badge>
                  <div className="flex items-center">
                    <Moon className="h-4 w-4 ml-2" />
                    <span className="font-medium">الفجر</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3">
                  <Badge>{mockPrayerTimes.sunrise}</Badge>
                  <div className="flex items-center">
                    <Sun className="h-4 w-4 ml-2" />
                    <span className="font-medium">الشروق</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3">
                  <Badge>{mockPrayerTimes.dhuhr}</Badge>
                  <div className="flex items-center">
                    <Sun className="h-4 w-4 ml-2" />
                    <span className="font-medium">الظهر</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3">
                  <Badge>{mockPrayerTimes.asr}</Badge>
                  <div className="flex items-center">
                    <Sun className="h-4 w-4 ml-2" />
                    <span className="font-medium">العصر</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3">
                  <Badge>{mockPrayerTimes.maghrib}</Badge>
                  <div className="flex items-center">
                    <Sun className="h-4 w-4 ml-2" />
                    <span className="font-medium">المغرب</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3">
                  <Badge>{mockPrayerTimes.isha}</Badge>
                  <div className="flex items-center">
                    <Moon className="h-4 w-4 ml-2" />
                    <span className="font-medium">العشاء</span>
                  </div>
                </div>
              </div>
              
              <div className="p-3 text-right">
                <Button variant="outline" size="sm" className="mt-2">
                  <MapPin className="h-4 w-4 ml-1" />
                  تغيير الموقع
                </Button>
                <Button variant="outline" size="sm" className="mt-2 mr-2">
                  <Bell className="h-4 w-4 ml-1" />
                  تنبيهات الصلاة
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IslamicCalendar;
