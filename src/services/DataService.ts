/**
 * DataService.ts
 * 
 * A unified data service abstraction layer that provides consistent
 * access to backend services regardless of the underlying provider
 * (Appwrite or Supabase). This service is designed to be robust,
 * type-safe, and easily extensible.
 */

import { User } from '@/types/user';
import { ID, Query } from 'appwrite';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import appwriteService from './AppwriteService';
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
  getProviderName(): 'appwrite' | 'supabase';
  setProvider(provider: 'appwrite' | 'supabase'): void;
}

/**
 * Unified implementation of the DataService with Supabase as the primary backend,
 * falling back to Appwrite when Supabase is not available or configured.
 */
export class DataService implements DataServiceInterface {
  private static instance: DataService;
  private supabase: SupabaseClient;
  private activeProvider: 'appwrite' | 'supabase' = 'supabase';
  
  private constructor() {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase credentials are not provided. Falling back to Appwrite.');
      this.activeProvider = 'appwrite';
      this.supabase = {} as SupabaseClient; // Dummy client to satisfy type
    } else {
      this.supabase = createClient(supabaseUrl, supabaseAnonKey);
      this.detectProvider();
    }
  }
  
  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }
  
  private async detectProvider(): Promise<void> {
    try {
      const { error } = await this.supabase.from('profiles').select('id').limit(1);
      if (error && error.code !== '42P01') { // '42P01' = undefined_table
        throw new Error(`Supabase health check failed: ${error.message}`);
      }
      this.activeProvider = 'supabase';
      console.log('DataService is using Supabase provider.');
    } catch (e: any) {
      console.warn(`Supabase is not reachable: ${e.message}. Falling back to Appwrite.`);
      this.activeProvider = 'appwrite';
    }
  }
  
  public getProviderName(): 'appwrite' | 'supabase' {
    return this.activeProvider;
  }
  
  public setProvider(provider: 'appwrite' | 'supabase'): void {
    if (provider === 'supabase' && (!supabaseUrl || !supabaseAnonKey)) {
        console.error('Cannot switch to Supabase: credentials are not configured.');
        return;
    }
    this.activeProvider = provider;
  }

  // --- Authentication --- 

  public async getCurrentUser(): Promise<User | null> {
    if (this.activeProvider === 'supabase') {
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
    } else {
      try {
        const user = await appwriteService.account.get();
        const prefs = await appwriteService.account.getPrefs();
        return {
          userId: user.$id,
          email: user.email,
          name: prefs.name || user.name,
          memberType: prefs.memberType || 'regular',
          role: prefs.role || 'member',
          createdAt: user.$createdAt,
        };
      } catch {
        return null;
      }
    }
  }

  public async login(email: string, password: string): Promise<User | null> {
    if (this.activeProvider === 'supabase') {
        const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
        if (error || !data.user) throw new Error(error?.message || 'Login failed');
        return this.getCurrentUser();
    } else {
        await appwriteService.account.createEmailSession(email, password);
        return this.getCurrentUser();
    }
  }

  public async register(email: string, password: string, name: string): Promise<User | null> {
    if (this.activeProvider === 'supabase') {
        const { data, error } = await this.supabase.auth.signUp({
            email, password, options: { data: { name, member_type: 'regular', role: 'member' } }
        });
        if (error || !data.user) throw new Error(error?.message || 'Registration failed');
        return this.getCurrentUser();
    } else {
        await appwriteService.account.create(ID.unique(), email, password, name);
        await appwriteService.account.updatePrefs({ name, memberType: 'regular', role: 'member' });
        return this.login(email, password);
    }
  }

  public async logout(): Promise<void> {
    if (this.activeProvider === 'supabase') {
        const { error } = await this.supabase.auth.signOut();
        if (error) throw new Error(error.message);
    } else {
        await appwriteService.account.deleteSession('current');
    }
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
    if (this.activeProvider === 'supabase') {
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
    } else {
      const doc = await appwriteService.databases.getDocument(appwriteService.databaseId, collectionName, id);
      return doc as T;
    }
  }

  public async listDocuments<T>(collectionName: Collections, filters: { [key: string]: any } = {}): Promise<T[]> {
    if (this.activeProvider === 'supabase') {
      let query = this.supabase.from(this.mapCollection(collectionName)).select('*');
      
      for (const key in filters) {
        if (Object.prototype.hasOwnProperty.call(filters, key)) {
          query = query.eq(key, filters[key]);
        }
      }

      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return (data || []) as T[];
    } else {
      const appwriteQueries: string[] = [];
      for (const key in filters) {
        if (Object.prototype.hasOwnProperty.call(filters, key)) {
          appwriteQueries.push(Query.equal(key, filters[key]));
        }
      }
      const { documents } = await appwriteService.databases.listDocuments(
          appwriteService.databaseId, 
          collectionName, 
          appwriteQueries
      );
      return documents as T[];
    }
  }

  public async createDocument<T>(collectionName: Collections, doc: Partial<T>, permissions?: string[]): Promise<T> {
    if (this.activeProvider === 'supabase') {
      const { data, error } = await this.supabase
        .from(this.mapCollection(collectionName))
        .insert([doc])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as T;
    } else {
      const newDoc = await appwriteService.databases.createDocument(appwriteService.databaseId, collectionName, ID.unique(), doc, permissions);
      return newDoc as T;
    }
  }

  public async updateDocument<T>(collectionName: Collections, id: string, doc: Partial<T>): Promise<T> {
    if (this.activeProvider === 'supabase') {
      const { data, error } = await this.supabase
        .from(this.mapCollection(collectionName))
        .update(doc)
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as T;
    } else {
      const updatedDoc = await appwriteService.databases.updateDocument(appwriteService.databaseId, collectionName, id, doc);
      return updatedDoc as T;
    }
  }

  public async deleteDocument(collectionName: Collections, id: string): Promise<void> {
    if (this.activeProvider === 'supabase') {
      const { error } = await this.supabase.from(this.mapCollection(collectionName)).delete().eq('id', id);
      if (error) throw new Error(error.message);
    } else {
      await appwriteService.databases.deleteDocument(appwriteService.databaseId, collectionName, id);
    }
  }

  public async searchDocuments<T>(collectionName: Collections, searchField: keyof T, searchText: string): Promise<T[]> {
    if (this.activeProvider === 'supabase') {
        const { data, error } = await this.supabase
            .from(this.mapCollection(collectionName))
            .select()
            .textSearch(searchField as string, `'${searchText}'`);
        if (error) throw new Error(error.message);
        return (data || []) as T[];
    } else {
        // Fallback to client-side filtering for Appwrite
        const { documents } = await appwriteService.databases.listDocuments(
            appwriteService.databaseId, 
            collectionName, 
            [Query.search(searchField as string, searchText)]
        );
        return documents as T[];
    }
  }

  // --- Storage Operations ---

  public async uploadFile(bucketId: string, file: File): Promise<string> {
    if (this.activeProvider === 'supabase') {
      const { data, error } = await this.supabase.storage.from(bucketId).upload(`${Date.now()}-${file.name}`, file);
      if (error) throw new Error(error.message);
      return data.path;
    } else {
      const result = await appwriteService.storage.createFile(bucketId, ID.unique(), file);
      return result.$id;
    }
  }

  public getFilePreview(bucketId: string, fileId: string): string {
    if (this.activeProvider === 'supabase') {
      const { data } = this.supabase.storage.from(bucketId).getPublicUrl(fileId);
      return data.publicUrl;
    } else {
      return appwriteService.storage.getFilePreview(bucketId, fileId).toString();
    }
  }

  public async deleteFile(bucketId: string, fileId: string): Promise<void> {
    if (this.activeProvider === 'supabase') {
      const { error } = await this.supabase.storage.from(bucketId).remove([fileId]);
      if (error) throw new Error(error.message);
    } else {
      await appwriteService.storage.deleteFile(bucketId, fileId);
    }
  }
}

// Export a singleton instance for global use
const dataService = DataService.getInstance();
export default dataService;
