# Sabeel Platform Enhancement Implementation Plan

## Overview

This document outlines the implementation plan for enhancing the Sabeel Islamic Knowledge Platform by addressing the following key areas:

1. Connecting to Real APIs
2. Implementing Authentication
3. Adding Collaborative Features
4. Optimizing Performance
5. Adding User Customization

## 1. Connecting to Real APIs

### Canvas LMS Integration

#### Current State
The `SabeelCanvasAPI` class currently uses mock data instead of connecting to a real Canvas LMS instance.

#### Implementation Steps

1. **Update API Configuration**
   - Modify `integration/config.json` to include real Canvas LMS API endpoints
   - Add environment variables for API keys and secrets

2. **Enhance SabeelCanvasAPI Class**
   ```javascript
   // Update constructor to use real API endpoints
   constructor(options = {}) {
     this.baseUrl = options.baseUrl || process.env.CANVAS_API_URL || 'https://canvas.instructure.com/api/v1';
     this.token = options.token || process.env.CANVAS_API_TOKEN;
     // ... rest of constructor
   }
   ```

3. **Implement Rate Limiting and Error Handling**
   - Add request throttling to respect API rate limits
   - Implement comprehensive error handling for API responses
   - Add retry logic for failed requests

4. **Create API Adapters**
   - Develop adapter classes to normalize data between Canvas and Sabeel
   - Implement caching layer to reduce API calls

### Jupyter Integration

1. **Connect to Real Jupyter Hub**
   - Update configuration in `integration/jupyter/config.yml`
   - Implement JupyterHub API client for authentication and notebook management

2. **Implement Notebook Operations**
   - Create, read, update, and delete notebooks
   - Execute code cells and retrieve results
   - Share notebooks with other users

## 2. Implementing Authentication

### OAuth Implementation

1. **Set Up OAuth Providers**
   - Configure OAuth for Canvas LMS
   - Set up OAuth for JupyterHub
   - Implement social login options (Google, Microsoft, etc.)

2. **Enhance AuthService**
   ```typescript
   // Add OAuth methods to AuthService.ts
   public async loginWithOAuth(provider: string): Promise<User> {
     const authUrl = this.getOAuthUrl(provider);
     // Redirect to OAuth provider
     window.location.href = authUrl;
     return null;
   }

   public async handleOAuthCallback(provider: string, code: string): Promise<User> {
     // Exchange code for tokens
     const tokens = await this.exchangeCodeForTokens(provider, code);
     // Process tokens and get user info
     return this.processOAuthLogin(provider, tokens);
   }
   ```

3. **Implement JWT Authentication**
   - Generate and validate JWT tokens
   - Store tokens securely (HTTP-only cookies)
   - Implement token refresh mechanism

4. **Create Authentication Middleware**
   - Protect API routes
   - Validate user permissions
   - Handle cross-origin requests

## 3. Adding Collaborative Features

### Real-time Collaboration

1. **Implement WebSocket Support**
   - Set up WebSocket server
   - Create client-side WebSocket connection manager
   - Implement message handlers for different collaboration events

2. **Collaborative Document Editing**
   ```typescript
   // Create CollaborationService.ts
   export class CollaborationService {
     private socket: WebSocket;
     private documentId: string;
     private collaborators: Map<string, User> = new Map();

     constructor(documentId: string) {
       this.documentId = documentId;
       this.socket = new WebSocket(`${WS_BASE_URL}/documents/${documentId}`);
       this.setupEventHandlers();
     }

     private setupEventHandlers() {
       this.socket.onmessage = (event) => {
         const data = JSON.parse(event.data);
         switch (data.type) {
           case 'user_joined':
             this.handleUserJoined(data.user);
             break;
           case 'user_left':
             this.handleUserLeft(data.userId);
             break;
           case 'document_change':
             this.handleDocumentChange(data.change);
             break;
           // Handle other event types
         }
       };
     }

     // Methods for sending changes, cursor positions, etc.
   }
   ```

3. **Presence Indicators**
   - Show who is currently viewing/editing a document
   - Display cursor positions of collaborators
   - Implement user avatars and status indicators

4. **Activity Feed**
   - Track and display recent changes
   - Notify users of important updates
   - Allow commenting on specific sections

## 4. Optimizing Performance

### Data Loading and Caching

