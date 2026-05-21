import { create } from 'zustand';

interface AuthState {
  username: string | null;
  isAuthenticated: boolean;
  authChecked: boolean;
  login: (username: string) => void;
  logout: () => void;
  setChecked: (authenticated: boolean, username?: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  username: null,
  isAuthenticated: false,
  authChecked: false,
  login: (username) => {
    set({ username, isAuthenticated: true, authChecked: true });
  },
  logout: () => {
    set({ username: null, isAuthenticated: false, authChecked: true });
  },
  setChecked: (authenticated, username = null) => {
    set({ isAuthenticated: authenticated, username: authenticated ? username : null, authChecked: true });
  },
}));
