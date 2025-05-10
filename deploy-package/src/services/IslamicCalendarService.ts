/**
 * Islamic Calendar Service
 * 
 * Tracks important Islamic and Ottoman events based on the Hijri calendar
 * and provides notifications when important dates are approaching.
 */

import { addDays, format } from 'date-fns';
import { Client, Databases, Query, ID } from 'appwrite';
import appwriteConfig from '@/lib/appwriteConfig';

// Type for Islamic Events
export interface IslamicEvent {
  id?: string;
  name: string;
  nameArabic: string;
  description: string;
  hijriDate: {
    day: number;
    month: number;
  };
  gregorianDate?: Date;
  type: 'religious' | 'historical' | 'ottoman';
  importance: 'high' | 'medium' | 'low';
  quote?: string;
  quoteAuthor?: string;
  isPublished: boolean;
  notificationSent: boolean;
  color?: string;
  icon?: string;
}

class IslamicCalendarService {
  private client: Client;
  private databases: Databases;
  private today: Date;
  private predefinedEvents: IslamicEvent[];

  constructor() {
    this.client = new Client();
    
    this.client
      .setEndpoint(appwriteConfig.endpoint)
      .setProject(appwriteConfig.projectId);
      
    this.databases = new Databases(this.client);
    this.today = new Date();
    
    // Initialize with predefined Islamic events
    this.predefinedEvents = [
      {
        name: "Islamic New Year",
        nameArabic: "رأس السنة الهجرية",
        description: "The beginning of the Islamic lunar calendar year, marking the migration (Hijra) of Prophet Muhammad ﷺ from Mecca to Medina.",
        hijriDate: { day: 1, month: 1 }, // 1 Muharram
        type: "religious",
        importance: "high",
        quote: "The best of people are those who bring most benefit to the rest of mankind.",
        quoteAuthor: "Prophet Muhammad ﷺ",
        isPublished: false,
        notificationSent: false,
        color: "#4CAF50",
        icon: "calendar-new"
      },
      {
        name: "Day of Ashura",
        nameArabic: "يوم عاشوراء",
        description: "The 10th day of Muharram, commemorating when Allah saved Prophet Musa (Moses) and the Israelites from Pharaoh.",
        hijriDate: { day: 10, month: 1 }, // 10 Muharram
        type: "religious",
        importance: "high",
        quote: "Fasting on the Day of Ashura, I hope Allah will accept it as expiation for the year that went before.",
        quoteAuthor: "Prophet Muhammad ﷺ",
        isPublished: false,
        notificationSent: false,
        color: "#5D4037",
        icon: "fast-food-off"
      },
      {
        name: "Mawlid al-Nabi (Prophet's Birthday)",
        nameArabic: "المولد النبوي",
        description: "Commemorates the birthday of the Islamic prophet Muhammad ﷺ.",
        hijriDate: { day: 12, month: 3 }, // 12 Rabi' al-Awwal
        type: "religious",
        importance: "high",
        quote: "Muhammad is not the father of any of your men, but he is the Messenger of Allah and the Seal of the Prophets.",
        quoteAuthor: "Quran 33:40",
        isPublished: false,
        notificationSent: false,
        color: "#673AB7",
        icon: "gift"
      },
      {
        name: "Beginning of Ramadan",
        nameArabic: "بداية شهر رمضان",
        description: "The beginning of the Islamic holy month of fasting (Sawm).",
        hijriDate: { day: 1, month: 9 }, // 1 Ramadan
        type: "religious",
        importance: "high",
        quote: "Whoever fasts during Ramadan out of sincere faith and hoping to attain Allah's rewards, then all his past sins will be forgiven.",
        quoteAuthor: "Prophet Muhammad ﷺ",
        isPublished: false,
        notificationSent: false,
        color: "#2196F3",
        icon: "moon"
      },
      {
        name: "Laylat al-Qadr (Night of Power)",
        nameArabic: "ليلة القدر",
        description: "The night when the Quran was first revealed to Prophet Muhammad ﷺ by Allah through the angel Jibril (Gabriel).",
        hijriDate: { day: 27, month: 9 }, // 27 Ramadan (most commonly observed)
        type: "religious",
        importance: "high",
        quote: "The Night of Decree is better than a thousand months.",
        quoteAuthor: "Quran 97:3",
        isPublished: false,
        notificationSent: false,
        color: "#9C27B0",
        icon: "star"
      },
      {
        name: "Eid al-Fitr",
        nameArabic: "عيد الفطر",
        description: "The Festival of Breaking the Fast, marking the end of Ramadan.",
        hijriDate: { day: 1, month: 10 }, // 1 Shawwal
        type: "religious",
        importance: "high",
        quote: "Eat and drink with happiness because of what you used to do.",
        quoteAuthor: "Quran 52:19",
        isPublished: false,
        notificationSent: false,
        color: "#CDDC39",
        icon: "cake"
      },
      {
        name: "Day of Arafah",
        nameArabic: "يوم عرفة",
        description: "The day when pilgrims gather on Mount Arafat during Hajj. It is considered one of the most important days in the Islamic calendar.",
        hijriDate: { day: 9, month: 12 }, // 9 Dhu al-Hijjah
        type: "religious",
        importance: "high",
        quote: "There is no day on which Allah frees more people from the Fire than the Day of Arafah.",
        quoteAuthor: "Prophet Muhammad ﷺ",
        isPublished: false,
        notificationSent: false,
        color: "#FF5722",
        icon: "mountain"
      },
      {
        name: "Eid al-Adha",
        nameArabic: "عيد الأضحى",
        description: "The Festival of Sacrifice, commemorating Prophet Ibrahim's willingness to sacrifice his son in obedience to God.",
        hijriDate: { day: 10, month: 12 }, // 10 Dhu al-Hijjah
        type: "religious",
        importance: "high",
        quote: "Their meat will not reach Allah, nor will their blood, but what reaches Him is piety from you.",
        quoteAuthor: "Quran 22:37",
        isPublished: false,
        notificationSent: false,
        color: "#FF9800",
        icon: "sheep"
      },
      // Ottoman-specific events
      {
        name: "Conquest of Constantinople",
        nameArabic: "فتح القسطنطينية",
        description: "The conquest of Constantinople (now Istanbul) by Sultan Mehmed II on May 29, 1453, marking the end of the Byzantine Empire.",
        hijriDate: { day: 20, month: 5 }, // 20 Jumada al-awwal 857 AH
        type: "ottoman",
        importance: "high",
        quote: "Verily you shall conquer Constantinople. What a wonderful leader will he be, and what a wonderful army will that army be!",
        quoteAuthor: "Prophet Muhammad ﷺ",
        isPublished: false,
        notificationSent: false,
        color: "#E91E63",
        icon: "flag"
      },
      {
        name: "Battle of Mohács",
        nameArabic: "معركة موهاكس",
        description: "A decisive Ottoman victory on August 29, 1526, which led to the partition of Hungary and established Ottoman rule in the region.",
        hijriDate: { day: 5, month: 11 }, // 5 Dhu al-Qa'dah 932 AH
        type: "ottoman",
        importance: "medium",
        quote: "Knowledge is the most valuable treasure one can attain. Learning is the most honorable deed one can perform.",
        quoteAuthor: "Sultan Suleiman the Magnificent",
        isPublished: false,
        notificationSent: false,
        color: "#3F51B5",
        icon: "sword"
      },
      {
        name: "Founding of the Ottoman Empire",
        nameArabic: "تأسيس الدولة العثمانية",
        description: "The establishment of the Ottoman Empire by Osman I in 1299 CE.",
        hijriDate: { day: 15, month: 7 }, // Approximate
        type: "ottoman",
        importance: "high",
        quote: "We are servants of Allah, and establishing justice among Allah's servants is our duty.",
        quoteAuthor: "Osman I",
        isPublished: false,
        notificationSent: false,
        color: "#607D8B",
        icon: "crown"
      }
    ];
  }

