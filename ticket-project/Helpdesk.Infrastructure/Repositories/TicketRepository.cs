using Helpdesk.Domain.Entities;
using Helpdesk.Domain.Enums;
using Helpdesk.Domain.Interfaces;
using Helpdesk.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Helpdesk.Infrastructure.Repositories;

public class TicketRepository : ITicketRepository
{
    private readonly HelpdeskDbContext _context;

    public TicketRepository(HelpdeskDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Ticket>> GetActiveTicketsWithExpiredSlaAsync(DateTime actualTime)
    {
        var monitorizedStates = new[]
        {
            TicketState.Opened,
            TicketState.Assigned,
            TicketState.OnProcess,
            TicketState.Reopened
        };

        return await _context.Tickets
            .Where(t => monitorizedStates.Contains(t.State)
                        && t.LimitDateSLA < actualTime)
            .ToListAsync();
    }

    public async Task AddAsync(Ticket ticket, CancellationToken cancellationToken = default)
    {
        await _context.Tickets.AddAsync(ticket, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Ticket>> GetByClientIdAsync(string clientId, CancellationToken cancellationToken = default)
    {
        return await _context.Tickets
            .AsNoTracking()
            .Where(ticket => ticket.CreatedByClientId == clientId)
            .OrderByDescending(ticket => ticket.CreationDate)
            .ToListAsync(cancellationToken);
    }

    public async Task UpdateAsync(Ticket ticket)
    {
        _context.Tickets.Update(ticket);
        await _context.SaveChangesAsync();
    }
}
