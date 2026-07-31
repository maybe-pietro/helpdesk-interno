import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useTicket,
  useTicketEvents,
  useChangeTicketStatus,
  useAssignTicket,
  useAddComment,
  useUploadAttachment,
} from '../hooks/useTickets';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import StatusBadge, { STATUS_LABELS } from '../components/tickets/StatusBadge';
import PriorityBadge from '../components/tickets/PriorityBadge';
import CommentThread from '../components/tickets/CommentThread';
import AttachmentList from '../components/tickets/AttachmentList';
import FileUploader from '../components/tickets/FileUploader';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';
import Textarea from '../components/ui/Textarea';
import { LoadingBlock } from '../components/ui/Spinner';

const STATUS_TRANSITIONS = {
  aberto: ['em_andamento'],
  em_andamento: ['aguardando_solicitante', 'resolvido'],
  aguardando_solicitante: ['em_andamento', 'resolvido'],
  resolvido: ['fechado', 'em_andamento'],
  fechado: ['em_andamento'],
};

export default function TicketDetailPage() {
  const { id } = useParams();
  const ticketId = Number(id);
  const { user } = useAuth();
  const toast = useToast();

  const { data: ticket, isLoading } = useTicket(ticketId);
  const { data: events } = useTicketEvents(ticketId);
  const changeStatus = useChangeTicketStatus(ticketId);
  const assignTicket = useAssignTicket(ticketId);
  const addComment = useAddComment(ticketId);
  const uploadAttachment = useUploadAttachment(ticketId);

  const canManage = user?.role === 'agente' || user?.role === 'admin';
  const { data: agents } = useUsers({ role: 'agente' }, { enabled: canManage });

  const [commentBody, setCommentBody] = useState('');
  const [isInternal, setIsInternal] = useState(false);

  if (isLoading || !ticket) {
    return <LoadingBlock label="Carregando chamado..." />;
  }

  const allowedTransitions = STATUS_TRANSITIONS[ticket.status] || [];

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentBody.trim()) return;
    await addComment.mutateAsync({ body: commentBody, isInternal });
    setCommentBody('');
    setIsInternal(false);
    toast.success('Comentario adicionado.');
  };

  const handleChangeStatus = (status) => {
    changeStatus.mutate(status, {
      onSuccess: () => toast.success(`Status alterado para "${STATUS_LABELS[status]}".`),
    });
  };

  const handleAssign = (agentId) => {
    assignTicket.mutate(agentId, {
      onSuccess: () => toast.success('Chamado atribuido com sucesso.'),
    });
  };

  const handleUpload = (file) => {
    uploadAttachment.mutate(file, {
      onSuccess: () => toast.success('Anexo enviado.'),
    });
  };

  return (
    <div className="max-w-3xl space-y-6">
      <Card className="space-y-3">
        <div className="flex items-start justify-between">
          <h1 className="text-lg font-semibold text-slate-800">{ticket.title}</h1>
          <div className="flex gap-2">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>
        </div>
        <p className="text-sm text-slate-700 whitespace-pre-wrap">{ticket.description}</p>
        <div className="text-xs text-slate-500 grid grid-cols-2 gap-1">
          <span>Departamento: {ticket.department_name}</span>
          <span>Categoria: {ticket.category_name}</span>
          <span>Solicitante: {ticket.requester_name}</span>
          <span>Agente: {ticket.assigned_agent_name || 'Nao atribuido'}</span>
        </div>

        {canManage && (
          <div className="flex flex-wrap gap-3 pt-3 border-t border-slate-100">
            {allowedTransitions.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Mudar status:</span>
                {allowedTransitions.map((status) => (
                  <Button
                    key={status}
                    type="button"
                    variant="secondary"
                    disabled={changeStatus.isPending}
                    onClick={() => handleChangeStatus(status)}
                  >
                    {STATUS_LABELS[status]}
                  </Button>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Atribuir a:</span>
              <Select
                className="w-auto py-1"
                value={ticket.assigned_agent_id || ''}
                onChange={(e) => e.target.value && handleAssign(Number(e.target.value))}
              >
                <option value="">-</option>
                {agents?.map((agent) => (
                  <option key={agent.id} value={agent.id}>{agent.name}</option>
                ))}
              </Select>
            </div>
          </div>
        )}
      </Card>

      <Card className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-700">Anexos</h2>
        <AttachmentList attachments={ticket.attachments} />
        <FileUploader isUploading={uploadAttachment.isPending} onUpload={handleUpload} />
      </Card>

      <Card className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-700">Historico</h2>
        <CommentThread events={events} />

        <form onSubmit={handleSubmitComment} className="space-y-2 pt-3 border-t border-slate-100">
          <Textarea
            rows={3}
            placeholder="Escreva um comentario..."
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
          />
          <div className="flex items-center justify-between">
            {canManage && (
              <label className="flex items-center gap-1 text-xs text-slate-600">
                <input type="checkbox" checked={isInternal} onChange={(e) => setIsInternal(e.target.checked)} />
                Nota interna (visivel apenas para agentes/admin)
              </label>
            )}
            <Button type="submit" disabled={addComment.isPending || !commentBody.trim()}>
              Comentar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
