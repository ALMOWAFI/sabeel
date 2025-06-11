/**
 * Authentication Service
 * 
 * Handles user authentication, JWT tokens, OAuth flows, and session management
 */

import { createClient } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: 'student' | 'instructor' | 'admin' | 'scholar';
  preferences?: UserPreferences;
  canvas_user_id?: number;
  jupyter_user_id?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'en' | 'ar' | 'both';
  notification_settings: {
    email: boolean;
    push: boolean;
    in_app: boolean;
  };
  privacy_settings: {
    profile_visibility: 'public' | 'private' | 'limited';
    activity_visibility: boolean;
  };
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface OAuthProvider {
  name: string;
  client_id: string;
  redirect_uri: string;
  scope: string[];
  authorization_url: string;
  token_url: string;
}

export class AuthService {
  private supabase;
  private currentUser: User | null = null;
  private tokens: AuthTokens | null = null;
  private refreshTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
    
    this.initializeAuth();
  }

  /**
   * Initialize authentication system
   */
  private async initializeAuth() {
    // Check for existing session
    const { data: { session } } = await this.supabase.auth.getSession();
    
    if (session) {
      await this.setCurrentUser(session.user);
      this.scheduleTokenRefresh(session.expires_in || 3600);
    }

    // Listen for auth changes
    this.supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await this.setCurrentUser(session.user);
        this.scheduleTokenRefresh(session.expires_in || 3600);
      } else if (event === 'SIGNED_OUT') {
        this.clearCurrentUser();
      } else if (event === 'TOKEN_REFRESHED' && session) {
        this.scheduleTokenRefresh(session.expires_in || 3600);
      }
    });
  }

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<User> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(`Sign in failed: ${error.message}`);
    }

    if (!data.user) {
      throw new Error('No user data received');
    }

    return this.setCurrentUser(data.user);
  }

  /**
   * Sign up with email and password
   */
  async signUp(email: string, password: string, userData: {
    name: string;
    role: User['role'];
  }): Promise<User> {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          role: userData.role,
        },
      },
    });

    if (error) {
      throw new Error(`Sign up failed: ${error.message}`);
    }

    if (!data.user) {
      throw new Error('No user data received');
    }

    return this.setCurrentUser(data.user);
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    
    if (error) {
      throw new Error(`Sign out failed: ${error.message}`);
    }

    this.clearCurrentUser();
  }

  /**
   * OAuth sign in with Canvas
   */
  async signInWithCanvas(): Promise<string> {
    const state = this.generateOAuthState();
    const params = new URLSearchParams({
      client_id: process.env.CANVAS_CLIENT_ID || '',
      redirect_uri: process.env.CANVAS_REDIRECT_URI || '',
      response_type: 'code',
      state,
      scope: 'url:GET|/api/v1/users/:id url:GET|/api/v1/courses',
    });

    const authUrl = `${process.env.CANVAS_API_URL?.replace('/api/v1', '')}/login/oauth2/auth?${params}`;
    
    // Store state in session storage for verification
    sessionStorage.setItem('oauth_state', state);
    
    return authUrl;
  }

  /**
   * Handle OAuth callback from Canvas
   */
  async handleCanvasCallback(code: string, state: string): Promise<User> {
    // Verify state parameter
    const storedState = sessionStorage.getItem('oauth_state');
    if (state !== storedState) {
      throw new Error('Invalid OAuth state parameter');
    }

    // Exchange code for tokens
    const tokenResponse = await fetch(`${process.env.CANVAS_API_URL?.replace('/api/v1', '')}/login/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.CANVAS_CLIENT_ID || '',
        client_secret: process.env.CANVAS_CLIENT_SECRET || '',
        redirect_uri: process.env.CANVAS_REDIRECT_URI || '',
        code,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange OAuth code for tokens');
    }

    const tokens = await tokenResponse.json();

    // Get user info from Canvas
    const userResponse = await fetch(`${process.env.CANVAS_API_URL}/users/self`, {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to get user info from Canvas');
    }

    const canvasUser = await userResponse.json();

    // Create or update user in Supabase
    const userData = {
      email: canvasUser.email,
      name: canvasUser.name,
      avatar_url: canvasUser.avatar_url,
      canvas_user_id: canvasUser.id,
      role: 'student' as const,
    };

    // Sign in or create user in Supabase
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: 'canvas' as any, // Custom provider
      options: {
        redirectTo: process.env.BASE_URL,
      },
    });

    if (error) {
      throw new Error(`OAuth sign in failed: ${error.message}`);
    }

    // Store Canvas tokens for API access
    this.tokens = tokens;
    localStorage.setItem('canvas_tokens', JSON.stringify(tokens));

    return this.setCurrentUser({ ...canvasUser, ...userData });
  }

  /**
   * OAuth sign in with JupyterHub
   */
  async signInWithJupyter(): Promise<string> {
    const state = this.generateOAuthState();
    const params = new URLSearchParams({
      client_id: process.env.JUPYTER_CLIENT_ID || '',
      redirect_uri: process.env.JUPYTER_REDIRECT_URI || '',
      response_type: 'code',
      state,
      scope: 'read:user',
    });

    const authUrl = `${process.env.JUPYTER_API_URL?.replace('/hub/api', '')}/hub/oauth2/authorize?${params}`;
    
    sessionStorage.setItem('oauth_state', state);
    
    return authUrl;
  }

  /**
   * Handle OAuth callback from JupyterHub
   */
  async handleJupyterCallback(code: string, state: string): Promise<User> {
    const storedState = sessionStorage.getItem('oauth_state');
    if (state !== storedState) {
      throw new Error('Invalid OAuth state parameter');
    }

    // Exchange code for tokens
    const tokenResponse = await fetch(`${process.env.JUPYTER_API_URL?.replace('/hub/api', '')}/hub/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.JUPYTER_CLIENT_ID || '',
        client_secret: process.env.JUPYTER_CLIENT_SECRET || '',
        redirect_uri: process.env.JUPYTER_REDIRECT_URI || '',
        code,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange OAuth code for tokens');
    }

    const tokens = await tokenResponse.json();

    // Get user info from JupyterHub
    const userResponse = await fetch(`${process.env.JUPYTER_API_URL}/user`, {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to get user info from JupyterHub');
    }

    const jupyterUser = await userResponse.json();

    const userData = {
      email: jupyterUser.email || `${jupyterUser.name}@jupyter.local`,
      name: jupyterUser.name,
      jupyter_user_id: jupyterUser.name,
      role: 'student' as const,
    };

    this.tokens = tokens;
    localStorage.setItem('jupyter_tokens', JSON.stringify(tokens));

    return this.setCurrentUser({ ...jupyterUser, ...userData });
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: User['role']): boolean {
    return this.currentUser?.role === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: User['role'][]): boolean {
    return this.currentUser ? roles.includes(this.currentUser.role) : false;
  }

  /**
   * Update user preferences
   */
  async updatePreferences(preferences: Partial<UserPreferences>): Promise<void> {
    if (!this.currentUser) {
      throw new Error('No authenticated user');
    }

    const { error } = await this.supabase
      .from('user_preferences')
      .upsert({
        user_id: this.currentUser.id,
        ...preferences,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      throw new Error(`Failed to update preferences: ${error.message}`);
    }

    if (this.currentUser.preferences) {
      this.currentUser.preferences = { ...this.currentUser.preferences, ...preferences };
    } else {
      this.currentUser.preferences = preferences as UserPreferences;
    }
  }

  /**
   * Get authentication tokens
   */
  getTokens(): AuthTokens | null {
    return this.tokens;
  }

  /**
   * Refresh authentication tokens
   */
  async refreshTokens(): Promise<AuthTokens> {
    const { data, error } = await this.supabase.auth.refreshSession();

    if (error) {
      throw new Error(`Token refresh failed: ${error.message}`);
    }

    if (data.session) {
      this.scheduleTokenRefresh(data.session.expires_in || 3600);
    }

    return {
      access_token: data.session?.access_token || '',
      refresh_token: data.session?.refresh_token || '',
      expires_in: data.session?.expires_in || 3600,
      token_type: 'Bearer',
    };
  }

  /**
   * Generate OAuth state parameter
   */
  private generateOAuthState(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  /**
   * Set current user and fetch additional data
   */
  private async setCurrentUser(user: any): Promise<User> {
    // Fetch user preferences
    const { data: preferences } = await this.supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    this.currentUser = {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.name || user.email,
      avatar_url: user.user_metadata?.avatar_url,
      role: user.user_metadata?.role || 'student',
      preferences: preferences || undefined,
      canvas_user_id: user.user_metadata?.canvas_user_id,
      jupyter_user_id: user.user_metadata?.jupyter_user_id,
    };

    return this.currentUser;
  }

  /**
   * Clear current user data
   */
  private clearCurrentUser(): void {
    this.currentUser = null;
    this.tokens = null;
    
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }

    // Clear stored tokens
    localStorage.removeItem('canvas_tokens');
    localStorage.removeItem('jupyter_tokens');
    sessionStorage.removeItem('oauth_state');
  }

  /**
   * Schedule automatic token refresh
   */
  private scheduleTokenRefresh(expiresIn: number): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    // Refresh 5 minutes before expiration
    const refreshTime = (expiresIn - 300) * 1000;
    
    this.refreshTimer = setTimeout(async () => {
      try {
        await this.refreshTokens();
      } catch (error) {
        console.error('Auto token refresh failed:', error);
        // Force re-authentication
        await this.signOut();
      }
    }, refreshTime);
  }
} 