using Helpdesk.API.Contracts;
using Helpdesk.Application.Interfaces;
using Helpdesk.Application.Models;
using Microsoft.AspNetCore.Mvc;

namespace Helpdesk.API.Controllers;

[ApiController]
[Route("api/client/tickets")]
public sealed class ClientTicketsController : ControllerBase
{
    private const string ClientIdHeader = "X-Client-Id";
    private readonly IClientTicketService _tickets;

    public ClientTicketsController(IClientTicketService tickets) => _tickets = tickets;

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ClientTicketResult>>> GetMine(
        [FromHeader(Name = ClientIdHeader)] string? clientId,
        CancellationToken cancellationToken)
    {
        if (!IsValidClientId(clientId))
            return BadRequest(new { message = $"El encabezado {ClientIdHeader} es obligatorio y debe tener máximo 100 caracteres." });

        return Ok(await _tickets.GetMineAsync(clientId!.Trim(), cancellationToken));
    }

    [HttpPost]
    public async Task<ActionResult<CreatedTicketResult>> Create(
        [FromHeader(Name = ClientIdHeader)] string? clientId,
        CreateTicketRequest request,
        CancellationToken cancellationToken)
    {
        if (!IsValidClientId(clientId))
            return BadRequest(new { message = $"El encabezado {ClientIdHeader} es obligatorio y debe tener máximo 100 caracteres." });

        try
        {
            var result = await _tickets.CreateAsync(clientId!.Trim(),
                new CreateClientTicketCommand(request.Title, request.Description, request.Category, request.Priority), cancellationToken);
            return CreatedAtAction(nameof(GetMine), new { id = result.Id }, result);
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new { message = exception.Message });
        }
    }

    private static bool IsValidClientId(string? clientId) =>
        !string.IsNullOrWhiteSpace(clientId) && clientId.Length <= 100;
}
