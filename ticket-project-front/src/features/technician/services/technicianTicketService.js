const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5168';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || 'No fue posible completar la operación.');
  }

  return data;
}

export const technicianTicketService = {
  getAssignedTickets: technicianId =>
    request(`/api/technicians/${technicianId}/tickets`),

  startProcess: (technicianId, ticketId, rowVersion) =>
    request(`/api/technicians/${technicianId}/tickets/${ticketId}/start`, {
      method: 'PUT',
      body: JSON.stringify({ rowVersion })
    }),

  addProgressComment: (technicianId, ticketId, content, rowVersion) =>
    request(`/api/technicians/${technicianId}/tickets/${ticketId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, rowVersion })
    }),

  resolve: (technicianId, ticketId, content, rowVersion) =>
    request(`/api/technicians/${technicianId}/tickets/${ticketId}/resolve`, {
      method: 'PUT',
      body: JSON.stringify({ content, rowVersion })
    }),

  close: (technicianId, ticketId, rowVersion) =>
    request(`/api/technicians/${technicianId}/tickets/${ticketId}/close`, {
      method: 'PUT',
      body: JSON.stringify({ rowVersion })
    })
};