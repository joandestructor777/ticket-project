using Helpdesk.Domain.Entities;

namespace Helpdesk.Domain.Interfaces;

public interface ITechnicianRepository
{
    Task AddAsync(
        Technician technician,
        CancellationToken cancellationToken = default);

    Task<Technician?> GetByIdAsync(
        Guid technicianId,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Technician>> GetByCategoryAsync(
        string category,
        CancellationToken cancellationToken = default);
}