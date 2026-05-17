import React from 'react';
import { useUiStore } from '../../store/uiStore';
import type { ToastType } from '../../store/uiStore';

const ICONS: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUiStore();
  if (!toasts.length) return null;
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span className="toast-icon">{ICONS[t.type]}</span>
          <span className="toast-message">{t.message}</span>
          <button className="toast-close" onClick={() => removeToast(t.id)}>✕</button>
          <div className="toast-progress" />
        </div>
      ))}
    </div>
  );
};
