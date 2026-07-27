using Helpdesk.Application.Interfaces;
using Helpdesk.Domain.Entities;
using Helpdesk.Domain.Enums;
using Helpdesk.Domain.Interfaces;

namespace Helpdesk.Application.Services;

public sealed class TicketService : ITicketService
{
    private readonly ITicketRepository _ticketRepository;

    public TicketService(ITicketRepository ticketRepository) => _ticketRepository = ticketRepository;

    public Task<IReadOnlyList<Ticket>> GetAllTicketsAsync(CancellationToken cancellationToken = default) =>
        _ticketRepository.GetAllAsync(cancellationToken);

    public async Task<Ticket> ReopenTicketAsync(Guid ticketId, string justification, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(justification))
            throw new ArgumentException("La justificación de reapertura es obligatoria.");

        var ticket = await GetTicketAsync(ticketId, cancellationToken);
        if (ticket.State != TicketState.Resolved)
            throw new InvalidOperationException("Solo se pueden reabrir tickets resueltos.");

        var gracePeriodHours = await GetGracePeriodHoursAsync(cancellationToken);
        if (ticket.ResolutionDate is null || DateTime.UtcNow > ticket.ResolutionDate.Value.AddHours(gracePeriodHours))
        {
            ticket.State = TicketState.Closed;
            await _ticketRepository.UpdateAsync(ticket);
            throw new InvalidOperationException("El plazo de gracia expiró; el ticket fue cerrado definitivamente.");
        }

        ticket.State = TicketState.Reopened;
        ticket.ReopenJustification = justification.Trim();
        ticket.ResolutionDate = null;

        await _ticketRepository.UpdateAsync(ticket);
        return ticket;
    }

    private async Task<Ticket> GetTicketAsync(Guid ticketId, CancellationToken cancellationToken) =>
        await _ticketRepository.GetByIdAsync(ticketId, cancellationToken)
        ?? throw new KeyNotFoundException("El ticket no existe.");

    private async Task<int> GetGracePeriodHoursAsync(CancellationToken cancellationToken)
    {
        var configuredValue = await _ticketRepository.GetSystemSettingAsync("GracePeriodHours", cancellationToken);
        return int.TryParse(configuredValue, out var hours) && hours > 0 ? hours : 48;
    }
}
