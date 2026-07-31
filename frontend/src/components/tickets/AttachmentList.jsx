import { downloadAttachment } from '../../api/ticketsApi';

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AttachmentList({ attachments = [] }) {
  if (attachments.length === 0) {
    return <p className="text-sm text-slate-500">Nenhum anexo.</p>;
  }

  return (
    <ul className="space-y-1">
      {attachments.map((attachment) => (
        <li key={attachment.id} className="text-sm flex items-center justify-between">
          <button
            type="button"
            className="text-slate-700 hover:underline text-left"
            onClick={() => downloadAttachment(attachment.id, attachment.original_name)}
          >
            {attachment.original_name}
          </button>
          <span className="text-xs text-slate-400">{formatSize(attachment.size_bytes)}</span>
        </li>
      ))}
    </ul>
  );
}
