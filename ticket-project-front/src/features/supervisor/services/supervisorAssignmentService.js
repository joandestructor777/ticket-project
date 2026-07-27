const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5168';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      payload?.message ||
      'No fue posible comunicarse con el servicio del supervisor.'
    );
  }

  return payload;
}

export const supervisorAssignmentService = {
  getOpenTickets: () =>
    request('/api/supervisor/tickets/open'),

    getAvailableTechnicians: (
    category,
    includeAtCapacityTechnicians = false
    ) =>
    request(
        `/api/supervisor/technicians/available?category=${encodeURIComponent(
        category
        )}&includeAtCapacityTechnicians=${includeAtCapacityTechnicians}`
    ),

  assignTicket: (ticketId, technicianId, forceAssignment = false) =>
    request(`/api/supervisor/tickets/${ticketId}/assignment`, {
      method: 'POST',
      body: JSON.stringify({
        technicianId,
        forceAssignment
      })
    }),

  createTechnician: (technician) =>
    request('/api/supervisor/technicians', {
      method: 'POST',
      body: JSON.stringify(technician)
    })
};