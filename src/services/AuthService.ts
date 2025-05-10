/**
 * AuthService.ts
 * Provides unified authentication and authorization services for all integrated systems
 * Implements Single Sign-On (SSO) for seamless user experience across platforms
 */

import axios from 'axios';
import jwtDecode from 'jwt-decode';

// Types
export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
  preferences: UserPreferences;
  metadata: Record<string, any>;
}

export interface UserPreferences {
  language: string;
  theme: 'light' | 'dark';
  uiDirection: 'ltr' | 'rtl';
  notifications: boolean;
  accessibility: Record<string, boolean>;
}

export interface AuthToken {
  token: string;
  refreshToken: string;
  expiresAt: number;
}

export interface SystemAccess {
  edx: boolean;
  canvas: boolean;
  peertube: boolean;
  h5p: boolean;
  jupyter: boolean;
  kingraph: boolean;
}

export type LoginCredentials = {
  username: string;
  password: string;
};

// Config
const AUTH_API_URL = process.env.REACT_APP_AUTH_API_URL || 'https://api.sabeel.app/auth';
const TOKEN_KEY = 'sabeel_auth_token';
const REFRESH_TOKEN_KEY = 'sabeel_refresh_token';
const USER_KEY = 'sabeel_user';
const TOKEN_EXPIRY_KEY = 'sabeel_token_expiry';

/**
 * Handles authentication, authorization, and session management
 * for the Sabeel platform and all integrated educational systems
 */
class AuthService {
  private currentUser: User | null = null;
  private token: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiresAt: number = 0;
  private refreshTokenTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    // Load auth data from localStorage if available
    this.loadAuthDataFromStorage();
    
