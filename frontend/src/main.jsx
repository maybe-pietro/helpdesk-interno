import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { ToastProvider, getGlobalToast } from './context/ToastContext';
import './styles/index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error) => {
        const message = error?.response?.data?.error || 'Ocorreu um erro. Tente novamente.';
        getGlobalToast()?.error(message);
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
