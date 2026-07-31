const PRIORITY_LABELS = {
  baixa: 'Baixa',
  media: 'Media',
  alta: 'Alta',
  urgente: 'Urgente',
};

const PRIORITY_COLORS = {
  baixa: 'bg-slate-100 text-slate-700',
  media: 'bg-blue-100 text-blue-800',
  alta: 'bg-orange-100 text-orange-800',
  urgente: 'bg-red-100 text-red-800',
};

export default function PriorityBadge({ priority }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${PRIORITY_COLORS[priority] || 'bg-slate-100 text-slate-700'}`}>
      {PRIORITY_LABELS[priority] || priority}
    </span>
  );
}

export { PRIORITY_LABELS };
