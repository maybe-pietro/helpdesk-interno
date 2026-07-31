const STATUS_LABELS = {
  aberto: 'Aberto',
  em_andamento: 'Em andamento',
  aguardando_solicitante: 'Aguardando solicitante',
  resolvido: 'Resolvido',
  fechado: 'Fechado',
};

const STATUS_COLORS = {
  aberto: 'bg-blue-100 text-blue-800',
  em_andamento: 'bg-amber-100 text-amber-800',
  aguardando_solicitante: 'bg-purple-100 text-purple-800',
  resolvido: 'bg-green-100 text-green-800',
  fechado: 'bg-slate-200 text-slate-700',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[status] || 'bg-slate-100 text-slate-700'}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

export { STATUS_LABELS };