1. **Implement Pagination**
   - Add pagination to all API requests that return lists
   - Create UI components for paginated data display
   - Implement infinite scrolling where appropriate

2. **Set Up Caching Layer**
   ```typescript
   // Create CacheService.ts
   export class CacheService {
     private cache: Map<string, { data: any, timestamp: number }> = new Map();
     private maxAge: number; // Cache expiration in milliseconds

     constructor(maxAge = 5 * 60 * 1000) { // Default 5 minutes
       this.maxAge = maxAge;
     }

     public get(key: string): any | null {
       const cached = this.cache.get(key);
       if (!cached) return null;

       // Check if cache is expired
       if (Date.now() - cached.timestamp > this.maxAge) {
         this.cache.delete(key);
         return null;
       }

       return cached.data;
     }

     public set(key: string, data: any): void {
       this.cache.set(key, {
         data,
         timestamp: Date.now()
       });
     }

     public invalidate(key: string): void {
       this.cache.delete(key);
     }

     public invalidatePattern(pattern: RegExp): void {
       for (const key of this.cache.keys()) {
         if (pattern.test(key)) {
           this.cache.delete(key);
         }
       }
     }
   }
   ```

3. **Optimize API Requests**
   - Batch related API requests
   - Implement request deduplication
   - Use GraphQL for complex data requirements

4. **Lazy Loading Components**
   - Implement code splitting
   - Lazy load non-critical components
   - Use virtualized lists for large datasets

## 5. Adding User Customization

### User Preferences

1. **Enhance PreferencesForm Component**
   - Add more customization options
   - Implement preview functionality
   - Create preset configurations

2. **Persist User Preferences**
   ```typescript
   // Update UserPreferencesService.ts
   export class UserPreferencesService {
     private apiUrl = `${API_BASE_URL}/api/user-preferences`;

     public async getUserPreferences(): Promise<UserPreferences> {
       // Try to get from localStorage first for faster loading
       const cachedPrefs = localStorage.getItem('userPreferences');
       if (cachedPrefs) {
         return JSON.parse(cachedPrefs);
       }

       // If not in localStorage, fetch from API
       const response = await fetch(this.apiUrl, {
         credentials: 'include'
       });

       if (!response.ok) {
         throw new Error('Failed to fetch user preferences');
       }

       const preferences = await response.json();
       
       // Cache in localStorage for future use
       localStorage.setItem('userPreferences', JSON.stringify(preferences));
       
       return preferences;
     }

     public async saveUserPreferences(preferences: UserPreferences): Promise<void> {
       // Update localStorage
       localStorage.setItem('userPreferences', JSON.stringify(preferences));
       
       // Send to API
       const response = await fetch(this.apiUrl, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json'
         },
         body: JSON.stringify(preferences),
         credentials: 'include'
       });

       if (!response.ok) {
         throw new Error('Failed to save user preferences');
       }
     }
   }
   ```

3. **Apply Preferences Throughout Application**
   - Create a preferences context provider
   - Apply theme preferences dynamically
   - Respect accessibility settings

4. **Implement User Dashboards**
   - Allow customization of dashboard layout
   - Create widget system for dashboard components
   - Save dashboard configuration to user profile

## Implementation Timeline

### Phase 1: Real API Connections (Weeks 1-2)
- Update configuration files
- Modify API client classes
- Implement error handling and rate limiting

### Phase 2: Authentication (Weeks 3-4)
- Set up OAuth providers
- Implement JWT authentication
- Create authentication middleware

### Phase 3: Collaborative Features (Weeks 5-6)
- Set up WebSocket server
- Implement real-time document editing
- Add presence indicators and activity feed

### Phase 4: Performance Optimization (Weeks 7-8)
- Implement pagination and infinite scrolling
- Set up caching layer
- Optimize API requests
- Implement lazy loading

### Phase 5: User Customization (Weeks 9-10)
- Enhance preferences form
- Implement preferences persistence
- Create customizable dashboards

## Conclusion

This implementation plan provides a structured approach to enhancing the Sabeel platform with real API connections, proper authentication, collaborative features, optimized performance, and user customization. By following this plan, the platform will become more robust, secure, and user-friendly, providing a comprehensive Islamic knowledge platform that leverages modern web technologies while respecting and enhancing the traditional Islamic scholarly approach.