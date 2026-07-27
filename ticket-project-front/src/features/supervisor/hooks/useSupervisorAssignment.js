import { useCallback, useEffect, useMemo, useState } from 'react';
import { supervisorAssignmentService } from '../services/supervisorAssignmentService';

export function useSupervisorAssignment() {
  const [tickets, setTickets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState('');
  const [selectedTechnicianId, setSelectedTechnicianId] = useState('');
  const [isForceAssignmentMode, setIsForceAssignmentMode] = useState(false);

  const [loadingTickets, setLoadingTickets] = useState(true);
  const [loadingTechnicians, setLoadingTechnicians] = useState(false);
  const [assigning, setAssigning] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const selectedTicket = useMemo(
    () => tickets.find(ticket => ticket.id === selectedTicketId) || null,
    [tickets, selectedTicketId]
  );

  const loadTickets = useCallback(async () => {
    try {
      setLoadingTickets(true);
      setError('');
      setTickets(await supervisorAssignmentService.getOpenTickets());
    } catch (exception) {
      setError(exception.message);
    } finally {
      setLoadingTickets(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const loadTechnicians = async (category, includeAtCapacity = false) => {
    try {
      setLoadingTechnicians(true);
      setError('');
      setSelectedTechnicianId('');

      const availableTechnicians =
        await supervisorAssignmentService.getAvailableTechnicians(
          category,
          includeAtCapacity
        );

      setTechnicians(availableTechnicians);
      setIsForceAssignmentMode(includeAtCapacity);
    } catch (exception) {
      setError(exception.message);
    } finally {
      setLoadingTechnicians(false);
    }
  };

  const selectTicket = async (ticket) => {
    setSelectedTicketId(ticket.id);
    setTechnicians([]);
    setSuccess('');
    await loadTechnicians(ticket.category);
  };

  const showTechniciansAtCapacity = async () => {
    if (selectedTicket) {
      await loadTechnicians(selectedTicket.category, true);
    }
  };

  const assignSelectedTicket = async (forceAssignment = false) => {
    if (!selectedTicket) {
      setError('Selecciona un ticket antes de asignar.');
      return;
    }

    if (!selectedTechnicianId) {
      setError('Selecciona un técnico antes de asignar.');
      return;
    }

    try {
      setAssigning(true);
      setError('');
      setSuccess('');

      await supervisorAssignmentService.assignTicket(
        selectedTicket.id,
        selectedTechnicianId,
        forceAssignment
      );

      setSuccess('El ticket ha sido asignado correctamente.');
      setSelectedTicketId('');
      setSelectedTechnicianId('');
      setIsForceAssignmentMode(false);
      setTechnicians([]);

      await loadTickets();
    } catch (exception) {
      setError(exception.message);
    } finally {
      setAssigning(false);
    }
  };

  return {
    tickets,
    technicians,
    selectedTicket,
    selectedTechnicianId,
    setSelectedTechnicianId,
    isForceAssignmentMode,
    showTechniciansAtCapacity,
    loadingTickets,
    loadingTechnicians,
    assigning,
    error,
    success,
    selectTicket,
    assignSelectedTicket,
    refresh: loadTickets
  };
}
