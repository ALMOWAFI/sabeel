/**
 * Canvas LMS API Service
 * 
 * Provides Canvas-specific API functionality for the Sabeel platform
 */

import { ApiService } from './ApiService';

export interface CanvasCourse {
  id: number;
  name: string;
  course_code: string;
  start_at: string | null;
  end_at: string | null;
  is_public: boolean;
  enrollment_term_id: number;
  default_view: string;
  syllabus_body: string | null;
}

export interface CanvasAssignment {
  id: number;
  name: string;
  description: string;
  due_at: string | null;
  points_possible: number;
  course_id: number;
  submission_types: string[];
  published: boolean;
}

export interface CanvasUser {
  id: number;
  name: string;
  short_name: string;
  email: string;
  avatar_url: string;
}

export interface CanvasModule {
  id: number;
  name: string;
  position: number;
  prerequisite_module_ids: number[];
  state: string;
  completed_at: string | null;
  items_count: number;
  items_url: string;
}

export interface CanvasDiscussion {
  id: number;
  title: string;
  message: string;
  html_url: string;
  posted_at: string;
  author: CanvasUser;
  topic_children: number[];
  assignment_id: number | null;
}

export interface IslamicContent {
  verses?: string[];
  hadith?: string[];
  scholars?: string[];
  topics?: string[];
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  language?: 'arabic' | 'english' | 'both';
}

export class CanvasApiService extends ApiService {
  constructor() {
    super({
      baseUrl: process.env.CANVAS_API_URL || 'https://canvas.instructure.com/api/v1',
      token: process.env.CANVAS_API_TOKEN,
      timeout: 30000,
      retries: 3,
      cacheMaxAge: 5 * 60 * 1000, // 5 minutes
    });
  }

  // Course Management
  async getCourses(): Promise<CanvasCourse[]> {
    return this.request<CanvasCourse[]>('/courses?per_page=100');
  }

  async getIslamicCourses(): Promise<CanvasCourse[]> {
    const courses = await this.getCourses();
    
    // Filter courses that might be related to Islamic studies
    const islamicKeywords = [
      'islam', 'islamic', 'quran', 'hadith', 'fiqh', 'tafsir'
    ];
    
    return courses.filter(course => 
      islamicKeywords.some(keyword => 
        course.name.toLowerCase().includes(keyword) ||
        course.course_code.toLowerCase().includes(keyword)
      )
    );
  }

  async getCourse(courseId: number): Promise<CanvasCourse> {
    return this.request<CanvasCourse>(`/courses/${courseId}`);
  }

  async createCourse(courseData: Partial<CanvasCourse>): Promise<CanvasCourse> {
    return this.request<CanvasCourse>('/accounts/self/courses', {
      method: 'POST',
      body: JSON.stringify({ course: courseData }),
    }, false);
  }

  // Assignment Management
  async getAssignments(courseId: number): Promise<CanvasAssignment[]> {
    return this.request<CanvasAssignment[]>(`/courses/${courseId}/assignments?per_page=100`);
  }

  async createQuranAssignment(courseId: number, assignmentData: {
    name: string;
    description: string;
    due_at?: string;
    points_possible?: number;
    islamic_content?: IslamicContent;
  }): Promise<CanvasAssignment> {
    const enhancedDescription = this.enhanceAssignmentWithIslamicContent(
      assignmentData.description,
      assignmentData.islamic_content
    );

    const assignment = {
      name: assignmentData.name,
      description: enhancedDescription,
      due_at: assignmentData.due_at,
      points_possible: assignmentData.points_possible || 100,
      submission_types: ['online_text_entry', 'online_upload'],
      published: true,
    };

    return this.request<CanvasAssignment>(
      `/courses/${courseId}/assignments`,
      {
        method: 'POST',
        body: JSON.stringify({ assignment }),
      },
      false
    );
  }

  async createHadithAssignment(courseId: number, assignmentData: {
    name: string;
    hadith_reference: string;
    scholarly_commentary?: string;
    due_at?: string;
    points_possible?: number;
  }): Promise<CanvasAssignment> {
    const description = `
      <h3>Hadith Analysis Assignment</h3>
      <p><strong>Hadith Reference:</strong> ${assignmentData.hadith_reference}</p>
      ${assignmentData.scholarly_commentary ? 
        `<p><strong>Scholarly Commentary:</strong> ${assignmentData.scholarly_commentary}</p>` : 
        ''
      }
      <p>Please analyze this hadith considering its chain of narration, authenticity, and practical implications.</p>
    `;

    const assignment = {
      name: assignmentData.name,
      description,
      due_at: assignmentData.due_at,
      points_possible: assignmentData.points_possible || 100,
      submission_types: ['online_text_entry'],
      published: true,
    };

    return this.request<CanvasAssignment>(
      `/courses/${courseId}/assignments`,
      {
        method: 'POST',
        body: JSON.stringify({ assignment }),
      },
      false
    );
  }

  // Module Management
  async getModules(courseId: number): Promise<CanvasModule[]> {
    return this.request<CanvasModule[]>(`/courses/${courseId}/modules?per_page=100`);
  }

  async createIslamicModule(courseId: number, moduleData: {
    name: string;
    topics: string[];
    prerequisite_module_ids?: number[];
  }): Promise<CanvasModule> {
    const module = {
      name: moduleData.name,
      prerequisite_module_ids: moduleData.prerequisite_module_ids || [],
      publish_final_grade: true,
    };

    return this.request<CanvasModule>(
      `/courses/${courseId}/modules`,
      {
        method: 'POST',
        body: JSON.stringify({ module }),
      },
      false
    );
  }

