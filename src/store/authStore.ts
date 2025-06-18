import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthTokens, AuthSession } from '../types';
import { AuthService } from '../services/AuthService';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  loginWithOAuth: (provider: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (user: Partial<User>) => void;
  checkAuthStatus: () => Promise<void>;
}

const authService = new AuthService();

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const session = await authService.signIn(email, password);
          
          set({
            user: session.user,
            tokens: session.tokens,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed',
          });
          throw error;
        }
      },

      loginWithOAuth: async (provider: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const authUrl = await authService.getOAuthUrl(provider);
          window.location.href = authUrl;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'OAuth login failed',
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authService.signOut();
          
          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error('Logout error:', error);
          // Still clear the state even if logout fails
          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      refreshTokens: async () => {
        try {
          const { tokens } = get();
          if (!tokens) {
            throw new Error('No tokens available');
          }
          
          const newTokens = await authService.refreshTokens(tokens.refresh_token);
          
          set((state) => ({
            tokens: newTokens,
            isAuthenticated: true,
          }));
        } catch (error) {
          console.error('Token refresh failed:', error);
          // If refresh fails, logout the user
          get().logout();
        }
      },

      clearError: () => set({ error: null }),
      
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      
      updateUser: (userData: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },

      checkAuthStatus: async () => {
        try {
          set({ isLoading: true });
          
          const { tokens } = get();
          if (!tokens) {
            set({ isLoading: false, isAuthenticated: false });
            return;
          }

          // Check if tokens are expired
          if (tokens.expires_at < Date.now()) {
            // Try to refresh tokens
            await get().refreshTokens();
          } else {
            // Tokens are still valid, get current user
            const user = await authService.getCurrentUser();
            set({
              user,
              isAuthenticated: !!user,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error('Auth status check failed:', error);
          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'sabeel-auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Initialize auth status check when the app loads
if (typeof window !== 'undefined') {
  useAuthStore.getState().checkAuthStatus();
}