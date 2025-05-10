/**
 * SupabaseAuthService.ts
 * 
 * Service for handling authentication with Supabase
 * Provides login, registration, password reset, and user profile management
 */

import supabase from '@/lib/supabaseConfig';
import { Session, User, UserResponse } from '@supabase/supabase-js';

export interface UserData {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  isGuest: boolean;
  preferences?: Record<string, any>;
  role?: string;
  credits?: number;
  createdAt?: string;
  lastLogin?: string;
}

class SupabaseAuthService {
  private currentUser: UserData | null = null;
  private session: Session | null = null;
  private authStateListeners: ((user: UserData | null) => void)[] = [];

  constructor() {
    this.initializeAuth();
  }

  /**
   * Initialize authentication state
   */
  private async initializeAuth(): Promise<void> {
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    this.session = session;
    
    // Set up auth state change listener
    supabase.auth.onAuthStateChange(async (event, session) => {
      this.session = session;
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session) {
          await this.fetchUserProfile(session.user);
          this.notifyListeners();
        }
      } else if (event === 'SIGNED_OUT') {
        this.currentUser = null;
        this.notifyListeners();
      }
    });
    
    // If we have a session, fetch the user profile
    if (session) {
      await this.fetchUserProfile(session.user);
    }
  }
  
  /**
   * Fetch additional user profile data from profiles table
   */
  private async fetchUserProfile(user: User): Promise<void> {
    try {
      // Get profile from profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        throw error;
      }
      
      this.currentUser = {
        id: user.id,
        email: user.email || '',
        name: profile?.name || user.user_metadata?.name,
        avatarUrl: profile?.avatar_url || user.user_metadata?.avatar_url,
        isGuest: !!user.user_metadata?.is_guest,
        preferences: profile?.preferences || {},
        role: profile?.role || 'user',
        credits: profile?.credits || 0,
        createdAt: profile?.created_at || user.created_at,
        lastLogin: profile?.last_login || new Date().toISOString()
      };
      
      // Update last login time
      await supabase
        .from('profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id);
      
    } catch (error) {
      console.error('Error fetching user profile:', error);
      
      // Create a basic user object if profile fetch fails
      this.currentUser = {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name,
        isGuest: !!user.user_metadata?.is_guest
      };
    }
  }
  
  /**
   * Register a new user
   */
  public async register(email: string, password: string, name: string): Promise<UserData | null> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        // Create initial profile
        await supabase.from('profiles').insert({
          id: data.user.id,
          name,
          email,
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
          role: 'user',
          credits: 0,
          preferences: {}
        });
        
        await this.fetchUserProfile(data.user);
        return this.currentUser;
      }
      
      return null;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }
  
  /**
   * Login with email and password
   */
  public async login(email: string, password: string): Promise<UserData | null> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        await this.fetchUserProfile(data.user);
        return this.currentUser;
      }
      
      return null;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
  
  /**
   * Login as guest
   */
  public async loginAsGuest(): Promise<UserData | null> {
    try {
      // Generate a unique email for the guest
      const guestEmail = `guest-${Date.now()}@sabeel-guest.com`;
      const guestPassword = `guest-${Math.random().toString(36).substring(2, 15)}`;
      
      const { data, error } = await supabase.auth.signUp({
        email: guestEmail,
        password: guestPassword,
        options: {
          data: {
            name: 'Guest User',
            is_guest: true
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        // Create initial profile for guest
        await supabase.from('profiles').insert({
          id: data.user.id,
          name: 'Guest User',
          email: guestEmail,
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
          role: 'guest',
          is_guest: true,
          credits: 0,
          preferences: {}
        });
        
        await this.fetchUserProfile(data.user);
        return this.currentUser;
      }
      
      return null;
    } catch (error) {
      console.error('Guest login error:', error);
      throw error;
    }
  }
  
  /**
   * Logout current user
   */
  public async logout(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      this.currentUser = null;
      this.notifyListeners();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
  
  /**
   * Get current authenticated user
   */
  public async getCurrentUser(): Promise<UserData | null> {
    if (this.currentUser) {
      return this.currentUser;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      await this.fetchUserProfile(user);
      return this.currentUser;
    }
    
    return null;
  }
  
  /**
   * Send password reset email
   */
  public async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }
  
  /**
   * Reset password with token
   */
  public async resetPassword(newPassword: string): Promise<void> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Password update error:', error);
      throw error;
    }
  }
  
  /**
   * Update user profile
   */
  public async updateProfile(updates: Partial<UserData>): Promise<UserData | null> {
    try {
      if (!this.currentUser) {
        throw new Error('User not authenticated');
      }
      
      // Update auth metadata if name is provided
      if (updates.name) {
        const { error: authUpdateError } = await supabase.auth.updateUser({
          data: { name: updates.name }
        });
        
        if (authUpdateError) {
          throw authUpdateError;
        }
      }
      
      // Update profile in profiles table
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({
          name: updates.name || this.currentUser.name,
          avatar_url: updates.avatarUrl || this.currentUser.avatarUrl,
          preferences: updates.preferences || this.currentUser.preferences
        })
        .eq('id', this.currentUser.id);
      
      if (profileUpdateError) {
        throw profileUpdateError;
      }
      
      // Refresh user profile
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await this.fetchUserProfile(user);
      }
      
      return this.currentUser;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }
  
  /**
   * Upload avatar image
   */
  public async uploadAvatar(file: File): Promise<string> {
    try {
      if (!this.currentUser) {
        throw new Error('User not authenticated');
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${this.currentUser.id}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('user-content')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data } = supabase.storage
        .from('user-content')
        .getPublicUrl(filePath);
      
      const avatarUrl = data.publicUrl;
      
      // Update profile
      await this.updateProfile({ avatarUrl });
      
      return avatarUrl;
    } catch (error) {
      console.error('Avatar upload error:', error);
      throw error;
    }
  }
  
  /**
   * Register auth state change listener
   */
  public onAuthStateChange(callback: (user: UserData | null) => void): () => void {
    this.authStateListeners.push(callback);
    
    // Call immediately with current state
    if (this.currentUser !== undefined) {
      callback(this.currentUser);
    }
    
    // Return unsubscribe function
    return () => {
      this.authStateListeners = this.authStateListeners.filter(cb => cb !== callback);
    };
  }
  
  /**
   * Notify all listeners of auth state change
   */
  private notifyListeners(): void {
    this.authStateListeners.forEach(callback => {
      callback(this.currentUser);
    });
  }
  
  /**
   * Check if user has required permissions
   */
  public hasPermission(permission: string): boolean {
    if (!this.currentUser) {
      return false;
    }
    
    // Admin has all permissions
    if (this.currentUser.role === 'admin') {
      return true;
    }
    
    // Guest has minimal permissions
    if (this.currentUser.isGuest) {
      const guestPermissions = ['read:content', 'read:events'];
      return guestPermissions.includes(permission);
    }
    
    // Regular user permissions
    const userPermissions = [
      'read:content',
      'read:events',
      'create:comment',
      'update:profile',
      'join:community'
    ];
    
    if (this.currentUser.role === 'scholar') {
      // Scholar additional permissions
      return [
        ...userPermissions,
        'create:content',
        'update:content'
      ].includes(permission);
    }
    
    // Default user permissions
    return userPermissions.includes(permission);
  }
}

// Export as singleton
const supabaseAuthService = new SupabaseAuthService();
export default supabaseAuthService;