  /**
   * Convert Gregorian date to estimated Hijri date
   * Note: This is a simple approximation - a more accurate library should be used in production
   */
  private gregorianToHijri(date: Date): { year: number, month: number, day: number } {
    // Simple approximation - in production, use a proper Hijri calendar library
    const gregorianYear = date.getFullYear();
    const gregorianMonth = date.getMonth() + 1;
    const gregorianDay = date.getDate();
    
    // Approximate conversion (this is not accurate but serves as a placeholder)
    // The Islamic calendar is about 11 days shorter than the Gregorian calendar
    const hijriYear = Math.floor((gregorianYear - 622) * (33/32));
    
    // For month and day, we'd need a proper library
    // This is just a placeholder approximation
    const daysInYear = gregorianMonth <= 2 ? 
      (gregorianYear - 1) * 365 + Math.floor((gregorianYear - 1) / 4) - Math.floor((gregorianYear - 1) / 100) + Math.floor((gregorianYear - 1) / 400) :
      gregorianYear * 365 + Math.floor(gregorianYear / 4) - Math.floor(gregorianYear / 100) + Math.floor(gregorianYear / 400);
    
    const dayOfYear = daysInYear + Math.floor((367 * gregorianMonth - 362) / 12) + 
      (gregorianMonth <= 2 ? 0 : (gregorianMonth <= 2 ? 0 : (gregorianYear % 4 === 0 && (gregorianYear % 100 !== 0 || gregorianYear % 400 === 0)) ? -1 : -2)) + 
      gregorianDay;
    
    // Approximate Hijri date
    const hijriDayOfYear = (dayOfYear - 79) % 354;
    
    // Rough approximation of month and day
    const hijriMonthDays = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];
    let hijriMonth = 0;
    let daysCount = 0;
    
