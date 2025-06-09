/**
 * DataService.ts
 * 
 * A unified data service abstraction layer that provides consistent
 * access to backend services regardless of the underlying provider
 * (Appwrite or Supabase).
 */

import { User } from '@/types/user';
import { ID } from 'appwrite';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import appwriteService from './AppwriteService';
import { Collections } from '@/types/collections';

// Environment variables for Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Define common interfaces for data operations
export interface DataServiceInterface {
  // Authentication operations
  getCurrentUser(): Promise<User | null>;
  login(email: string, password: string): Promise<User | null>;
  register(email: string, password: string, name: string): Promise<User | null>;
  logout(): Promise<void>;
  
  // Document operations
  getDocument(collection: string, id: string): Promise<any>;
  listDocuments(collection: string, queries?: any[]): Promise<any[]>;
  createDocument(collection: string, data: any): Promise<any>;
  updateDocument(collection: string, id: string, data: any): Promise<any>;
  deleteDocument(collection: string, id: string): Promise<void>;
  
  // Storage operations
  uploadFile(bucketId: string, file: File): Promise<string>;
  getFilePreview(bucketId: string, fileId: string): string;
  deleteFile(bucketId: string, fileId: string): Promise<void>;
  
  // Get the backend provider name
  getProviderName(): 'appwrite' | 'supabase';
}

/**
 * Unified implementation with Supabase as primary backend
 * Falls back to Appwrite when needed
 */
export class DataService implements DataServiceInterface {
  private static instance: DataService;
  private supabase: SupabaseClient;
  private activeProvider: 'appwrite' | 'supabase' = 'supabase'; // Default to Supabase
  
  private constructor() {
    // Initialize Supabase client
    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Determine which provider to use primarily
    this.detectProvider();
  }
  
