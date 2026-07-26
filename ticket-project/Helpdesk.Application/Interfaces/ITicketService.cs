using Helpdesk.Domain.Entities;

namespace Helpdesk.Application.Interfaces;

public interface ITicketService
{
    Task<IEnumerable<Ticket>> GetAllTicketsAsync();
    Task<Ticket> ReopenTicketAsync(Guid ticketId, string justification);
    Task<Ticket> AssignTicketAsync(Guid ticketId, int technicianId);
    Task<Ticket> UpdateTicketStatusAsync(Guid ticketId, TicketState newState, string? resolutionComment);
    Task<IEnumerable<Ticket>> GetTicketsByTechnicianAsync(int technicianId);
}
