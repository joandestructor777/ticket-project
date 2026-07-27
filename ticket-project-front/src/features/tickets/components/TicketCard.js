import React, { useState } from 'react';
import { ticketService } from '../services/ticketService';
import Badge from '../../../shared/components/Badge';
import { TICKET_PRIORITIES, TICKET_STATUS } from '../../../shared/constants/ticketStatus';

const formatDate = (value) =>
  new Date(value).toLocaleString('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

export default function TicketCard({ ticket, onReopened, allowReopen = false }) {
  const [isReopening, setIsReopening] = useState(false);
  const [justification, setJustification] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const status = TICKET_STATUS[ticket.state];
  const priority = TICKET_PRIORITIES[ticket.priority];
  const canReopen = allowReopen && ticket.state === 'Resolved';

  const handleReopen = async (event) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError('');

      await ticketService.reopenTicket(ticket.id, justification);
      setIsReopening(false);
      setJustification('');
      await onReopened();
    } catch (exception) {
      setError(exception.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article className="client-ticket">
      <div className="ticket-heading">
        <h3>{ticket.title}</h3>
        <time>{formatDate(ticket.creationDate)}</time>
      </div>

      <p>{ticket.description}</p>

      <div className="ticket-badges">
        <Badge
          text={status?.label || ticket.state}
          bgVar={status?.bgVar}
          textVar={status?.textVar}
          icon={status?.icon}
        />
        <Badge
          text={`Prioridad: ${priority?.label || ticket.priority}`}
          bgVar={priority?.bgVar}
          textVar={priority?.textVar}
        />
        <Badge text={ticket.category} bgVar="--primary-light" textVar="--primary" />
      </div>

      <small>
        Vence: <strong>{formatDate(ticket.limitDateSla)}</strong>
      </small>

      {canReopen && !isReopening && (
        <button
          className="secondary-button reopen-ticket-button"
          onClick={() => setIsReopening(true)}
          type="button"
        >
          Reabrir ticket
        </button>
      )}

      {isReopening && (
        <form className="reopen-ticket-form" onSubmit={handleReopen}>
          <label>
            Justificación de reapertura
            <textarea
              value={justification}
              onChange={(event) => setJustification(event.target.value)}
              placeholder="Explica por qué la solución no resolvió el incidente."
              maxLength="2000"
              required
              rows="3"
            />
          </label>

          <div className="reopen-ticket-actions">
            <button className="primary-button" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Reabriendo...' : 'Confirmar reapertura'}
            </button>
            <button
              className="secondary-button"
              disabled={isSubmitting}
              onClick={() => setIsReopening(false)}
              type="button"
            >
              Cancelar
            </button>
          </div>

          {error && <p className="notice error">{error}</p>}
        </form>
      )}
    </article>
  );
}
