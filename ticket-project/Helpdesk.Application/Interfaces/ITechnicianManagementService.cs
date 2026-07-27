using Helpdesk.Application.Models;

namespace Helpdesk.Application.Interfaces;

public interface ITechnicianManagementService
{
    Task<TechnicianResult> CreateAsync(
        CreateTechnicianCommand command,
        CancellationToken cancellationToken = default);
}