import React, { useState } from 'react';
import Badge from '../../../shared/components/Badge';
import {
  TICKET_PRIORITIES,
  TICKET_STATUS
} from '../../../shared/constants/ticketStatus';

const formatDate = value =>
  new Date(value).toLocaleString('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

export default function TechnicianTicketCard({
  ticket,
  actionTicketId,
  onStartProcess,
  onAddProgressComment,
  onResolve,
  onClose
}) {
  const [comment, setComment] = useState('');
  const [validationError, setValidationError] = useState('');

  const isBusy = actionTicketId === ticket.id;
  const status = TICKET_STATUS[ticket.state];
  const priority = TICKET_PRIORITIES[ticket.priority];

  const canStartProcess =
    ticket.state === 'Assigned' || ticket.state === 'Reopened';

  const canAddProgressComment = ticket.state === 'OnProcess';

  const canClose = ticket.state === 'Resolved';

  const submitComment = async action => {
    if (!comment.trim()) {
      setValidationError('Escribe un comentario antes de continuar.');
      return;
    }

    try {
      setValidationError('');
      await action(ticket, comment);
      setComment('');
    } catch {
      // El hook ya muestra el mensaje recibido desde la API.
    }
  };

  return (
    <article className="technician-ticket-card">
      <header className="technician-ticket-header">
        <div>
          <h3>{ticket.title}</h3>
          <p className="muted">
            Creado: {formatDate(ticket.creationDate)}
          </p>
        </div>

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

          <Badge
            text={ticket.category}
            bgVar="--primary-light"
            textVar="--primary"
          />
        </div>
      </header>

      <p className="technician-ticket-description">
        {ticket.description}
      </p>

      <p className="technician-ticket-deadline">
        Vence: <strong>{formatDate(ticket.limitDateSLA)}</strong>
      </p>

      {ticket.comments.length > 0 && (
        <section className="technician-comments">
          <h4>Historial técnico</h4>

          {ticket.comments.map(ticketComment => (
            <div
              className={`technician-comment ${
                ticketComment.isResolution
                  ? 'technician-comment-resolution'
                  : ''
              }`}
              key={ticketComment.id}
            >
              <strong>
                {ticketComment.isResolution
                  ? 'Solución registrada'
                  : 'Comentario de avance'}
              </strong>

              <p>{ticketComment.content}</p>

              <small>{formatDate(ticketComment.createdAt)}</small>
            </div>
          ))}
        </section>
      )}

      {canStartProcess && (
        <button
          className="primary-button"
          disabled={isBusy}
          onClick={() => onStartProcess(ticket)}
        >
          {isBusy ? 'Actualizando...' : 'Iniciar proceso'}
        </button>
      )}

      {canAddProgressComment && (
        <section className="technician-action-section">
          <label>
            Comentario técnico
            <textarea
              value={comment}
              onChange={event => setComment(event.target.value)}
              maxLength="2000"
              rows="4"
              placeholder="Describe el avance realizado..."
            />
          </label>

          {validationError && (
            <p className="notice error">{validationError}</p>
          )}

          <div className="technician-action-buttons">
            <button
              className="secondary-button"
              disabled={isBusy}
              onClick={() =>
                submitComment(onAddProgressComment)
              }
            >
              Registrar avance
            </button>

            <button
              className="primary-button"
              disabled={isBusy}
              onClick={() => submitComment(onResolve)}
            >
              {isBusy ? 'Actualizando...' : 'Resolver ticket'}
            </button>
          </div>
        </section>
      )}

      {ticket.state === 'Expired' && (
        <section className="technician-action-section">
          <label>
            Comentario de resolución
            <textarea
              value={comment}
              onChange={event => setComment(event.target.value)}
              maxLength="2000"
              rows="4"
              placeholder="Explica la solución aplicada..."
            />
          </label>

          {validationError && (
            <p className="notice error">{validationError}</p>
          )}

          <button
            className="primary-button"
            disabled={isBusy}
            onClick={() => submitComment(onResolve)}
          >
            {isBusy ? 'Actualizando...' : 'Resolver ticket vencido'}
          </button>
        </section>
      )}

      {canClose && (
        <button
          className="primary-button"
          disabled={isBusy}
          onClick={() => onClose(ticket)}
        >
          {isBusy ? 'Cerrando...' : 'Cerrar ticket'}
        </button>
      )}
    </article>
  );
}