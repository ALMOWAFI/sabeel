/**
 * DataService.ts
 * 
 * A unified data service abstraction layer that provides consistent
 * access to backend services regardless of the underlying provider
 * (Appwrite or Supabase). This service is designed to be robust,
 * type-safe, and easily extensible.
 *
 * TEMPORARY MODIFICATION: Appwrite fallback logic has been removed due to
 * missing AppwriteService.ts. This service will currently only support Supabase.
 */

import { User } from '@/types/user';
// import { ID, Query } from 'appwrite'; // Appwrite import removed
import { createClient, SupabaseClient } from '@supabase/supabase-js';
// import appwriteService from './AppwriteService'; // AppwriteService import removed
import { Collections, CollectionMapping } from '@/types/collections';

// Environment variables for Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Define common interfaces for data operations using generics for type safety
export interface DataServiceInterface {
  // Authentication operations
  getCurrentUser(): Promise<User | null>;
  login(email: string, password: string): Promise<User | null>;
  register(email: string, password: string, name: string): Promise<User | null>;
  logout(): Promise<void>;
  
  // Generic document operations
  getDocument<T>(collectionName: Collections, id: string): Promise<T | null>;
  listDocuments<T>(collectionName: Collections, filters?: { [key: string]: any }): Promise<T[]>;
  createDocument<T>(collectionName: Collections, data: Partial<T>, permissions?: string[]): Promise<T>;
  updateDocument<T>(collectionName: Collections, id: string, data: Partial<T>): Promise<T>;
  deleteDocument(collectionName: Collections, id: string): Promise<void>;
  searchDocuments<T>(collectionName: Collections, searchField: keyof T, searchText: string): Promise<T[]>;

  // Storage operations
  uploadFile(bucketId: string, file: File): Promise<string>;
  getFilePreview(bucketId: string, fileId: string): string;
  deleteFile(bucketId: string, fileId: string): Promise<void>;
  
  // Provider management
  getProviderName(): 'supabase'; // Only Supabase for now
  // setProvider(provider: 'appwrite' | 'supabase'): void; // SetProvider removed for now
}

/**
 * Unified implementation of the DataService with Supabase as the primary backend.
 * Appwrite fallback has been temporarily removed.
 */
export class DataService implements DataServiceInterface {
  private static instance: DataService;
  private supabase: SupabaseClient;
  private activeProvider: 'supabase' = 'supabase'; // Defaulting to Supabase
  
