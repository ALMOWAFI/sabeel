/**
 * User type definitions for Sabeel platform
 */

export interface User {
  userId: string;
  email: string;
  name: string;
  memberType: 'regular' | 'premium';
  role: 'member' | 'moderator' | 'admin' | 'scholar';
  createdAt: string;
  avatarUrl?: string;
  scholarRank?: 'apprentice' | 'commander' | 'guardian';
  technologistLevel?: 'beginner' | 'intermediate' | 'expert';
  specializations?: string[];
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'ar' | 'en' | 'tr' | 'fr' | 'ur';
  fontSize: 'small' | 'medium' | 'large';
  reduceAnimations: boolean;
  highContrast: boolean;
  autoTranslate: boolean;
  contentCategories: string[];
  scholarPreferences?: ScholarPreferences;
  technologistPreferences?: TechnologistPreferences;
}

export interface ScholarPreferences {
  reviewNotifications: boolean;
  preferredCategories: string[];
  expertiseAreas: string[];
  availableForCollaboration: boolean;
}

export interface TechnologistPreferences {
  skillSet: string[];
  projectInterests: string[];
  availableForCollaboration: boolean;
  aiTools: string[];
}

export interface UserActivity {
  id: string;
  userId: string;
  activityType: string;
  details: any;
  timestamp: string;
}

export interface ScholarVerification {
  id: string;
  userId: string;
  scholarId: string;
  documentType: string;
  documentId: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs_revision';
  feedback?: string;
  timestamp: string;
}
