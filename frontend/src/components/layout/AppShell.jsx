import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../ui/Logo';

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
  }`;

const ROLE_LABELS = {
  solicitante: 'Solicitante',
  agente: 'Agente',
  admin: 'Admin',
};

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export default function AppShell() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <nav className="flex items-center gap-1">
            <Logo className="mr-4" />
            <NavLink to="/" end className={linkClass}>Chamados</NavLink>
            <NavLink to="/tickets/new" className={linkClass}>Novo chamado</NavLink>
            {(user?.role === 'agente' || user?.role === 'admin') && (
              <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
            )}
            {user?.role === 'admin' && (
              <>
                <NavLink to="/admin/users" className={linkClass}>Usuarios</NavLink>
                <NavLink to="/admin/categories" className={linkClass}>Categorias</NavLink>
              </>
            )}
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold flex items-center justify-center">
                {initials(user?.name)}
              </span>
              <span className="text-slate-600">
                {user?.name} <span className="text-slate-400">· {ROLE_LABELS[user?.role] || user?.role}</span>
              </span>
            </div>
            <button type="button" onClick={logout} className="text-slate-500 hover:text-slate-800">
              Sair
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
