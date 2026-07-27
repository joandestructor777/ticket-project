import React, { useState } from 'react';
import { ticketService } from '../services/ticketService';

const formatDate = value => value
  ? new Date(value).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })
  : 'Sin fecha';

export default function TicketCard({ ticket }) {
  const [isReopening, setIsReopening] = useState(false);
  const [justification, setJustification] = useState('');
  const [error, setError] = useState('');
  const canReopen = ticket.state === 'Resolved' && ticket.resolutionDate &&
    Date.now() <= new Date(ticket.resolutionDate).getTime() + 48 * 60 * 60 * 1000;

  const reopen = async () => {
    try {
      setError('');
      await ticketService.reopenTicket(ticket.id, justification);
      window.location.reload();
    } catch (exception) {
      setError(exception.message);
    }
  };

  return (
    <article className="ticket-card">
      <h3>{ticket.title}</h3>
      <p>{ticket.description}</p>
      <p><strong>Estado:</strong> {ticket.state}</p>
      <p><strong>Prioridad:</strong> {ticket.priority} · <strong>Categoría:</strong> {ticket.category}</p>
      <small>Creado: {formatDate(ticket.creationDate)} · Límite SLA: {formatDate(ticket.limitDateSLA)}</small>
      {ticket.state === 'Expired' && <p className="notice error">SLA vencido.</p>}
      {canReopen && !isReopening && <button className="secondary-button" onClick={() => setIsReopening(true)}>Reabrir ticket</button>}
      {isReopening && <div><textarea value={justification} onChange={event => setJustification(event.target.value)} placeholder="Justificación de reapertura" /><button className="primary-button" onClick={reopen}>Confirmar reapertura</button>{error && <p className="notice error">{error}</p>}</div>}
    </article>
  );
}
