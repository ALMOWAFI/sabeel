/**
 * UserPreferencesService.ts
 * 
 * Service for managing user preferences and customization
 * for the Sabeel platform.
 */

import { API_ENDPOINTS } from '../lib/config';

/**
 * Interface for user preferences
 */
export interface UserPreferences {
  // General preferences
  language: string;
  theme: 'light' | 'dark' | 'system';
  uiDirection: 'ltr' | 'rtl';
  notifications: boolean;
  useSourceCitations: boolean;
  autoTranslate: boolean;
  
  // Accessibility preferences
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    screenReader: boolean;
    reducedMotion: boolean;
  };
  
  // Content preferences
  content: {
    showArabicVowels: boolean;
    showTranslation: boolean;
    showTransliteration: boolean;
    preferredScriptType: 'uthmani' | 'indopak' | 'simple';
    preferredTranslation: string;
    preferredTafsir: string;
    madhab: 'hanafi' | 'shafi' | 'maliki' | 'hanbali' | 'any';
    quranFont: string;
    quranFontSize: number;
    tajweedRules: boolean;
    memorizationMode: boolean;
    // Enhanced Quran display preferences
    wordByWordTranslation: boolean;
    wordByWordGrammar: boolean;
    highlightTajweedRules: 'none' | 'basic' | 'detailed';
    recitationStyle: 'murattal' | 'mujawwad' | 'muallim';
    // Madhab-based content filtering
    contentFilter: 'strict' | 'moderate' | 'inclusive';
    showAllMadhabOpinions: boolean;
    primaryMadhab: 'hanafi' | 'shafi' | 'maliki' | 'hanbali';
    secondaryMadhab: 'hanafi' | 'shafi' | 'maliki' | 'hanbali' | 'none';
  };
  
  // Prayer preferences
  prayer: {
    calculationMethod: 'mwl' | 'isna' | 'egypt' | 'makkah' | 'karachi' | 'tehran' | 'jafari';
    asrJuristic: 'standard' | 'hanafi';
    adjustHighLatitudes: 'none' | 'midnight' | 'oneSeventh' | 'angleBased';
    timeFormat: '24h' | '12h';
    showNotifications: boolean;
    // Enhanced prayer settings
    prayerNotificationAdvance: number; // minutes before prayer
    prayerNotificationSound: string;
    prayerNotificationVibration: boolean;
    autoAdjustForDst: boolean;
    autoAdjustForTravel: boolean;
    prayerTimesLanguage: 'arabic' | 'local' | 'both';
    showSunriseTime: boolean;
    showMidnightTime: boolean;
    showQiblaDirection: boolean;
    // Ramadan specific settings
    ramadanSettings: {
      enableSuhoorReminder: boolean;
      suhoorReminderTime: number; // minutes before fajr
      enableIftarReminder: boolean;
      iftarReminderTime: number; // minutes before maghrib
      showRamadanCalendar: boolean;
    };
  };
  
  // Islamic Calendar preferences
  islamicCalendar: {
    calendarType: 'hijri' | 'gregorian' | 'both';
    hijriAdjustment: number; // +/- days for local moonsighting
    displayFormat: 'arabic' | 'latin' | 'both';
    highlightIslamicEvents: boolean;
    highlightIslamicMonths: boolean;
    showHijriDates: boolean;
    preferredCalculation: 'ummulqura' | 'karachi' | 'isna' | 'mwl';
  };
  
  // Qibla Direction settings
  qibla: {
    useDeviceSensors: boolean;
    manualCoordinates: boolean;
    latitude: number | null;
    longitude: number | null;
    showCompassView: boolean;
    showQiblaMap: boolean;
    qiblaMapType: 'simple' | 'satellite' | 'terrain';
  };
  
  // Dashboard preferences
  dashboard: {
    layout: 'grid' | 'list';
    widgets: string[];
    defaultView: string;
  };
  
  // Integration preferences
  integrations: {
    canvas: boolean;
    jupyter: boolean;
    peertube: boolean;
    h5p: boolean;
    kingraph: boolean;
  };
  
  // Version tracking for migrations
  version: string;
}

/**
 * Default user preferences
 */
