using Helpdesk.Domain.Entities;
using Helpdesk.Domain.Interfaces;
using Helpdesk.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Helpdesk.Infrastructure.Repositories;

public sealed class TechnicianRepository : ITechnicianRepository
{
    private readonly HelpdeskDbContext _context;

    public TechnicianRepository(HelpdeskDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(
        Technician technician,
        CancellationToken cancellationToken = default)
    {
        await _context.Technicians.AddAsync(technician, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<Technician?> GetByIdAsync(
        Guid technicianId,
        CancellationToken cancellationToken = default)
    {
        return await _context.Technicians
            .AsNoTracking()
            .Include(technician => technician.Specialties)
            .SingleOrDefaultAsync(
                technician => technician.Id == technicianId,
                cancellationToken);
    }

    public async Task<IReadOnlyList<Technician>> GetByCategoryAsync(
        string category,
        CancellationToken cancellationToken = default)
    {
        return await _context.Technicians
            .AsNoTracking()
            .Where(technician =>
                technician.IsActive &&
                technician.Specialties.Any(
                    specialty => specialty.Category == category))
            .OrderBy(technician => technician.FullName)
            .ToListAsync(cancellationToken);
    }
}