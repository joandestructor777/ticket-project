using Helpdesk.Application.Models;

namespace Helpdesk.Application.Interfaces;

public interface IClientTicketService
{
    Task<CreatedTicketResult> CreateAsync(string clientId, CreateClientTicketCommand command, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<ClientTicketResult>> GetMineAsync(string clientId, CancellationToken cancellationToken = default);
}
