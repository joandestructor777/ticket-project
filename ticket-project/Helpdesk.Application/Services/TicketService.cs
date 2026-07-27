using Helpdesk.Application.Interfaces;
using Helpdesk.Domain.Entities;
using Helpdesk.Domain.Enums;
using Helpdesk.Domain.Interfaces;

namespace Helpdesk.Application.Services;

public sealed class TicketService : ITicketService
{
    private readonly ITicketRepository _ticketRepository;
    private readonly ISystemSettingRepository _systemSettingRepository;

    public TicketService(
        ITicketRepository ticketRepository,
        ISystemSettingRepository systemSettingRepository)
    {
        _ticketRepository = ticketRepository;
        _systemSettingRepository = systemSettingRepository;
    }

    public Task<IReadOnlyList<Ticket>> GetAllTicketsAsync(CancellationToken cancellationToken = default) =>
        _ticketRepository.GetAllAsync(cancellationToken);

    public async Task<Ticket> ReopenTicketAsync(Guid ticketId, string justification, CancellationToken cancellationToken = default)
    {
        var ticket = await GetTicketAsync(ticketId, cancellationToken);

        if (ticket.State != TicketState.Resolved)
            throw new InvalidOperationException("Solo se pueden reabrir tickets resueltos.");

        var gracePeriodHours = await GetGracePeriodHoursAsync(cancellationToken);
        if (ticket.ResolutionDate is null || DateTime.UtcNow > ticket.ResolutionDate.Value.AddHours(gracePeriodHours))
        {
            ticket.CloseAfterGracePeriod();
            await _ticketRepository.UpdateAsync(ticket);
            throw new InvalidOperationException("El plazo de gracia expiró; el ticket fue cerrado definitivamente.");
        }

        ticket.Reopen(justification);

        await _ticketRepository.UpdateAsync(ticket);
        return ticket;
    }

    private async Task<Ticket> GetTicketAsync(Guid ticketId, CancellationToken cancellationToken) =>
        await _ticketRepository.GetByIdAsync(ticketId, cancellationToken)
        ?? throw new KeyNotFoundException("El ticket no existe.");

    private async Task<int> GetGracePeriodHoursAsync(CancellationToken cancellationToken)
    {
        var setting = await _systemSettingRepository.GetByKeyAsync(
            "GracePeriodHours",
            cancellationToken);

        return int.TryParse(setting?.Value, out var hours) && hours > 0
            ? hours
            : 48;
    }
}
