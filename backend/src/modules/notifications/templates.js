function ticketCreated(ticket) {
  return {
    subject: `[Chamado #${ticket.id}] Aberto: ${ticket.title}`,
    html: `<p>O chamado <strong>#${ticket.id} - ${ticket.title}</strong> foi aberto.</p>`,
  };
}

function newComment(ticket, authorName) {
  return {
    subject: `[Chamado #${ticket.id}] Novo comentario`,
    html: `<p><strong>${authorName}</strong> comentou no chamado <strong>#${ticket.id} - ${ticket.title}</strong>.</p>`,
  };
}

function statusChanged(ticket, oldStatus, newStatus) {
  return {
    subject: `[Chamado #${ticket.id}] Status alterado para ${newStatus}`,
    html: `<p>O status do chamado <strong>#${ticket.id} - ${ticket.title}</strong> mudou de "${oldStatus}" para "${newStatus}".</p>`,
  };
}

function assigned(ticket) {
  return {
    subject: `[Chamado #${ticket.id}] Atribuido a voce`,
    html: `<p>O chamado <strong>#${ticket.id} - ${ticket.title}</strong> foi atribuido a voce.</p>`,
  };
}

module.exports = { ticketCreated, newComment, statusChanged, assigned };
