import { createContext, useCallback, useContext, useRef, useState } from 'react';
import ToastContainer from '../components/ui/ToastContainer';

const ToastContext = createContext(null);
const DEFAULT_DURATION = 4000;

// Module-level bridge so code outside the React tree (the QueryClient's
// mutation error handler, created in main.jsx before render) can still
// surface a toast. Mirrors the setUnauthorizedHandler pattern in api/client.js.
let globalToast = null;
export function getGlobalToast() {
  return globalToast;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((type, message) => {
    const id = nextId.current++;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => dismiss(id), DEFAULT_DURATION);
  }, [dismiss]);

  const toast = {
    success: (message) => push('success', message),
    error: (message) => push('error', message),
  };
  globalToast = toast;

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}
