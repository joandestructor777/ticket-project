using Helpdesk.Domain.Entities;
using Helpdesk.Domain.Enums;
using Helpdesk.Domain.Interfaces;
using Helpdesk.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Helpdesk.Infrastructure.Repositories;

public sealed class TicketRepository : ITicketRepository
{
    private readonly HelpdeskDbContext _context;
    public TicketRepository(HelpdeskDbContext context) => _context = context;

    public async Task AddAsync(Ticket ticket, CancellationToken cancellationToken = default)
    {
        await _context.Tickets.AddAsync(ticket, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Ticket>> GetAllAsync(CancellationToken cancellationToken = default) =>
        await _context.Tickets.AsNoTracking().OrderByDescending(ticket => ticket.CreationDate).ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<Ticket>> GetByClientIdAsync(string clientId, CancellationToken cancellationToken = default) =>
        await _context.Tickets.AsNoTracking().Where(ticket => ticket.CreatedByClientId == clientId)
            .OrderByDescending(ticket => ticket.CreationDate).ToListAsync(cancellationToken);

    public async Task<Ticket?> GetByIdAsync(
    Guid ticketId,
    CancellationToken cancellationToken = default) =>
    await _context.Tickets
        .Include(ticket => ticket.Comments)
        .SingleOrDefaultAsync(
            ticket => ticket.Id == ticketId,
            cancellationToken);

    public async Task<IReadOnlyList<Ticket>> GetOpenTicketsAsync(CancellationToken cancellationToken = default) =>
        await _context.Tickets.AsNoTracking().Where(ticket => ticket.State == TicketState.Opened)
            .OrderBy(ticket => ticket.CreationDate).ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<Ticket>> GetByTechnicianIdAsync(
    Guid technicianId,
    CancellationToken cancellationToken = default) =>
    await _context.Tickets
        .AsNoTracking()
        .Include(ticket => ticket.Comments)
        .Where(ticket => ticket.AssignedTechnicianId == technicianId)
        .OrderByDescending(ticket => ticket.CreationDate)
        .ToListAsync(cancellationToken);

    public async Task<int> CountActiveTicketsByTechnicianIdAsync(Guid technicianId, CancellationToken cancellationToken = default)
    {
        var activeStates = new[] { TicketState.Assigned, TicketState.OnProcess, TicketState.Reopened, TicketState.Expired };
        return await _context.Tickets.CountAsync(ticket => ticket.AssignedTechnicianId == technicianId && activeStates.Contains(ticket.State), cancellationToken);
    }

    public async Task<IEnumerable<Ticket>> GetActiveTicketsWithExpiredSlaAsync(DateTime actualTime)
    {
        var monitoredStates = new[] { TicketState.Opened, TicketState.Assigned, TicketState.OnProcess, TicketState.Reopened };
        return await _context.Tickets.Where(ticket => monitoredStates.Contains(ticket.State) && ticket.LimitDateSLA < actualTime).ToListAsync();
    }

    public async Task<IEnumerable<Ticket>> GetResolvedTicketsPastGracePeriodAsync(DateTime limitTime) =>
        await _context.Tickets.Where(ticket => ticket.State == TicketState.Resolved && ticket.ResolutionDate != null && ticket.ResolutionDate < limitTime).ToListAsync();

    public async Task<string?> GetSystemSettingAsync(string key, CancellationToken cancellationToken = default) =>
        await _context.SystemSettings.Where(setting => setting.Key == key).Select(setting => setting.Value).SingleOrDefaultAsync(cancellationToken);

    public async Task UpdateAsync(
    Ticket ticket,
    CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}