  private constructor() {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase credentials are not provided. DataService will not function.');
      // Throw an error or handle this case more gracefully depending on requirements
      this.supabase = {} as SupabaseClient; // Dummy client to satisfy type, but it won't work
      return;
    }
    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('DataService is using Supabase provider.');
  }
  
  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }
  
  public getProviderName(): 'supabase' {
    return this.activeProvider;
  }
  
  // setProvider method removed as we are hardcoding to Supabase for now

  // --- Authentication --- 

  public async getCurrentUser(): Promise<User | null> {
    if (!this.supabase?.auth) {
        console.error("Supabase client not initialized in getCurrentUser.");
        return null;
    }
    const { data: { session } } = await this.supabase.auth.getSession();
    if (!session) return null;

    const { data: profile } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    return {
      userId: session.user.id,
      email: session.user.email || '',
      name: profile?.name || session.user.email?.split('@')[0] || 'Anonymous',
      memberType: profile?.member_type || 'regular',
      role: profile?.role || 'member',
      createdAt: profile?.created_at || session.user.created_at,
    };
  }

  public async login(email: string, password: string): Promise<User | null> {
    if (!this.supabase?.auth) throw new Error("Supabase client not initialized.");
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) throw new Error(error?.message || 'Login failed');
    return this.getCurrentUser();
  }

  public async register(email: string, password: string, name: string): Promise<User | null> {
    if (!this.supabase?.auth) throw new Error("Supabase client not initialized.");
    const { data, error } = await this.supabase.auth.signUp({
        email, password, options: { data: { name, member_type: 'regular', role: 'member' } }
    });
    if (error || !data.user) throw new Error(error?.message || 'Registration failed');
    // After sign up, Supabase automatically logs in the user and creates a session.
    // We might need to create a profile entry separately if not handled by triggers.
    // For now, just return the user from getCurrentUser which should pick up the session.
    return this.getCurrentUser();
  }

  public async logout(): Promise<void> {
    if (!this.supabase?.auth) throw new Error("Supabase client not initialized.");
    const { error } = await this.supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }

  // --- Document Operations (Generic) --- 

  private mapCollection(collectionName: Collections): string {
    const tableName = CollectionMapping[collectionName];
    if (!tableName) {
      throw new Error(`Collection '${collectionName}' is not mapped to a Supabase table.`);
    }
    return tableName;
  }

  public async getDocument<T>(collectionName: Collections, id: string): Promise<T | null> {
    if (!this.supabase) throw new Error("Supabase client not initialized.");
    const { data, error } = await this.supabase
      .from(this.mapCollection(collectionName))
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      console.error(`Error fetching document: ${error.message}`);
      return null;
    }
    return data as T | null;
  }

  public async listDocuments<T>(collectionName: Collections, filters: { [key: string]: any } = {}): Promise<T[]> {
    if (!this.supabase) throw new Error("Supabase client not initialized.");
    let query = this.supabase.from(this.mapCollection(collectionName)).select('*');

    for (const key in filters) {
      if (Object.prototype.hasOwnProperty.call(filters, key)) {
        query = query.eq(key, filters[key]);
      }
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data || []) as T[];
  }

  public async createDocument<T>(collectionName: Collections, doc: Partial<T>, _permissions?: string[]): Promise<T> {
    // Permissions are not directly handled this way in Supabase, RLS is used.
    if (!this.supabase) throw new Error("Supabase client not initialized.");
    const { data, error } = await this.supabase
      .from(this.mapCollection(collectionName))
      .insert([doc])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as T;
  }

  public async updateDocument<T>(collectionName: Collections, id: string, doc: Partial<T>): Promise<T> {
    if (!this.supabase) throw new Error("Supabase client not initialized.");
    const { data, error } = await this.supabase
      .from(this.mapCollection(collectionName))
      .update(doc)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as T;
  }

  public async deleteDocument(collectionName: Collections, id: string): Promise<void> {
    if (!this.supabase) throw new Error("Supabase client not initialized.");
    const { error } = await this.supabase.from(this.mapCollection(collectionName)).delete().eq('id', id);
    if (error) throw new Error(error.message);
  }

  public async searchDocuments<T>(collectionName: Collections, searchField: keyof T, searchText: string): Promise<T[]> {
    if (!this.supabase) throw new Error("Supabase client not initialized.");
      const { data, error } = await this.supabase
          .from(this.mapCollection(collectionName))
          .select()
          .textSearch(searchField as string, `'${searchText}'`); // Basic text search
      if (error) throw new Error(error.message);
      return (data || []) as T[];
  }

  // --- Storage Operations ---

  public async uploadFile(bucketId: string, file: File): Promise<string> {
    if (!this.supabase?.storage) throw new Error("Supabase client not initialized.");
    const { data, error } = await this.supabase.storage.from(bucketId).upload(`${Date.now()}-${file.name}`, file);
    if (error) throw new Error(error.message);
    return data.path;
  }

  public getFilePreview(bucketId: string, fileId: string): string {
    if (!this.supabase?.storage) throw new Error("Supabase client not initialized.");
    const { data } = this.supabase.storage.from(bucketId).getPublicUrl(fileId);
    return data.publicUrl;
  }

  public async deleteFile(bucketId: string, fileId: string): Promise<void> {
    if (!this.supabase?.storage) throw new Error("Supabase client not initialized.");
    const { error } = await this.supabase.storage.from(bucketId).remove([fileId]);
    if (error) throw new Error(error.message);
  }
}

// Export a singleton instance for global use
const dataService = DataService.getInstance();
export default dataService;
