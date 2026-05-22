import React from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import type { ToastType } from '../../store/uiStore';

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={16} />,
  error:   <XCircle size={16} />,
  info:    <Info size={16} />,
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUiStore();
  if (!toasts.length) return null;
  return (
    <div role="status" aria-live="polite" aria-atomic="false" className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span className="toast-icon">{ICONS[t.type]}</span>
          <span className="toast-message">{t.message}</span>
          <button className="toast-close" onClick={() => removeToast(t.id)}><X size={14} /></button>
          <div className="toast-progress" />
        </div>
      ))}
    </div>
  );
};
