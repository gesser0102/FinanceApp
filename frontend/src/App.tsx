import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Pessoas } from './pages/Pessoas';
import { Categorias } from './pages/Categorias';
import { Transacoes } from './pages/Transacoes';

// Configuração do React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="pessoas" element={<Pessoas />} />
            <Route path="categorias" element={<Categorias />} />
            <Route path="transacoes" element={<Transacoes />} />
          </Route>
        </Routes>
      </BrowserRouter>

      {/* Toast notifications - Captura mensagens de erro e sucesso da API */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.3)',
            borderRadius: '0.75rem',
            padding: '1rem',
            border: '1px solid #334155',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#1e293b',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#1e293b',
            },
            duration: 5000,
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