  /**
   * Singleton pattern - get the instance of DataService
   */
  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }
  
  /**
   * Detect which provider to use based on environment and availability
   */
  private async detectProvider(): Promise<void> {
    try {
      // Check if Supabase is properly configured
      const { data, error } = await this.supabase.from('health_check').select('status').maybeSingle();
      
      if (!error && data) {
        this.activeProvider = 'supabase';
        console.log('Using Supabase as primary data provider');
      } else {
        // If Supabase check fails, fallback to checking Appwrite
        try {
          const response = await appwriteService.account.get();
          if (response) {
            this.activeProvider = 'appwrite';
            console.log('Using Appwrite as primary data provider');
          }
        } catch (appwriteError) {
          console.error('Both Supabase and Appwrite connections failed', appwriteError);
          this.activeProvider = 'supabase'; // Default to Supabase even if it fails
        }
      }
    } catch (error) {
      console.error('Error detecting provider', error);
      this.activeProvider = 'supabase'; // Default to Supabase
    }
  }
  
  /**
   * Get current provider name
   */
  public getProviderName(): 'appwrite' | 'supabase' {
    return this.activeProvider;
  }
  
  /**
   * Set which backend provider to use
   */
  public setProvider(provider: 'appwrite' | 'supabase'): void {
    this.activeProvider = provider;
  }

  /**
   * Get the currently authenticated user
   */
  public async getCurrentUser(): Promise<User | null> {
    if (this.activeProvider === 'supabase') {
      const { data, error } = await this.supabase.auth.getUser();
      
      if (error || !data.user) {
        return null;
      }
      
      // Get user profile from Supabase
      const { data: profile } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      return {
        userId: data.user.id,
        email: data.user.email || '',
        name: profile?.name || data.user.email?.split('@')[0] || '',
        memberType: profile?.member_type || 'regular',
        role: profile?.role || 'member',
        createdAt: data.user.created_at || new Date().toISOString(),
      };
    } else {
      // Appwrite implementation
      try {
        const userData = await appwriteService.account.get();
        
        // Get user preferences from Appwrite
        const preferences = await appwriteService.account.getPrefs();
        
        return {
          userId: userData.$id,
          email: userData.email,
          name: preferences.name || userData.email.split('@')[0],
          memberType: preferences.memberType || 'regular',
          role: preferences.role || 'member',
          createdAt: userData.$createdAt,
        };
      } catch (error) {
        return null;
      }
    }
  }

  /**
   * Login with email and password
   */
  public async login(email: string, password: string): Promise<User | null> {
    if (this.activeProvider === 'supabase') {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error || !data.user) {
        throw new Error(error?.message || 'Login failed');
      }
      
      // Get user profile
      const { data: profile } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      return {
        userId: data.user.id,
        email: data.user.email || '',
        name: profile?.name || data.user.email?.split('@')[0] || '',
        memberType: profile?.member_type || 'regular',
        role: profile?.role || 'member',
        createdAt: data.user.created_at || new Date().toISOString(),
      };
    } else {
      try {
        const session = await appwriteService.account.createEmailSession(email, password);
        const userData = await appwriteService.account.get();
        const preferences = await appwriteService.account.getPrefs();
        
        return {
          userId: userData.$id,
          email: userData.email,
          name: preferences.name || userData.email.split('@')[0],
          memberType: preferences.memberType || 'regular',
          role: preferences.role || 'member',
          createdAt: userData.$createdAt,
        };
      } catch (error: any) {
        throw new Error(error.message || 'Login failed');
      }
    }
  }

  /**
   * Register a new user
   */
  public async register(email: string, password: string, name: string): Promise<User | null> {
    if (this.activeProvider === 'supabase') {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          }
        }
      });
      
      if (error || !data.user) {
        throw new Error(error?.message || 'Registration failed');
      }
      
      // Create profile in profiles table
      await this.supabase.from('profiles').insert({
        id: data.user.id,
        name,
        member_type: 'regular',
        role: 'member',
      });
      
      return {
        userId: data.user.id,
        email: data.user.email || '',
        name,
        memberType: 'regular',
        role: 'member',
        createdAt: data.user.created_at || new Date().toISOString(),
      };
    } else {
      try {
        const userData = await appwriteService.account.create(
          ID.unique(),
          email,
          password,
          name
        );
        
        // Set user preferences
        await appwriteService.account.updatePrefs({
          name,
          memberType: 'regular',
          role: 'member'
        });
        
        // Create email session
        await appwriteService.account.createEmailSession(email, password);
        
        return {
          userId: userData.$id,
          email: userData.email,
          name,
          memberType: 'regular',
          role: 'member',
          createdAt: userData.$createdAt,
        };
      } catch (error: any) {
        throw new Error(error.message || 'Registration failed');
      }
    }
  }

  /**
   * Log out the current user
   */
  public async logout(): Promise<void> {
    if (this.activeProvider === 'supabase') {
      const { error } = await this.supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
    } else {
      try {
        await appwriteService.account.deleteSession('current');
      } catch (error: any) {
        throw new Error(error.message || 'Logout failed');
      }
    }
  }

  /**
   * Get a single document by ID
   */
  public async getDocument(collection: string, id: string): Promise<any> {
    if (this.activeProvider === 'supabase') {
      const { data, error } = await this.supabase
        .from(this.mapCollectionToTable(collection))
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    } else {
      try {
        return await appwriteService.databases.getDocument(
          appwriteService.databaseId,
          collection,
          id
        );
      } catch (error: any) {
        throw new Error(error.message || 'Failed to get document');
      }
    }
  }

  /**
   * List documents with optional queries
   */
  public async listDocuments(collection: string, queries?: any[]): Promise<any[]> {
    if (this.activeProvider === 'supabase') {
      let query = this.supabase
        .from(this.mapCollectionToTable(collection))
        .select('*');
      
      // Apply filters (simplified implementation)
      if (queries && queries.length > 0) {
        // Simple implementation for equality filters
        queries.forEach(q => {
          if (q.type === 'equal' && q.field && q.value) {
            query = query.eq(q.field, q.value);
          }
        });
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data || [];
    } else {
      try {
        const response = await appwriteService.databases.listDocuments(
          appwriteService.databaseId,
          collection,
          queries
        );
        
        return response.documents;
      } catch (error: any) {
        throw new Error(error.message || 'Failed to list documents');
      }
    }
  }

  /**
   * Create a new document
   */
  public async createDocument(collection: string, data: any): Promise<any> {
    if (this.activeProvider === 'supabase') {
      const { data: result, error } = await this.supabase
        .from(this.mapCollectionToTable(collection))
        .insert(data)
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return result;
    } else {
      try {
        return await appwriteService.databases.createDocument(
          appwriteService.databaseId,
          collection,
          ID.unique(),
          data
        );
      } catch (error: any) {
        throw new Error(error.message || 'Failed to create document');
      }
    }
  }

  /**
   * Update an existing document
   */
  public async updateDocument(collection: string, id: string, data: any): Promise<any> {
    if (this.activeProvider === 'supabase') {
      const { data: result, error } = await this.supabase
        .from(this.mapCollectionToTable(collection))
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return result;
    } else {
      try {
        return await appwriteService.databases.updateDocument(
          appwriteService.databaseId,
          collection,
          id,
          data
        );
      } catch (error: any) {
        throw new Error(error.message || 'Failed to update document');
      }
    }
  }

  /**
   * Delete a document
   */
  public async deleteDocument(collection: string, id: string): Promise<void> {
    if (this.activeProvider === 'supabase') {
      const { error } = await this.supabase
        .from(this.mapCollectionToTable(collection))
        .delete()
        .eq('id', id);
      
      if (error) {
        throw new Error(error.message);
      }
    } else {
      try {
        await appwriteService.databases.deleteDocument(
          appwriteService.databaseId,
          collection,
          id
        );
      } catch (error: any) {
        throw new Error(error.message || 'Failed to delete document');
      }
    }
  }

  /**
   * Upload a file to storage
   */
  public async uploadFile(bucketId: string, file: File): Promise<string> {
    if (this.activeProvider === 'supabase') {
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${file.name}`;
      const { data, error } = await this.supabase
        .storage
        .from(bucketId)
        .upload(fileName, file);
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data?.path || '';
    } else {
      try {
        const result = await appwriteService.storage.createFile(
          bucketId,
          ID.unique(),
          file
        );
        
        return result.$id;
      } catch (error: any) {
        throw new Error(error.message || 'Failed to upload file');
      }
    }
  }

  /**
   * Get a file preview URL
   */
  public getFilePreview(bucketId: string, fileId: string): string {
    if (this.activeProvider === 'supabase') {
      return this.supabase
        .storage
        .from(bucketId)
        .getPublicUrl(fileId).data.publicUrl;
    } else {
      return appwriteService.storage.getFilePreview(
        bucketId,
        fileId
      );
    }
  }

  /**
   * Delete a file
   */
  public async deleteFile(bucketId: string, fileId: string): Promise<void> {
    if (this.activeProvider === 'supabase') {
      const { error } = await this.supabase
        .storage
        .from(bucketId)
        .remove([fileId]);
      
      if (error) {
        throw new Error(error.message);
      }
    } else {
      try {
        await appwriteService.storage.deleteFile(
          bucketId,
          fileId
        );
      } catch (error: any) {
        throw new Error(error.message || 'Failed to delete file');
      }
    }
  }

  /**
   * Map Appwrite collection names to Supabase table names
   */
  private mapCollectionToTable(collection: string): string {
    const mapping: Record<string, string> = {
      [Collections.JOB_OPENINGS]: 'job_openings',
      [Collections.USER_ACTIVITIES]: 'user_activities',
      [Collections.WHATSAPP_GROUPS]: 'whatsapp_groups',
      [Collections.EVENTS]: 'events',
      [Collections.NOTIFICATIONS]: 'notifications',
      // Add more mappings as needed
    };
    
    return mapping[collection] || collection.toLowerCase();
  }
}

// Export singleton instance
export default DataService.getInstance();