const DEFAULT_PREFERENCES: UserPreferences = {
  language: 'ar',
  theme: 'light',
  uiDirection: 'rtl',
  notifications: true,
  useSourceCitations: true,
  autoTranslate: false,
  
  accessibility: {
    highContrast: false,
    largeText: false,
    screenReader: false,
    reducedMotion: false
  },
  
  content: {
    showArabicVowels: true,
    showTranslation: true,
    showTransliteration: false,
    preferredScriptType: 'uthmani',
    preferredTranslation: 'saheeh',
    preferredTafsir: 'ibn-kathir',
    madhab: 'any',
    quranFont: 'Uthmani',
    quranFontSize: 18,
    tajweedRules: true,
    memorizationMode: false,
    // Enhanced Quran display preferences
    wordByWordTranslation: false,
    wordByWordGrammar: false,
    highlightTajweedRules: 'basic',
    recitationStyle: 'murattal',
    // Madhab-based content filtering
    contentFilter: 'moderate',
    showAllMadhabOpinions: true,
    primaryMadhab: 'hanafi',
    secondaryMadhab: 'none'
  },
  
  prayer: {
    calculationMethod: 'mwl',
    asrJuristic: 'standard',
    adjustHighLatitudes: 'angleBased',
    timeFormat: '24h',
    showNotifications: true,
    // Enhanced prayer settings
    prayerNotificationAdvance: 15, // 15 minutes before prayer
    prayerNotificationSound: 'adhan',
    prayerNotificationVibration: true,
    autoAdjustForDst: true,
    autoAdjustForTravel: false,
    prayerTimesLanguage: 'both',
    showSunriseTime: true,
    showMidnightTime: false,
    showQiblaDirection: true,
    // Ramadan specific settings
    ramadanSettings: {
      enableSuhoorReminder: true,
      suhoorReminderTime: 45, // 45 minutes before fajr
      enableIftarReminder: true,
      iftarReminderTime: 15, // 15 minutes before maghrib
      showRamadanCalendar: true
    }
  },
  
  // Islamic Calendar preferences
  islamicCalendar: {
    calendarType: 'both',
    hijriAdjustment: 0,
    displayFormat: 'both',
    highlightIslamicEvents: true,
    highlightIslamicMonths: true,
    showHijriDates: true,
    preferredCalculation: 'ummulqura'
  },
  
  // Qibla Direction settings
  qibla: {
    useDeviceSensors: true,
    manualCoordinates: false,
    latitude: null,
    longitude: null,
    showCompassView: true,
    showQiblaMap: true,
    qiblaMapType: 'simple'
  },
  
  dashboard: {
    layout: 'grid',
    widgets: ['quran', 'calendar', 'courses', 'resources'],
    defaultView: 'home'
  },
  
  integrations: {
    canvas: true,
    jupyter: true,
    peertube: true,
    h5p: true,
    kingraph: true
  },
  
  version: '2.0.0' // Updated version for enhanced Islamic features
};

/**
 * Service for managing user preferences
 */
export class UserPreferencesService {
  private static instance: UserPreferencesService;
  private preferences: UserPreferences;
  private storageKey = 'sabeel_user_preferences';
  private apiUrl = API_ENDPOINTS.USER_PREFERENCES;
  private preferenceChangeListeners: Array<(preferences: UserPreferences) => void> = [];
  private syncInProgress = false;
  private syncInterval: number | null = null;
  private currentVersion = '2.0.0'; // Updated version for enhanced Islamic features
  
  /**
   * Get singleton instance
   */
  public static getInstance(): UserPreferencesService {
    if (!UserPreferencesService.instance) {
      UserPreferencesService.instance = new UserPreferencesService();
    }
    
    return UserPreferencesService.instance;
  }
  
  /**
   * Private constructor for singleton pattern
   */
  private constructor() {
    this.preferences = this.loadFromLocalStorage() || DEFAULT_PREFERENCES;
    this.migratePreferencesIfNeeded();
    this.setupSyncInterval();
    this.setupSystemThemeListener();
  }
  
  /**
   * Load preferences from localStorage
   */
  private loadFromLocalStorage(): UserPreferences | null {
    try {
      const storedPrefs = localStorage.getItem(this.storageKey);
      
      if (storedPrefs) {
        return JSON.parse(storedPrefs) as UserPreferences;
      }
      
      return null;
    } catch (error) {
      console.error('Error loading preferences from localStorage:', error);
      return null;
    }
  }
  