  // Discussion Forums
  async getDiscussions(courseId: number): Promise<CanvasDiscussion[]> {
    return this.request<CanvasDiscussion[]>(`/courses/${courseId}/discussion_topics?per_page=100`);
  }

  async createIslamicDiscussion(courseId: number, discussionData: {
    title: string;
    message: string;
    topic_type?: 'threaded' | 'side_comment';
    islamic_content?: IslamicContent;
  }): Promise<CanvasDiscussion> {
    const enhancedMessage = this.enhanceDiscussionWithIslamicContent(
      discussionData.message,
      discussionData.islamic_content
    );

    const discussion = {
      title: discussionData.title,
      message: enhancedMessage,
      discussion_type: discussionData.topic_type || 'threaded',
      published: true,
    };

    return this.request<CanvasDiscussion>(
      `/courses/${courseId}/discussion_topics`,
      {
        method: 'POST',
        body: JSON.stringify(discussion),
      },
      false
    );
  }

  // User Management
  async getUsers(courseId: number): Promise<CanvasUser[]> {
    return this.request<CanvasUser[]>(`/courses/${courseId}/users?per_page=100`);
  }

  async getCurrentUser(): Promise<CanvasUser> {
    return this.request<CanvasUser>('/users/self');
  }

  // Islamic-specific functionality
  async getIslamicCalendarEvents(): Promise<any[]> {
    const events = await this.request<any[]>('/calendar_events?per_page=100');
    
    // Filter for Islamic calendar events
    const islamicKeywords = ['ramadan', 'eid', 'hajj', 'islamic', 'prayer', 'jummah', 'friday'];
    
    return events.filter(event =>
      islamicKeywords.some(keyword =>
        event.title.toLowerCase().includes(keyword) ||
        (event.description && event.description.toLowerCase().includes(keyword))
      )
    );
  }

  async createScholarVerificationRequest(userId: number, credentials: {
    institution: string;
    degree: string;
    specialization: string;
    references: string[];
  }): Promise<any> {
    // This would integrate with a custom verification system
    // For now, we'll create a custom submission
    
    const verificationData = {
      user_id: userId,
      verification_type: 'scholar_credentials',
      data: credentials,
      status: 'pending',
      submitted_at: new Date().toISOString(),
    };

    // This would be sent to a custom verification endpoint
    // For Canvas integration, we might use a custom assignment submission
    return this.request<any>('/custom/scholar_verification', {
      method: 'POST',
      body: JSON.stringify(verificationData),
    }, false);
  }

  async getIslamicLearningOutcomes(courseId: number): Promise<any[]> {
    const outcomes = await this.request<any[]>(`/courses/${courseId}/outcome_groups?per_page=100`);
    
    // Filter for Islamic learning outcomes
    return outcomes.filter(outcome =>
      outcome.title && (
        outcome.title.toLowerCase().includes('islamic') ||
        outcome.title.toLowerCase().includes('quran') ||
        outcome.title.toLowerCase().includes('hadith')
      )
    );
  }

  // Pagination helper
  async getAllPages<T>(endpoint: string, params: URLSearchParams = new URLSearchParams()): Promise<T[]> {
    let allResults: T[] = [];
    let nextUrl: string | null = `${endpoint}?${params.toString()}&per_page=100`;

    while (nextUrl) {
      const response = await fetch(`${this.baseUrl}${nextUrl}`, {
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      allResults = allResults.concat(data);

      // Check for pagination
      const linkHeader = response.headers.get('Link');
      nextUrl = this.parseLinkHeader(linkHeader);
    }

    return allResults;
  }

  private parseLinkHeader(linkHeader: string | null): string | null {
    if (!linkHeader) return null;

    const links = linkHeader.split(',');
    const nextLink = links.find(link => link.includes('rel="next"'));
    
    if (!nextLink) return null;

    const match = nextLink.match(/<([^>]+)>/);
    return match ? match[1].replace(this.baseUrl, '') : null;
  }

  // Content enhancement helpers
  private enhanceAssignmentWithIslamicContent(
    description: string,
    islamicContent?: IslamicContent
  ): string {
    if (!islamicContent) return description;

    let enhanced = description;

    if (islamicContent.verses && islamicContent.verses.length > 0) {
      enhanced += '\n\n<h4>Related Quranic Verses:</h4>\n<ul>';
      islamicContent.verses.forEach(verse => {
        enhanced += `<li>${verse}</li>`;
      });
      enhanced += '</ul>';
    }

    if (islamicContent.hadith && islamicContent.hadith.length > 0) {
      enhanced += '\n\n<h4>Related Hadith:</h4>\n<ul>';
      islamicContent.hadith.forEach(hadith => {
        enhanced += `<li>${hadith}</li>`;
      });
      enhanced += '</ul>';
    }

    if (islamicContent.scholars && islamicContent.scholars.length > 0) {
      enhanced += '\n\n<h4>Scholarly References:</h4>\n<ul>';
      islamicContent.scholars.forEach(scholar => {
        enhanced += `<li>${scholar}</li>`;
      });
      enhanced += '</ul>';
    }

    return enhanced;
  }

  private enhanceDiscussionWithIslamicContent(
    message: string,
    islamicContent?: IslamicContent
  ): string {
    if (!islamicContent) return message;

    let enhanced = message;

    if (islamicContent.topics && islamicContent.topics.length > 0) {
      enhanced += '\n\n**Discussion Topics:**\n';
      islamicContent.topics.forEach(topic => {
        enhanced += `- ${topic}\n`;
      });
    }

    if (islamicContent.difficulty_level) {
      enhanced += `\n\n**Difficulty Level:** ${islamicContent.difficulty_level}`;
    }

    if (islamicContent.language) {
      enhanced += `\n**Language:** ${islamicContent.language}`;
    }

    return enhanced;
  }
} 