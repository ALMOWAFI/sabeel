/**
 * Application Configuration
 * 
 * This file provides a centralized configuration management system
 * for the Sabeel application. It pulls values from environment variables
 * and provides default values as needed.
 */

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
export const API_VERSION = 'v1';

// Feature Flags
export const ENABLE_LOGGING = import.meta.env.VITE_ENABLE_LOGGING === 'true';

// API Endpoints
export const API_ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/api/health`,
  CHAT: `${API_BASE_URL}/api/chat`,
  KNOWLEDGE_GRAPH: `${API_BASE_URL}/api/knowledge-graph`,
  USER_PREFERENCES: `${API_BASE_URL}/api/user-preferences`,
  SOURCES: `${API_BASE_URL}/api/sources`,
};

// Default timeout for API requests (in ms)
export const DEFAULT_API_TIMEOUT = 10000;

// Application information
export const APP_INFO = {
  NAME: 'سبيل | Sabeel',
  VERSION: '1.0.0',
  DESCRIPTION: 'منصة لخدمة العلم الشرعي والمجتمع الإسلامي باستخدام التقنيات الحديثة'
};