    while (hijriMonth < 12 && daysCount <= hijriDayOfYear) {
      daysCount += hijriMonthDays[hijriMonth];
      hijriMonth++;
    }
    
    const hijriDay = hijriDayOfYear - daysCount + hijriMonthDays[hijriMonth - 1] + 1;
    
    return {
      year: hijriYear,
      month: hijriMonth,
      day: Math.floor(hijriDay)
    };
  }

  /**
   * Convert Hijri date to estimated Gregorian date for current year
   */
  private hijriToGregorian(hijriDay: number, hijriMonth: number): Date {
    // This is a placeholder for a proper conversion
    // In a real implementation, use a proper Hijri calendar library
    
    // Current year Hijri date approximation
    const today = new Date();
    const currentHijri = this.gregorianToHijri(today);
    
    // Find the approximate number of days between current Hijri date and target date
    const hijriMonthDays = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];
    
    let daysDifference = 0;
    
    // Days remaining in current month
    daysDifference += hijriMonthDays[currentHijri.month - 1] - currentHijri.day;
    
    // Days in months between current and target
    if (hijriMonth > currentHijri.month) {
      // Target is later this year
      for (let m = currentHijri.month; m < hijriMonth - 1; m++) {
        daysDifference += hijriMonthDays[m];
      }
      daysDifference += hijriDay;
    } else if (hijriMonth < currentHijri.month) {
      // Target is next year
      for (let m = currentHijri.month; m < 12; m++) {
        daysDifference += hijriMonthDays[m];
      }
      for (let m = 0; m < hijriMonth - 1; m++) {
        daysDifference += hijriMonthDays[m];
      }
      daysDifference += hijriDay;
    } else {
      // Same month
      if (hijriDay > currentHijri.day) {
        daysDifference = hijriDay - currentHijri.day;
      } else {
        // Target is next year
        for (let m = currentHijri.month; m < 12; m++) {
          daysDifference += hijriMonthDays[m];
        }
        for (let m = 0; m < hijriMonth - 1; m++) {
          daysDifference += hijriMonthDays[m];
        }
        daysDifference += hijriDay;
      }
    }
    
    // Add days to current date
    return addDays(today, daysDifference);
  }

  /**
   * Get current Hijri date
   */
  public getCurrentHijriDate(): { year: number, month: number, day: number } {
    return this.gregorianToHijri(new Date());
  }

  /**
   * Initialize the events in the database
   */
  public async initializeEvents(): Promise<void> {
    try {
      // Check if events collection exists
      const existingEvents = await this.databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.islamicEvents
      );
      
      // If no events exist, populate with predefined events
      if (existingEvents.documents.length === 0) {
        for (const event of this.predefinedEvents) {
          // Calculate estimated Gregorian date for this year
          const gregorianDate = this.hijriToGregorian(
            event.hijriDate.day,
            event.hijriDate.month
          );
          
          await this.databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.collections.islamicEvents,
            ID.unique(),
            {
              ...event,
              gregorianDate: format(gregorianDate, 'yyyy-MM-dd'),
              isPublished: false,
              notificationSent: false
            }
          );
        }
        console.log('Islamic events initialized in database');
      }
    } catch (error) {
      console.error('Error initializing Islamic events:', error);
    }
  }

  /**
   * Get all Islamic events
   */
  public async getAllEvents(): Promise<IslamicEvent[]> {
    try {
      const response = await this.databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.islamicEvents
      );
      
      return response.documents.map(doc => ({
        id: doc.$id,
        name: doc.name,
        nameArabic: doc.nameArabic,
        description: doc.description,
        hijriDate: doc.hijriDate,
        gregorianDate: new Date(doc.gregorianDate),
        type: doc.type,
        importance: doc.importance,
        quote: doc.quote,
        quoteAuthor: doc.quoteAuthor,
        isPublished: doc.isPublished,
        notificationSent: doc.notificationSent,
        color: doc.color,
        icon: doc.icon
      }));
    } catch (error) {
      console.error('Error getting Islamic events:', error);
      return [];
    }
  }

  /**
   * Get upcoming events within the next N days
   */
  public async getUpcomingEvents(days: number = 7): Promise<IslamicEvent[]> {
    try {
      const allEvents = await this.getAllEvents();
      const today = new Date();
      const futureDate = addDays(today, days);
      
      return allEvents.filter(event => {
        const eventDate = new Date(event.gregorianDate || '');
        return eventDate >= today && eventDate <= futureDate;
      });
    } catch (error) {
      console.error('Error getting upcoming Islamic events:', error);
      return [];
    }
  }

  /**
   * Get today's events
   */
  public async getTodayEvents(): Promise<IslamicEvent[]> {
    try {
      const allEvents = await this.getAllEvents();
      const today = new Date();
      const todayString = format(today, 'yyyy-MM-dd');
      
      return allEvents.filter(event => {
        const eventDate = format(new Date(event.gregorianDate || ''), 'yyyy-MM-dd');
        return eventDate === todayString;
      });
    } catch (error) {
      console.error('Error getting today\'s Islamic events:', error);
      return [];
    }
  }

  /**
   * Update an event's publication status
   */
  public async updateEventPublicationStatus(eventId: string, isPublished: boolean): Promise<void> {
    try {
      await this.databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.islamicEvents,
        eventId,
        { isPublished }
      );
    } catch (error) {
      console.error('Error updating event publication status:', error);
      throw error;
    }
  }

  /**
   * Mark notification as sent for an event
   */
  public async markNotificationSent(eventId: string): Promise<void> {
    try {
      await this.databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.islamicEvents,
        eventId,
        { notificationSent: true }
      );
    } catch (error) {
      console.error('Error marking notification as sent:', error);
      throw error;
    }
  }

  /**
   * Add a custom Islamic event
   */
  public async addCustomEvent(event: Omit<IslamicEvent, 'id' | 'isPublished' | 'notificationSent'>): Promise<IslamicEvent> {
    try {
      // Calculate estimated Gregorian date for this year
      const gregorianDate = this.hijriToGregorian(
        event.hijriDate.day,
        event.hijriDate.month
      );
      
      const response = await this.databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.islamicEvents,
        ID.unique(),
        {
          ...event,
          gregorianDate: format(gregorianDate, 'yyyy-MM-dd'),
          isPublished: false,
          notificationSent: false
        }
      );
      
      return {
        id: response.$id,
        ...event,
        gregorianDate: gregorianDate,
        isPublished: false,
        notificationSent: false
      };
    } catch (error) {
      console.error('Error adding custom Islamic event:', error);
      throw error;
    }
  }

  /**
   * Update an existing event
   */
  public async updateEvent(eventId: string, updates: Partial<IslamicEvent>): Promise<void> {
    try {
      // If hijri date is updated, recalculate gregorian date
      if (updates.hijriDate) {
        const gregorianDate = this.hijriToGregorian(
          updates.hijriDate.day,
          updates.hijriDate.month
        );
        
        updates.gregorianDate = gregorianDate;
      }
      
      await this.databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.islamicEvents,
        eventId,
        updates as any
      );
    } catch (error) {
      console.error('Error updating Islamic event:', error);
      throw error;
    }
  }

  /**
   * Delete an event
   */
  public async deleteEvent(eventId: string): Promise<void> {
    try {
      await this.databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.islamicEvents,
        eventId
      );
    } catch (error) {
      console.error('Error deleting Islamic event:', error);
      throw error;
    }
  }

  /**
   * Check for upcoming events and return events that need notifications
   */
  public async checkForNotifications(daysAhead: number = 3): Promise<IslamicEvent[]> {
    try {
      const upcomingEvents = await this.getUpcomingEvents(daysAhead);
      
      // Filter for events where notification hasn't been sent
      return upcomingEvents.filter(event => !event.notificationSent);
    } catch (error) {
      console.error('Error checking for notifications:', error);
      return [];
    }
  }
}

// Export as singleton
export default new IslamicCalendarService();
