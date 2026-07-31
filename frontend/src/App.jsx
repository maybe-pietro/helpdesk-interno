import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';
import AppShell from './components/layout/AppShell';
import LoginPage from './pages/LoginPage';
import TicketListPage from './pages/TicketListPage';
import NewTicketPage from './pages/NewTicketPage';
import TicketDetailPage from './pages/TicketDetailPage';
import DashboardPage from './pages/DashboardPage';
import UsersAdminPage from './pages/admin/UsersAdminPage';
import CategoriesAdminPage from './pages/admin/CategoriesAdminPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route path="/" element={<TicketListPage />} />
              <Route path="/tickets/new" element={<NewTicketPage />} />
              <Route path="/tickets/:id" element={<TicketDetailPage />} />

              <Route element={<RoleRoute allow={['agente', 'admin']} />}>
                <Route path="/dashboard" element={<DashboardPage />} />
              </Route>

              <Route element={<RoleRoute allow={['admin']} />}>
                <Route path="/admin/users" element={<UsersAdminPage />} />
                <Route path="/admin/categories" element={<CategoriesAdminPage />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
