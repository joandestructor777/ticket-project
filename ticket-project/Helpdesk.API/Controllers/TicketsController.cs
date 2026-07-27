using Helpdesk.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Helpdesk.API.Controllers;

[ApiController]
[Route("api/tickets")]
public sealed class TicketsController : ControllerBase
{
    private readonly ITicketService _ticketService;

    public TicketsController(ITicketService ticketService)
    {
        _ticketService = ticketService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        CancellationToken cancellationToken) =>
        Ok(await _ticketService.GetAllTicketsAsync(cancellationToken));

    [HttpPost("{ticketId:guid}/reopen")]
    public async Task<IActionResult> Reopen(
        Guid ticketId,
        [FromBody] ReopenTicketRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            return Ok(await _ticketService.ReopenTicketAsync(
                ticketId,
                request.Justification,
                cancellationToken));
        }
        catch (KeyNotFoundException exception)
        {
            return NotFound(new
            {
                message = exception.Message
            });
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new
            {
                message = exception.Message
            });
        }
        catch (InvalidOperationException exception)
        {
            return Conflict(new
            {
                message = exception.Message
            });
        }
    }
}

public sealed record ReopenTicketRequest(string Justification);