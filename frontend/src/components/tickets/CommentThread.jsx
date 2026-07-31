import { STATUS_LABELS } from './StatusBadge';

function formatDate(value) {
  return new Date(value).toLocaleString('pt-BR');
}

function statusLabel(status) {
  return STATUS_LABELS[status] || status;
}

function EventItem({ event }) {
  if (event.event_type === 'status_change') {
    return (
      <li className="text-xs text-slate-500 italic">
        {event.author_name} alterou o status de "{statusLabel(event.old_status)}" para "{statusLabel(event.new_status)}" em {formatDate(event.created_at)}
      </li>
    );
  }

  if (event.event_type === 'assignment_change') {
    return (
      <li className="text-xs text-slate-500 italic">
        {event.author_name} alterou a atribuicao do chamado em {formatDate(event.created_at)}
      </li>
    );
  }

  return (
    <li className={`p-3 rounded-md border ${event.is_internal ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-slate-200'}`}>
      <div className="flex justify-between text-xs text-slate-500 mb-1">
        <span className="font-medium text-slate-700">
          {event.author_name}
          {event.is_internal && <span className="ml-2 text-yellow-700">(nota interna)</span>}
        </span>
        <span>{formatDate(event.created_at)}</span>
      </div>
      <p className="text-sm text-slate-800 whitespace-pre-wrap">{event.comment_body}</p>
    </li>
  );
}

export default function CommentThread({ events = [] }) {
  if (events.length === 0) {
    return <p className="text-sm text-slate-500">Nenhum evento registrado ainda.</p>;
  }

  return (
    <ul className="space-y-2">
      {events.map((event) => (
        <EventItem key={event.id} event={event} />
      ))}
    </ul>
  );
}
