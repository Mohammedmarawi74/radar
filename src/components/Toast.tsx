import React, { useState, useEffect, createContext, useContext } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[1000] flex flex-col gap-3 w-full max-w-md px-4" dir="rtl">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-md animate-slideDown ${
              toast.type === 'success' 
                ? 'bg-emerald-50/90 border-emerald-100 text-emerald-800' 
                : toast.type === 'error'
                ? 'bg-red-50/90 border-red-100 text-red-800'
                : 'bg-blue-50/90 border-blue-100 text-blue-800'
            }`}
          >
            <div className={`shrink-0 p-1.5 rounded-lg ${
              toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-600' :
              toast.type === 'error' ? 'bg-red-500/20 text-red-600' :
              'bg-blue-500/20 text-blue-600'
            }`}>
              {toast.type === 'success' && <CheckCircle2 size={18} />}
              {toast.type === 'error' && <AlertCircle size={18} />}
              {toast.type === 'info' && <Info size={18} />}
            </div>
            <span className="font-black text-[13px] flex-1">{toast.message}</span>
            <button 
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-black/5 rounded-lg transition-colors text-slate-400"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
