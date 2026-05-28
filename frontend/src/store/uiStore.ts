import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info';
export type Theme = 'dark' | 'light';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ConfirmState {
  open: boolean;
  message: string;
  confirmText: string;
  resolve: ((ok: boolean) => void) | null;
}

interface UiState {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
  confirm: ConfirmState;
  showConfirm: (message: string, confirmText?: string) => Promise<boolean>;
  resolveConfirm: (ok: boolean) => void;
  theme: Theme;
  toggleTheme: () => void;
}

const savedTheme = (localStorage.getItem('theme') as Theme) ?? 'dark';
document.documentElement.dataset.theme = savedTheme;

export const useUiStore = create<UiState>((set, get) => ({
  toasts: [],
  addToast: (message, type = 'info') => {
    const { toasts } = get();
    if (toasts.some((t) => t.message === message && t.type === type)) return;
    const id = Date.now().toString();
    set((state) => {
      const next = [...state.toasts, { id, message, type }];
      return { toasts: next.length > 5 ? next.slice(next.length - 5) : next };
    });
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3500);
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  confirm: { open: false, message: '', confirmText: '确认删除', resolve: null },
  showConfirm: (message, confirmText = '确认删除') =>
    new Promise<boolean>((resolve) => {
      set({ confirm: { open: true, message, confirmText, resolve } });
    }),
  resolveConfirm: (ok) => {
    const { confirm } = get();
    confirm.resolve?.(ok);
    set({ confirm: { open: false, message: '', confirmText: '确认删除', resolve: null } });
  },

  theme: savedTheme,
  toggleTheme: () => {
    const next: Theme = get().theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('theme', next);
    set({ theme: next });
  },
}));
