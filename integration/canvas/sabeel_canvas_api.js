/**
 * Sabeel Canvas API Integration
 * 
 * This module provides custom API extensions for Canvas LMS
 * tailored for Islamic educational content and features.
 * 
 * Connects to real Canvas LMS API endpoints with proper authentication
 * and error handling for production use.
 */

class SabeelCanvasAPI {
  constructor(options = {}) {
    // Use real Canvas LMS API endpoint from environment or config
    this.baseUrl = options.baseUrl || 
                   process.env.CANVAS_API_URL || 
                   'https://canvas.instructure.com/api/v1';
    
    // Use API token from options or environment
    this.token = options.token || process.env.CANVAS_API_TOKEN;
    
    // Set default request timeout
    this.timeout = options.timeout || 30000; // 30 seconds default
    
    // Track rate limiting
    this.rateLimitRemaining = null;
    this.rateLimitReset = null;
    
    // Configure headers
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (this.token) {
      this.headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    // Initialize request cache
    this.cache = new Map();
    this.cacheMaxAge = options.cacheMaxAge || 5 * 60 * 1000; // 5 minutes default
  }

  /**
   * Fetch wrapper with authentication, error handling, rate limiting, and caching
   * @param {string} endpoint - API endpoint to fetch
   * @param {Object} options - Fetch options
   * @param {boolean} useCache - Whether to use cache for this request (default: true)
   * @returns {Promise<any>} - Parsed JSON response
   */
  async _fetch(endpoint, options = {}, useCache = true) {
    const url = `${this.baseUrl}${endpoint}`;
    const cacheKey = `${options.method || 'GET'}-${url}-${JSON.stringify(options.body || '')}`;
    
    // Check cache for GET requests if caching is enabled
    if (useCache && (!options.method || options.method === 'GET')) {
      const cachedData = this.getFromCache(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }
    
    // Check rate limiting
    if (this.rateLimitRemaining !== null && this.rateLimitRemaining <= 1) {
      const now = Date.now();
      if (this.rateLimitReset && now < this.rateLimitReset) {
        const waitTime = this.rateLimitReset - now;
        console.warn(`Rate limit almost exceeded. Waiting ${waitTime}ms before next request.`);
        await new Promise(resolve => setTimeout(resolve, waitTime + 100)); // Add 100ms buffer
      }
    }
    
    const fetchOptions = {
      ...options,
      headers: {
        ...this.headers,
        ...options.headers,
      },
      // Add timeout
      signal: options.signal || (this.timeout ? AbortSignal.timeout(this.timeout) : undefined),
    };

    try {
      const response = await fetch(url, fetchOptions);
      
      // Update rate limit tracking
      if (response.headers.has('X-Rate-Limit-Remaining')) {
        this.rateLimitRemaining = parseInt(response.headers.get('X-Rate-Limit-Remaining'), 10);
      }
      
      if (response.headers.has('X-Rate-Limit-Reset')) {
        this.rateLimitReset = Date.now() + (parseInt(response.headers.get('X-Rate-Limit-Reset'), 10) * 1000);
      }
      
      if (!response.ok) {
        // Handle different error status codes appropriately
        if (response.status === 401) {
          throw new Error('Authentication failed. Please check your Canvas API token.');
        } else if (response.status === 403) {
          throw new Error('Access forbidden. Your API token may not have the required permissions.');
        } else if (response.status === 404) {
          throw new Error(`Resource not found: ${endpoint}`);
        } else if (response.status === 429) {
          // Rate limit exceeded
          const retryAfter = response.headers.get('Retry-After');
          const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : 60000; // Default to 60s
          
          console.warn(`Rate limit exceeded. Waiting ${waitTime}ms before retrying.`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          
          // Retry the request recursively
          return this._fetch(endpoint, options, useCache);
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`API Error: ${response.status} - ${errorData.message || response.statusText}`);
        }
      }
      
      const data = await response.json();
      
      // Cache successful GET responses
      if (useCache && (!options.method || options.method === 'GET')) {
        this.addToCache(cacheKey, data);
      }
      
      return data;
    } catch (error) {
      // Handle network errors and timeouts
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.timeout}ms: ${url}`);
      }
      
      console.error('Sabeel Canvas API Error:', error);
      
      // Implement exponential backoff for retries on network errors
      if (options.retryCount === undefined) {
        options.retryCount = 0;
      }
      
      if (options.retryCount < 3 && (error.message.includes('network') || error.message.includes('failed'))) {
        const retryDelay = Math.pow(2, options.retryCount) * 1000; // Exponential backoff
        console.warn(`Network error, retrying in ${retryDelay}ms...`);
        
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        
        options.retryCount++;
        return this._fetch(endpoint, options, useCache);
      }
      
      throw error;
    }
  }
  
  /**
   * Get data from cache if it exists and is not expired
   * @param {string} key - Cache key
   * @returns {any|null} - Cached data or null if not found/expired
   */
  getFromCache(key) {
    if (!this.cache.has(key)) return null;
    
    const { data, timestamp } = this.cache.get(key);
    const now = Date.now();
    
    if (now - timestamp > this.cacheMaxAge) {
      // Cache expired
      this.cache.delete(key);
      return null;
    }
    
    return data;
  }
  
  /**
   * Add data to cache
   * @param {string} key - Cache key
   * @param {any} data - Data to cache
   */
  addToCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    
    // Limit cache size to prevent memory issues
    if (this.cache.size > 100) {
      // Remove oldest entries when cache gets too large
      const oldestKey = [...this.cache.entries()]
        .sort((a, b) => a[1].timestamp - b[1].timestamp)[0][0];
      this.cache.delete(oldestKey);
    }
  }
  
  /**
   * Clear the entire cache or specific entries
   * @param {string|RegExp} [pattern] - Optional pattern to match cache keys
   */
  clearCache(pattern) {
    if (!pattern) {
      this.cache.clear();
      return;
    }
    
    for (const key of this.cache.keys()) {
      if (typeof pattern === 'string' ? key.includes(pattern) : pattern.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get Islamic courses with specialized metadata
   */
  async getIslamicCourses() {
    const courses = await this._fetch('/courses?include[]=term&include[]=teachers&per_page=100');
    
    // Filter and annotate Islamic courses
    return courses.filter(course => 
      course.name.includes('Islamic') || 
      course.name.includes('Quran') || 
      course.name.includes('Hadith') ||
      (course.course_category && course.course_category.includes('Islamic'))
    ).map(course => ({
      ...course,
      isIslamicCourse: true,
      arabicName: course.name_arabic || course.name, // Fallback if no Arabic name is set
      scholarVerified: Boolean(course.scholar_verified),
    }));
  }

  /**
   * Get specialized Islamic modules for a course
   */
  async getIslamicCourseModules(courseId) {
    return await this._fetch(`/courses/${courseId}/modules?include[]=items&per_page=100`);
  }

  /**
   * Create a new Quran study assignment
   */
  async createQuranAssignment(courseId, data) {
    return await this._fetch(`/courses/${courseId}/assignments`, {
      method: 'POST',
      body: JSON.stringify({
        assignment: {
          name: data.name,
          description: data.description,
          points_possible: data.points || 100,
          submission_types: ['online_text_entry'],
          allowed_extensions: ['pdf', 'mp3'],
          due_at: data.dueDate,
          // Sabeel custom fields
          quran_surah: data.surah,
          quran_ayat: data.ayatRange,
          recitation_required: Boolean(data.requireRecitation),
          tafsir_references: data.tafsirReferences || [],
        }
      })
    });
  }

  /**
   * Get Islamic calendar events
   */
  async getIslamicCalendarEvents() {
    const events = await this._fetch('/calendar_events');
    return events.filter(event => event.context_name.includes('Islamic') || 
                                 event.title.includes('Islamic'));
  }

  /**
   * Create an Islamic scholar verification request
   */
  async createScholarVerificationRequest(userId, credentials) {
    return await this._fetch(`/users/${userId}/custom_data/scholar_verification`, {
      method: 'PUT',
      body: JSON.stringify({
        islamic_credentials: credentials.islamicCredentials,
        institution: credentials.institution,
        specialization: credentials.specialization,
        years_of_study: credentials.yearsOfStudy,
        references: credentials.references,
        verification_documents: credentials.verificationDocuments,
      })
    });
  }

  /**
   * Get Islamic learning outcomes
   */
  async getIslamicLearningOutcomes(courseId) {
    return await this._fetch(`/courses/${courseId}/outcome_groups`);
  }

  /**
   * Create a specialized discussion forum for Islamic studies
   */
  async createIslamicDiscussionForum(courseId, data) {
    return await this._fetch(`/courses/${courseId}/discussion_topics`, {
      method: 'POST',
      body: JSON.stringify({
        title: data.title,
        message: data.message,
        discussion_type: data.type || 'threaded',
        published: true,
        // Sabeel custom fields
        islamic_etiquette_required: Boolean(data.islamicEtiquetteRequired),
        scholar_moderated: Boolean(data.scholarModerated),
        allow_citations: Boolean(data.allowCitations),
      })
    });
  }
}

export default SabeelCanvasAPI;
