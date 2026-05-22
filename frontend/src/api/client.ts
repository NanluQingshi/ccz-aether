import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { useUiStore } from '../store/uiStore';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
});

client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['X-Request-Id'] = crypto.randomUUID();
  return config;
});

// 防止重复触发（如多个并发请求同时收到 401）
let isHandling401 = false;

client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 将后端返回的 message 提升到 error.message，方便各页面 catch 直接使用
    const backendMessage: string | undefined = error.response?.data?.message;
    if (backendMessage) {
      error.message = backendMessage;
    }

    // 从响应头取回请求 ID，便于问题定位
    const requestId: string | undefined = error.response?.headers?.['x-request-id'];
    if (requestId) {
      error.requestId = requestId;
    }

    if (error.response?.status === 401 && !isHandling401) {
      isHandling401 = true;
      error.handled = true;
      useAuthStore.getState().logout();
      useUiStore.getState().addToast('登录已过期，请重新登录', 'error');
      setTimeout(() => {
        isHandling401 = false;
        window.location.href = '/admin/login';
      }, 1500);
    }
    return Promise.reject(error);
  }
);

/** 提取错误信息，若已被拦截器处理（如 401 跳转）则返回 null，调用方应跳过 toast */
export function getErrorMessage(e: unknown, fallback: string): string | null {
  if (e && typeof e === 'object' && 'handled' in e && (e as Record<string, unknown>).handled) {
    return null;
  }
  const err = e as Record<string, unknown> | null;
  const message = (e instanceof Error ? e.message : null) || fallback;
  const requestId = err && typeof err.requestId === 'string' ? err.requestId : null;
  return requestId ? `${message}（ID: ${requestId.slice(0, 8)}）` : message;
}

export default client;
