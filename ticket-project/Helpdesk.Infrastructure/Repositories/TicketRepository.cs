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

    public async Task<Ticket?> GetByIdAsync(Guid id)
    {
        return await _context.Tickets.FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<IEnumerable<Ticket>> GetAllAsync()
    {
        return await _context.Tickets.ToListAsync();
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

    public async Task<IEnumerable<Ticket>> GetResolvedTicketsPastGracePeriodAsync(DateTime limitTime)
    {
        return await _context.Tickets
            .Where(t => t.State == TicketState.Resolved 
                        && t.ResolutionDate.HasValue 
                        && t.ResolutionDate.Value < limitTime)
            .ToListAsync();
    }

    public async Task<string?> GetSystemSettingAsync(string key)
    {
        var setting = await _context.SystemSettings.FirstOrDefaultAsync(s => s.Key == key);
        return setting?.Value;
    }

    public async Task UpdateAsync(Ticket ticket)
    {
        _context.Tickets.Update(ticket);
        await _context.SaveChangesAsync();
    }

    public async Task<Technician?> GetTechnicianByIdAsync(int id)
    {
        return await _context.Technicians.FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<IEnumerable<Ticket>> GetTicketsByTechnicianIdAsync(int technicianId)
    {
        return await _context.Tickets
            .Where(t => t.TechnicianId == technicianId)
            .ToListAsync();
    }

    public async Task<int> GetOpenTicketsCountByTechnicianAsync(int technicianId)
    {
        var activeStates = new[] { TicketState.Opened, TicketState.Assigned, TicketState.OnProcess, TicketState.Reopened };
        return await _context.Tickets
            .CountAsync(t => t.TechnicianId == technicianId && activeStates.Contains(t.State));
    }
}