  /**
   * Migrate preferences to the latest version if needed
   */
  private migratePreferencesIfNeeded(): void {
    if (!this.preferences.version || this.preferences.version !== this.currentVersion) {
      console.log(`Migrating preferences from ${this.preferences.version || 'unknown'} to ${this.currentVersion}`);
      
      // Ensure all new properties exist
      const migratedPreferences = this.mergePreferences(DEFAULT_PREFERENCES);
      
      // Set the new version
      migratedPreferences.version = this.currentVersion;
      
      // Save the migrated preferences
      this.preferences = migratedPreferences;
      this.saveToLocalStorage(migratedPreferences);
      
      // Sync with API on next save
      this.syncWithAPI();
    }
  }
  
  /**
   * Setup interval to periodically sync preferences with API
   */
  private setupSyncInterval(): void {
    // Sync every 5 minutes if user is active
    this.syncInterval = window.setInterval(() => {
      if (document.visibilityState === 'visible' && !this.syncInProgress) {
        this.syncWithAPI();
      }
    }, 5 * 60 * 1000);
    
    // Also sync when tab becomes visible again
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && !this.syncInProgress) {
        this.syncWithAPI();
      }
    });
  }
  
  /**
   * Setup listener for system theme changes
   */
  private setupSystemThemeListener(): void {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // Initial check
      if (this.preferences.theme === 'system') {
        this.applyTheme();
      }
      
      // Listen for changes
      mediaQuery.addEventListener('change', () => {
        if (this.preferences.theme === 'system') {
          this.applyTheme();
        }
      });
    }
  }
  
  /**
   * Save preferences to localStorage
   */
  private saveToLocalStorage(preferences: UserPreferences): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving preferences to localStorage:', error);
    }
  }
  
  /**
   * Get all user preferences
   */
  public async getPreferences(): Promise<UserPreferences> {
    // Return cached preferences immediately
    if (this.preferences) {
      return this.preferences;
    }
    
    // Try to load from localStorage
    const localPrefs = this.loadFromLocalStorage();
    if (localPrefs) {
      this.preferences = localPrefs;
      this.migratePreferencesIfNeeded();
      return this.preferences;
    }
    
    // If not in localStorage, try to fetch from API
    try {
      const response = await fetch(this.apiUrl, {
        credentials: 'include' // Include cookies for authentication
      });
      
      if (response.ok) {
        const data = await response.json();
        this.preferences = data.preferences;
        
        // Migrate if needed
        this.migratePreferencesIfNeeded();
        
        // Save to localStorage for future use
        this.saveToLocalStorage(this.preferences);
        
        return this.preferences;
      }
      
      // If API request fails, use defaults
      this.preferences = DEFAULT_PREFERENCES;
      return DEFAULT_PREFERENCES;
    } catch (error) {
      console.error('Error fetching preferences from API:', error);
      
      // Use defaults if API request fails
      this.preferences = DEFAULT_PREFERENCES;
      return DEFAULT_PREFERENCES;
    }
  }
  
  /**
   * Save user preferences
   * @param preferences - User preferences to save
   */
  public async savePreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    // Merge with existing preferences
    const updatedPreferences = this.mergePreferences(preferences);
    
    // Ensure version is set
    updatedPreferences.version = this.currentVersion;
    
    // Save to localStorage first for resilience
    this.saveToLocalStorage(updatedPreferences);
    
    // Update cached preferences
    this.preferences = updatedPreferences;
    
    // Notify listeners
    this.notifyPreferenceChangeListeners(updatedPreferences);
    
    // Apply changes immediately
    this.applyAllPreferences();
    
    // Then save to API
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ preferences: updatedPreferences }),
        credentials: 'include' // Include cookies for authentication
      });
      
      if (!response.ok) {
        throw new Error(`Failed to save preferences: ${response.status}`);
      }
      
      return updatedPreferences;
    } catch (error) {
      console.error('Error saving preferences to API:', error);
      return updatedPreferences;
    }
  }
  
  /**
   * Sync preferences with the API
   */
  private async syncWithAPI(): Promise<void> {
    if (this.syncInProgress || !this.preferences) {
      return;
    }
    
    this.syncInProgress = true;
    
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ preferences: this.preferences }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to sync preferences: ${response.status}`);
      }
      
      console.log('Preferences synced with API successfully');
    } catch (error) {
      console.error('Error syncing preferences with API:', error);
    } finally {
      this.syncInProgress = false;
    }
  }
  
  /**
   * Add a listener for preference changes
   * @param listener - Function to call when preferences change
   */
  public addPreferenceChangeListener(listener: (preferences: UserPreferences) => void): void {
    this.preferenceChangeListeners.push(listener);
  }
  
  /**
   * Remove a preference change listener
   * @param listener - The listener to remove
   */
  public removePreferenceChangeListener(listener: (preferences: UserPreferences) => void): void {
    const index = this.preferenceChangeListeners.indexOf(listener);
    if (index !== -1) {
      this.preferenceChangeListeners.splice(index, 1);
    }
  }
  
  /**
   * Notify all listeners of preference changes
   * @param preferences - The updated preferences
   */
  private notifyPreferenceChangeListeners(preferences: UserPreferences): void {
    this.preferenceChangeListeners.forEach(listener => {
      try {
        listener(preferences);
      } catch (error) {
        console.error('Error in preference change listener:', error);
      }
    });
  }
  
  /**
   * Merge partial preferences with existing preferences
   * @param partialPreferences - Partial preferences to merge
   */
  private mergePreferences(partialPreferences: Partial<UserPreferences>): UserPreferences {
    // Start with current preferences
    const current = this.preferences || DEFAULT_PREFERENCES;
    
    // Deep merge the objects
    return {
      ...current,
      ...partialPreferences,
      accessibility: {
        ...current.accessibility,
        ...partialPreferences.accessibility
      },
      content: {
        ...current.content,
        ...partialPreferences.content
      },
      prayer: {
        ...current.prayer,
        ...partialPreferences.prayer
      },
      dashboard: {
        ...current.dashboard,
        ...partialPreferences.dashboard,
        widgets: partialPreferences.dashboard?.widgets || current.dashboard.widgets
      },
      integrations: {
        ...current.integrations,
        ...partialPreferences.integrations
      }
    };
  }
  
  /**
   * Apply theme preference to the document
   */
  public applyTheme(): void {
    const theme = this.preferences?.theme || 'light';
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (theme === 'system') {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }
  
  /**
   * Apply language and direction preferences
   */
  public applyLanguage(): void {
    const language = this.preferences?.language || 'ar';
    const direction = this.preferences?.uiDirection || 'rtl';
    
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    
    // Add appropriate class for RTL styling
    if (direction === 'rtl') {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }
  }
  
  /**
   * Apply accessibility preferences
   */
  public applyAccessibility(): void {
    const accessibility = this.preferences?.accessibility || DEFAULT_PREFERENCES.accessibility;
    
    // Apply high contrast
    document.documentElement.classList.toggle('high-contrast', accessibility.highContrast);
    
    // Apply large text
    document.documentElement.classList.toggle('large-text', accessibility.largeText);
    
    // Apply reduced motion
    document.documentElement.classList.toggle('reduced-motion', accessibility.reducedMotion);
  }
  
  /**
   * Apply prayer preferences
   */
  public applyPrayerPreferences(): void {
    // This method would integrate with a prayer times calculation system
    // and update any UI elements related to prayer times
    const prayer = this.preferences?.prayer || DEFAULT_PREFERENCES.prayer;
    
    // Apply prayer-specific attributes to document for CSS targeting
    document.documentElement.setAttribute('data-calculation-method', prayer.calculationMethod);
    document.documentElement.setAttribute('data-asr-juristic', prayer.asrJuristic);
    document.documentElement.setAttribute('data-time-format', prayer.timeFormat);
    
    // Handle Ramadan-specific settings if it's Ramadan
    const isRamadan = this.isRamadanMonth();
    document.documentElement.classList.toggle('ramadan-mode', isRamadan);
    
    if (isRamadan && prayer.ramadanSettings.showRamadanCalendar) {
      // Enable Ramadan calendar display
      document.documentElement.classList.add('show-ramadan-calendar');
    } else {
      document.documentElement.classList.remove('show-ramadan-calendar');
    }
    
    // Dispatch an event that prayer-related components can listen for
    const event = new CustomEvent('prayer-preferences-changed', { 
      detail: { preferences: prayer } 
    });
    document.dispatchEvent(event);
  }
  
  /**
   * Apply content preferences
   */
  public applyContentPreferences(): void {
    const content = this.preferences?.content || DEFAULT_PREFERENCES.content;
    
    // Apply madhab preference and other content settings
    document.documentElement.setAttribute('data-madhab', content.madhab);
    document.documentElement.setAttribute('data-script-type', content.preferredScriptType);
    document.documentElement.classList.toggle('tajweed-enabled', content.tajweedRules);
    document.documentElement.classList.toggle('memorization-mode', content.memorizationMode);
    
    // Apply enhanced Quran display preferences
    document.documentElement.classList.toggle('word-by-word-translation', content.wordByWordTranslation);
    document.documentElement.classList.toggle('word-by-word-grammar', content.wordByWordGrammar);
    document.documentElement.setAttribute('data-tajweed-highlight', content.highlightTajweedRules);
    document.documentElement.setAttribute('data-recitation-style', content.recitationStyle);
    
    // Apply madhab-based content filtering
    document.documentElement.setAttribute('data-content-filter', content.contentFilter);
    document.documentElement.classList.toggle('show-all-madhab-opinions', content.showAllMadhabOpinions);
    document.documentElement.setAttribute('data-primary-madhab', content.primaryMadhab);
    document.documentElement.setAttribute('data-secondary-madhab', content.secondaryMadhab);
    
    // Dispatch an event that content-related components can listen for
    const event = new CustomEvent('content-preferences-changed', { 
      detail: { preferences: content } 
    });
    document.dispatchEvent(event);
  }
  
  /**
   * Apply Islamic calendar preferences
   */
  public applyIslamicCalendarPreferences(): void {
    const islamicCalendar = this.preferences?.islamicCalendar || DEFAULT_PREFERENCES.islamicCalendar;
    
    // Apply Islamic calendar attributes to document
    document.documentElement.setAttribute('data-calendar-type', islamicCalendar.calendarType);
    document.documentElement.setAttribute('data-hijri-display', islamicCalendar.displayFormat);
    document.documentElement.setAttribute('data-hijri-calculation', islamicCalendar.preferredCalculation);
    
    // Toggle classes for highlighting Islamic events and months
    document.documentElement.classList.toggle('highlight-islamic-events', islamicCalendar.highlightIslamicEvents);
    document.documentElement.classList.toggle('highlight-islamic-months', islamicCalendar.highlightIslamicMonths);
    document.documentElement.classList.toggle('show-hijri-dates', islamicCalendar.showHijriDates);
    
    // Dispatch an event that calendar-related components can listen for
    const event = new CustomEvent('islamic-calendar-preferences-changed', { 
      detail: { preferences: islamicCalendar } 
    });
    document.dispatchEvent(event);
  }
  
  /**
   * Apply Qibla direction preferences
   */
  private applyQiblaDirectionLegacy(): void {
    // This method is kept for backward compatibility
    // The main implementation is now in applyQiblaPreferences()
    this.applyQiblaPreferences();
    // Event dispatch is now handled in the main applyQiblaPreferences method
  }
  
  /**
   * Calculate Qibla direction based on user's location
   * @param latitude User's latitude
   * @param longitude User's longitude
   * @returns Direction in degrees from North (clockwise)
   */
  public calculateQiblaDirection(latitude: number, longitude: number): number {
    try {
      // Coordinates of Kaaba in Mecca
      const kaabaLatitude = 21.4225;
      const kaabaLongitude = 39.8262;
      
      // Convert to radians
      const lat1 = this.toRadians(latitude);
      const lon1 = this.toRadians(longitude);
      const lat2 = this.toRadians(kaabaLatitude);
      const lon2 = this.toRadians(kaabaLongitude);
      
      // Calculate Qibla direction
      const y = Math.sin(lon2 - lon1);
      const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(lon2 - lon1);
      let qiblaDirection = Math.atan2(y, x);
      
      // Convert to degrees
      qiblaDirection = this.toDegrees(qiblaDirection);
      
      // Normalize to 0-360
      qiblaDirection = (qiblaDirection + 360) % 360;
      
      return qiblaDirection;
    } catch (error) {
      console.error('Error calculating Qibla direction:', error);
      return 0;
    }
  }
  
  /**
   * Convert degrees to radians
   */
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
  
  /**
   * Convert radians to degrees
   */
  private toDegrees(radians: number): number {
    return radians * (180 / Math.PI);
  }
  
  /**
   * Get user's current location and update Qibla direction
   * This method would be called when user wants to use device location for Qibla direction
   */
  public async updateQiblaWithCurrentLocation(): Promise<boolean> {
    if (!this.preferences || !this.preferences.qibla.useDeviceSensors) {
      return false;
    }
    
    try {
      // Check if geolocation is available
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser');
      }
      
      // Get current position
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });
      
      // Update preferences with current location
      const updatedQibla = {
        ...this.preferences.qibla,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      
      // Save updated preferences
      await this.savePreferences({
        qibla: updatedQibla
      });
      
      // Calculate and dispatch Qibla direction
      const qiblaDirection = this.calculateQiblaDirection(
        position.coords.latitude,
        position.coords.longitude
      );
      
      // Dispatch event with calculated direction
      const event = new CustomEvent('qibla-direction-updated', {
        detail: {
          direction: qiblaDirection,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
      });
      document.dispatchEvent(event);
      
      return true;
    } catch (error) {
      console.error('Error updating Qibla with current location:', error);
      return false;
    }
  }
  
  /**
   * Check if current month is Ramadan based on Islamic calendar
   * This is a simplified implementation - a real implementation would use proper Hijri date calculations
   */
  private isRamadanMonth(): boolean {
    // In a real implementation, this would calculate if the current date falls in Ramadan
    // For now, we'll use a placeholder implementation
    try {
      // Get current date
      const today = new Date();
      
      // Use the Islamic calendar preferences for calculation
      const islamicCalendar = this.preferences?.islamicCalendar || DEFAULT_PREFERENCES.islamicCalendar;
      
      // This would be replaced with actual Hijri date calculation based on islamicCalendar.preferredCalculation
      // For now, return false as a placeholder
      return false;
    } catch (error) {
      console.error('Error determining Ramadan month:', error);
      return false;
    }
  }
  
  /**
   * Configure Ramadan-specific settings
   * This method would be called when Ramadan is detected or when user manually enables Ramadan mode
   */
  public configureRamadanSettings(enable: boolean = true): void {
    if (!this.preferences) {
      return;
    }
    
    // Get prayer preferences
    const prayer = this.preferences.prayer;
    
    if (enable) {
      // Enable Ramadan-specific UI elements
      document.documentElement.classList.add('ramadan-mode');
      
      // Show Ramadan calendar if enabled in preferences
      if (prayer.ramadanSettings.showRamadanCalendar) {
        document.documentElement.classList.add('show-ramadan-calendar');
      }
      
      // Dispatch Ramadan mode enabled event
      const enableEvent = new CustomEvent('ramadan-mode-enabled', {
        detail: { preferences: prayer.ramadanSettings }
      });
      document.dispatchEvent(enableEvent);
    } else {
      // Disable Ramadan-specific UI elements
      document.documentElement.classList.remove('ramadan-mode');
      document.documentElement.classList.remove('show-ramadan-calendar');
      
      // Dispatch Ramadan mode disabled event
      const disableEvent = new CustomEvent('ramadan-mode-disabled');
      document.dispatchEvent(disableEvent);
    }
  }
  
  /**
   * Apply Qibla preferences
   */
  public applyQiblaPreferences(): void {
    const qibla = this.preferences?.qibla || DEFAULT_PREFERENCES.qibla;
    
    // Apply Qibla-specific attributes to document
    document.documentElement.classList.toggle('use-device-sensors', qibla.useDeviceSensors);
    document.documentElement.classList.toggle('manual-coordinates', qibla.manualCoordinates);
    document.documentElement.classList.toggle('show-compass-view', qibla.showCompassView);
    document.documentElement.classList.toggle('show-qibla-map', qibla.showQiblaMap);
    document.documentElement.setAttribute('data-qibla-map-type', qibla.qiblaMapType);
    
    // If coordinates are available, calculate and set Qibla direction
    if (qibla.latitude !== null && qibla.longitude !== null) {
      const qiblaDirection = this.calculateQiblaDirection(qibla.latitude, qibla.longitude);
      document.documentElement.style.setProperty('--qibla-direction', `${qiblaDirection}deg`);
    }
    
    // Dispatch an event that Qibla-related components can listen for
    const event = new CustomEvent('qibla-preferences-changed', { 
      detail: { preferences: qibla } 
    });
    document.dispatchEvent(event);
  }
  
  /**
   * Apply all preferences to the document
   */
  public applyAllPreferences(): void {
    this.applyTheme();
    this.applyLanguage();
    this.applyAccessibility();
    this.applyContentPreferences();
    this.applyPrayerPreferences();
    this.applyIslamicCalendarPreferences();
    this.applyQiblaPreferences();
  }
  
  /**
   * Reset preferences to defaults
   */
  public async resetPreferences(): Promise<UserPreferences> {
    return this.savePreferences(DEFAULT_PREFERENCES);
  }
  
  /**
   * Clean up resources when service is no longer needed
   */
  public dispose(): void {
    // Clear sync interval
    if (this.syncInterval !== null) {
      window.clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    
    // Clear all listeners
    this.preferenceChangeListeners = [];
  }
}