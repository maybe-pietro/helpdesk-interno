import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTickets } from '../hooks/useTickets';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/tickets/StatusBadge';
import PriorityBadge from '../components/tickets/PriorityBadge';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { LoadingBlock } from '../components/ui/Spinner';

const STATUS_OPTIONS = ['aberto', 'em_andamento', 'aguardando_solicitante', 'resolvido', 'fechado'];

export default function TicketListPage() {
  const { user } = useAuth();
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [assignedToMe, setAssignedToMe] = useState(false);

  const hasActiveFilters = Boolean(status || search || assignedToMe);

  const filters = {
    ...(status && { status }),
    ...(search && { search }),
    ...(assignedToMe && { assigned_agent_id: 'me' }),
  };

  const { data, isLoading, isError } = useTickets(filters);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-800">Chamados</h1>
        <Link to="/tickets/new">
          <Button type="button">+ Novo chamado</Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-auto">
          <option value="">Todos os status</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
        <Input
          type="text"
          placeholder="Buscar por titulo/descricao"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px]"
        />
        {user?.role === 'agente' && (
          <label className="flex items-center gap-1 text-sm text-slate-600">
            <input type="checkbox" checked={assignedToMe} onChange={(e) => setAssignedToMe(e.target.checked)} />
            Atribuidos a mim
          </label>
        )}
      </div>

      {isLoading && <LoadingBlock label="Carregando chamados..." />}
      {isError && <p className="text-red-600 text-sm">Erro ao carregar chamados.</p>}

      {data && data.rows.length === 0 && (
        <Card padding="p-0">
          <EmptyState
            title={hasActiveFilters ? 'Nenhum chamado encontrado' : 'Nenhum chamado por aqui ainda'}
            description={
              hasActiveFilters
                ? 'Tente ajustar os filtros de busca.'
                : 'Quando um chamado for aberto, ele aparece nesta lista.'
            }
            action={
              !hasActiveFilters && (
                <Link to="/tickets/new">
                  <Button type="button">Abrir primeiro chamado</Button>
                </Link>
              )
            }
          />
        </Card>
      )}

      {data && data.rows.length > 0 && (
        <Card padding="p-0" className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-3 py-2">Titulo</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Prioridade</th>
                <th className="px-3 py-2">Departamento</th>
                <th className="px-3 py-2">Agente</th>
                <th className="px-3 py-2">Criado em</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((ticket) => (
                <tr key={ticket.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-3 py-2">
                    <Link to={`/tickets/${ticket.id}`} className="text-slate-800 font-medium hover:underline">
                      {ticket.title}
                    </Link>
                  </td>
                  <td className="px-3 py-2"><StatusBadge status={ticket.status} /></td>
                  <td className="px-3 py-2"><PriorityBadge priority={ticket.priority} /></td>
                  <td className="px-3 py-2 text-slate-600">{ticket.department_name}</td>
                  <td className="px-3 py-2 text-slate-600">{ticket.assigned_agent_name || '-'}</td>
                  <td className="px-3 py-2 text-slate-500">{new Date(ticket.created_at).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
