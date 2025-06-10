/**
 * Collections type definitions for Sabeel platform
 * 
 * This file defines the collection IDs used across both Appwrite and Supabase implementations,
 * ensuring consistency when accessing database resources.
 */

export enum Collections {
  // User-related collections
  USERS = 'users',
  PROFILES = 'profiles',
  USER_ACTIVITIES = 'user_activities',
  
  // Content collections
  JOB_OPENINGS = 'job_openings',
  WHATSAPP_GROUPS = 'whatsapp_groups',
  EVENTS = 'events',
  NOTIFICATIONS = 'notifications',
  CONTENT_ITEMS = 'content_items',
  
  // Islamic knowledge collections
  QURAN_VERSES = 'quran_verses',
  HADITH = 'hadith',
  SCHOLARLY_WORKS = 'scholarly_works',
  ISLAMIC_ARTICLES = 'islamic_articles',
  
  // AI and knowledge protection
  CONTENT_VERIFICATIONS = 'content_verifications',
  SCHOLAR_REVIEW_QUEUE = 'scholar_review_queue',
  ISLAMIC_AI_GUIDELINES = 'islamic_ai_guidelines',
  
  // Collaboration tools
  SCHOLAR_TECHNOLOGIST_PROJECTS = 'scholar_technologist_projects',
  PROJECT_CONTRIBUTIONS = 'project_contributions',
  COLLABORATION_MESSAGES = 'collaboration_messages',
  
  // Education and training
  COURSES = 'courses',
  LESSONS = 'lessons',
  QUIZ_QUESTIONS = 'quiz_questions',
  STUDENT_PROGRESS = 'student_progress',
}

// Mapping Appwrite collection IDs to Supabase table names
export const CollectionMapping = {
  [Collections.USERS]: 'profiles',
  [Collections.PROFILES]: 'profiles',
  [Collections.USER_ACTIVITIES]: 'user_activities',
  
  [Collections.JOB_OPENINGS]: 'job_openings',
  [Collections.WHATSAPP_GROUPS]: 'whatsapp_groups',
  [Collections.EVENTS]: 'events',
  [Collections.NOTIFICATIONS]: 'notifications',
  [Collections.CONTENT_ITEMS]: 'content_items',
  
  [Collections.QURAN_VERSES]: 'quran_verses',
  [Collections.HADITH]: 'hadith',
  [Collections.SCHOLARLY_WORKS]: 'scholarly_works',
  [Collections.ISLAMIC_ARTICLES]: 'islamic_articles',
  
  [Collections.CONTENT_VERIFICATIONS]: 'content_verifications',
  [Collections.SCHOLAR_REVIEW_QUEUE]: 'scholar_review_queue',
  [Collections.ISLAMIC_AI_GUIDELINES]: 'islamic_ai_guidelines',
  
  [Collections.SCHOLAR_TECHNOLOGIST_PROJECTS]: 'scholar_technologist_projects',
  [Collections.PROJECT_CONTRIBUTIONS]: 'project_contributions',
  [Collections.COLLABORATION_MESSAGES]: 'collaboration_messages',
  
  [Collections.COURSES]: 'courses',
  [Collections.LESSONS]: 'lessons',
  [Collections.QUIZ_QUESTIONS]: 'quiz_questions',
  [Collections.STUDENT_PROGRESS]: 'student_progress',
};