    // Set up token refresh mechanism
    if (this.token && this.tokenExpiresAt) {
      this.setupTokenRefresh();
    }
  }

  /**
   * Load authentication data from local storage if it exists
   */
  private loadAuthDataFromStorage(): void {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      const userJson = localStorage.getItem(USER_KEY);
      const tokenExpiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

      if (token && refreshToken && userJson && tokenExpiry) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.currentUser = JSON.parse(userJson);
        this.tokenExpiresAt = parseInt(tokenExpiry, 10);

        // Check if token is expired
        if (this.isTokenExpired()) {
          this.attemptRefreshToken();
        }
      }
    } catch (error) {
      console.error('Error loading auth data from storage:', error);
      this.logout(); // Clear any potentially corrupted data
    }
  }

  /**
   * Check if the current token is expired
   */
  private isTokenExpired(): boolean {
    return Date.now() >= this.tokenExpiresAt;
  }

  /**
   * Setup token refresh mechanism
   */
  private setupTokenRefresh(): void {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }

    // Calculate time before token expires (minus a buffer of 5 minutes)
    const timeUntilExpiry = Math.max(0, this.tokenExpiresAt - Date.now() - 5 * 60 * 1000);
    
    this.refreshTokenTimeout = setTimeout(() => {
      this.attemptRefreshToken();
    }, timeUntilExpiry);
  }

  /**
   * Attempt to refresh the token before it expires
   */
  private async attemptRefreshToken(): Promise<boolean> {
    try {
      if (!this.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(`${AUTH_API_URL}/refresh-token`, {
        refreshToken: this.refreshToken
      });

      if (response.data && response.data.token) {
        this.setAuthData(response.data);
        return true;
      }
      
      throw new Error('Failed to refresh token');
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.logout();
      return false;
    }
  }

  /**
   * Set authentication data after successful login or token refresh
   */
  private setAuthData(authData: { token: string; refreshToken: string; user: User }): void {
    this.token = authData.token;
    this.refreshToken = authData.refreshToken;
    this.currentUser = authData.user;

    // Decode token to get expiration
    const decodedToken: any = jwtDecode(authData.token);
    this.tokenExpiresAt = decodedToken.exp * 1000; // Convert to milliseconds

    // Save to local storage
    localStorage.setItem(TOKEN_KEY, this.token);
    localStorage.setItem(REFRESH_TOKEN_KEY, this.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(this.currentUser));
    localStorage.setItem(TOKEN_EXPIRY_KEY, this.tokenExpiresAt.toString());

    // Set up token refresh
    this.setupTokenRefresh();
  }

  /**
   * Perform login with credentials
   */
  public async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await axios.post(`${AUTH_API_URL}/login`, credentials);
      
      if (response.data && response.data.token) {
        this.setAuthData(response.data);
        return this.currentUser as User;
      }
      
      throw new Error('Invalid login response');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Perform login with social provider
   */
  public async socialLogin(provider: 'google' | 'facebook' | 'twitter' | 'apple'): Promise<string> {
    // Return the URL to redirect to for social login
    return `${AUTH_API_URL}/social-login/${provider}?redirect=${encodeURIComponent(window.location.origin + '/auth/callback')}`;
  }

  /**
   * Handle callback from social login
   */
  public async handleSocialLoginCallback(code: string): Promise<User> {
    try {
      const response = await axios.post(`${AUTH_API_URL}/social-login-callback`, { code });
      
      if (response.data && response.data.token) {
        this.setAuthData(response.data);
        return this.currentUser as User;
      }
      
      throw new Error('Invalid social login callback response');
    } catch (error) {
      console.error('Social login callback error:', error);
      throw error;
    }
  }

  /**
   * Register a new user
   */
  public async register(userData: {
    username: string;
    email: string;
    password: string;
    name: string;
    language?: string;
  }): Promise<User> {
    try {
      const response = await axios.post(`${AUTH_API_URL}/register`, userData);
      
      if (response.data && response.data.token) {
        this.setAuthData(response.data);
        return this.currentUser as User;
      }
      
      throw new Error('Invalid registration response');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Logout the current user
   */
  public logout(): void {
    // Clear token refresh timeout
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
      this.refreshTokenTimeout = null;
    }

    // Clear auth data
    this.token = null;
    this.refreshToken = null;
    this.currentUser = null;
    this.tokenExpiresAt = 0;

    // Clear localStorage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);

    // Optional: Call logout endpoint to invalidate token on server
    try {
      axios.post(`${AUTH_API_URL}/logout`, {}, {
        headers: { Authorization: `Bearer ${this.token}` }
      }).catch(() => {
        // Ignore errors here as we're logging out anyway
      });
    } catch (error) {
      // Ignore errors
    }
  }

  /**
   * Get the current authenticated user
   */
  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    return !!this.token && !this.isTokenExpired();
  }

  /**
   * Get authorization header for API requests
   */
  public getAuthHeader(): { Authorization: string } | {} {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  /**
   * Check if user has access to a specific system
   */
  public hasSystemAccess(system: keyof SystemAccess): boolean {
    if (!this.isAuthenticated() || !this.currentUser) {
      return false;
    }

    // In a real application, this would check user permissions
    // For now, we'll give access to all systems for authenticated users
    return true;
  }

  /**
   * Generate SSO URL for a specific system
   */
  public async getSystemSsoUrl(system: keyof SystemAccess): Promise<string> {
    if (!this.isAuthenticated()) {
      throw new Error('User must be authenticated to access integrated systems');
    }

    try {
      const response = await axios.post(
        `${AUTH_API_URL}/sso/${system}`,
        {},
        { headers: { ...this.getAuthHeader() } }
      );
      
      return response.data.ssoUrl;
    } catch (error) {
      console.error(`Error generating SSO URL for ${system}:`, error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  public async updateProfile(profileData: Partial<User>): Promise<User> {
    if (!this.isAuthenticated()) {
      throw new Error('User must be authenticated to update profile');
    }

    try {
      const response = await axios.put(
        `${AUTH_API_URL}/profile`,
        profileData,
        { headers: { ...this.getAuthHeader() } }
      );
      
      // Update the current user with the new data
      this.currentUser = {
        ...this.currentUser as User,
        ...response.data.user
      };
      
      // Update in localStorage
      localStorage.setItem(USER_KEY, JSON.stringify(this.currentUser));
      
      return this.currentUser;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  /**
   * Update user preferences
   */
  public async updatePreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    if (!this.isAuthenticated() || !this.currentUser) {
      throw new Error('User must be authenticated to update preferences');
    }

    try {
      const response = await axios.put(
        `${AUTH_API_URL}/preferences`,
        preferences,
        { headers: { ...this.getAuthHeader() } }
      );
      
      // Update the current user preferences
      this.currentUser.preferences = {
        ...this.currentUser.preferences,
        ...response.data.preferences
      };
      
      // Update in localStorage
      localStorage.setItem(USER_KEY, JSON.stringify(this.currentUser));
      
      // Apply certain preferences immediately
      this.applyUserPreferences();
      
      return this.currentUser.preferences;
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }

  /**
   * Apply user preferences to the application
   */
  private applyUserPreferences(): void {
    if (!this.currentUser) return;
    
    const { preferences } = this.currentUser;
    
    // Apply UI direction (RTL/LTR)
    if (preferences.uiDirection) {
      document.documentElement.dir = preferences.uiDirection;
    }
    
    // Apply theme
    if (preferences.theme) {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(preferences.theme);
    }
    
    // Save preferences to localStorage for reuse on page refresh
    const savedPrefs = {
      theme: preferences.theme,
      uiDirection: preferences.uiDirection,
      language: preferences.language
    };
    localStorage.setItem('sabeelPreferences', JSON.stringify(savedPrefs));
  }

  /**
   * Request password reset
   */
  public async requestPasswordReset(email: string): Promise<boolean> {
    try {
      await axios.post(`${AUTH_API_URL}/request-password-reset`, { email });
      return true;
    } catch (error) {
      console.error('Error requesting password reset:', error);
      throw error;
    }
  }

  /**
   * Reset password with token
   */
  public async resetPassword(token: string, newPassword: string): Promise<boolean> {
    try {
      await axios.post(`${AUTH_API_URL}/reset-password`, {
        token,
        newPassword
      });
      return true;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }

  /**
   * Change password (for authenticated users)
   */
  public async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    if (!this.isAuthenticated()) {
      throw new Error('User must be authenticated to change password');
    }

    try {
      await axios.post(
        `${AUTH_API_URL}/change-password`,
        { currentPassword, newPassword },
        { headers: { ...this.getAuthHeader() } }
      );
      return true;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const authService = new AuthService();

export default authService;
