const API_URL = 'http://localhost:5168/api/tickets';

export const ticketService = {
  getTickets: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error al obtener los tickets');
      return await response.json();
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw error;
    }
  },

  reopenTicket: async (ticketId, justification) => {
    try {
      const response = await fetch(`${API_URL}/${ticketId}/reopen`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ justification })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al reabrir el ticket');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error reopening ticket:', error);
      throw error;
    }
  },

  getTicketsByTechnician: async (technicianId) => {
    const response = await fetch(`${API_URL}/technician/${technicianId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch technician tickets');
    }
    return await response.json();
  },

  assignTicket: async (ticketId, technicianId) => {
    const response = await fetch(`${API_URL}/${ticketId}/assign/${technicianId}`, {
      method: 'PUT'
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Error al asignar el ticket');
    }
    return await response.json();
  },

  updateTicketStatus: async (ticketId, stateCode, resolutionComment) => {
    const response = await fetch(`${API_URL}/${ticketId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ state: stateCode, resolutionComment })
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Error al actualizar el ticket');
    }
    return await response.json();
  }
};
