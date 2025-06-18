/**
 * Authentication Service
 * 
 * Handles user authentication, JWT tokens, OAuth flows, and session management
 */

import { User, AuthTokens, AuthSession, OAuthProvider } from '../types';
import { getEnvVar } from '../lib/utils';

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
  private apiUrl: string;

  constructor() {
    this.apiUrl = getEnvVar('VITE_API_BASE_URL', 'http://localhost:3000/api');
  }

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<AuthSession> {
    try {
      const response = await fetch(`${this.apiUrl}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Sign in failed');
      }

      const data = await response.json();
      return {
        user: data.user,
        tokens: data.tokens,
        expires_at: data.expires_at,
      };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  /**
   * Sign up with email and password
   */
  async signUp(email: string, password: string, name: string): Promise<AuthSession> {
    try {
      const response = await fetch(`${this.apiUrl}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Sign up failed');
      }

      const data = await response.json();
      return {
        user: data.user,
        tokens: data.tokens,
        expires_at: data.expires_at,
      };
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    try {
      await fetch(`${this.apiUrl}/auth/signout`, {
        method: 'POST',
        credentials: 'include',
      });
      
      localStorage.removeItem('sabeel-auth-storage');
    } catch (error) {
      console.error('Sign out error:', error);
      localStorage.removeItem('sabeel-auth-storage');
    }
  }

  /**
   * Get OAuth URL for provider
   */
  async getOAuthUrl(provider: string): Promise<string> {
    try {
      const state = this.generateOAuthState();
      const providers = this.getOAuthProviders();
      const oauthProvider = providers.find(p => p.id === provider);
      
      if (!oauthProvider) {
        throw new Error(`Unsupported OAuth provider: ${provider}`);
      }

      const params = new URLSearchParams({
        client_id: oauthProvider.client_id,
        response_type: 'code',
        scope: this.getOAuthScope(provider),
        state,
        redirect_uri: this.getRedirectUri(provider),
      });

      sessionStorage.setItem(`oauth_state_${provider}`, state);

      return `${oauthProvider.auth_url}?${params.toString()}`;
    } catch (error) {
      console.error('OAuth URL generation error:', error);
      throw error;
    }
  }

  /**
   * Refresh authentication tokens
   */
  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    try {
      const response = await fetch(`${this.apiUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Token refresh failed');
      }

      const data = await response.json();
      return data.tokens;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await fetch(`${this.apiUrl}/auth/me`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Get available OAuth providers
   */
  private getOAuthProviders(): OAuthProvider[] {
    return [
      {
        id: 'canvas',
        name: 'Canvas LMS',
        icon: '🎨',
        color: '#FF6B6B',
        auth_url: 'https://canvas.instructure.com/login/oauth2/auth',
        client_id: getEnvVar('VITE_CANVAS_CLIENT_ID', ''),
      },
      {
        id: 'jupyter',
        name: 'JupyterHub',
        icon: '📊',
        color: '#F79F1F',
        auth_url: getEnvVar('VITE_JUPYTER_API_URL', '') + '/oauth/authorize',
        client_id: getEnvVar('VITE_JUPYTER_CLIENT_ID', ''),
      },
    ];
  }

  /**
   * Generate OAuth state parameter
   */
  private generateOAuthState(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Get OAuth scope for provider
   */
  private getOAuthScope(provider: string): string {
    const scopes = {
      canvas: 'url:GET|/api/v1/courses url:GET|/api/v1/users/:user_id/profile',
      jupyter: 'read:user',
    };
    return scopes[provider as keyof typeof scopes] || 'openid email profile';
  }

  /**
   * Get redirect URI for provider
   */
  private getRedirectUri(provider: string): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/auth/${provider}/callback`;
  }
} 