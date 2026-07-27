import { useCallback, useEffect, useState } from 'react';
import { technicianTicketService } from '../services/technicianTicketService';

export function useTechnicianTickets(technicianId) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionTicketId, setActionTicketId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadTickets = useCallback(async () => {
    if (!technicianId) {
      setTickets([]);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const result = await technicianTicketService.getAssignedTickets(
        technicianId
      );

      setTickets(result);
    } catch (exception) {
      setError(exception.message);
    } finally {
      setLoading(false);
    }
  }, [technicianId]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const executeAction = async (ticketId, operation, successMessage) => {
    try {
      setActionTicketId(ticketId);
      setError('');
      setSuccess('');

      const updatedTicket = await operation();

      setTickets(currentTickets =>
        currentTickets.map(ticket =>
          ticket.id === updatedTicket.id ? updatedTicket : ticket
        )
      );

      setSuccess(successMessage);
      return updatedTicket;
    } catch (exception) {
      setError(exception.message);
      throw exception;
    } finally {
      setActionTicketId('');
    }
  };

  const startProcess = ticket =>
    executeAction(
      ticket.id,
      () =>
        technicianTicketService.startProcess(
          technicianId,
          ticket.id,
          ticket.rowVersion
        ),
      'El ticket ahora está En Proceso de atención.'
    );

  const addProgressComment = (ticket, content) =>
    executeAction(
      ticket.id,
      () =>
        technicianTicketService.addProgressComment(
          technicianId,
          ticket.id,
          content,
          ticket.rowVersion
        ),
      'El comentario de avance fue registrado correctamente.'
    );

  const resolve = (ticket, content) =>
    executeAction(
      ticket.id,
      () =>
        technicianTicketService.resolve(
          technicianId,
          ticket.id,
          content,
          ticket.rowVersion
        ),
      'El ticket fue resuelto correctamente.'
    );

  const close = ticket =>
    executeAction(
      ticket.id,
      () =>
        technicianTicketService.close(
          technicianId,
          ticket.id,
          ticket.rowVersion
        ),
      'El ticket ha sido cerrado correctamente.'
    );

  return {
    tickets,
    loading,
    actionTicketId,
    error,
    success,
    loadTickets,
    startProcess,
    addProgressComment,
    resolve,
    close
  };
}