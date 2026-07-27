using Helpdesk.API.Contracts;
using Helpdesk.Application.Interfaces;
using Helpdesk.Application.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Helpdesk.API.Controllers;

[ApiController]
[Route("api/technicians/{technicianId:guid}/tickets")]
public sealed class TechnicianTicketsController : ControllerBase
{
    private readonly ITechnicianTicketService _technicianTicketService;

    public TechnicianTicketsController(
        ITechnicianTicketService technicianTicketService)
    {
        _technicianTicketService = technicianTicketService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAssignedTickets(
        Guid technicianId,
        CancellationToken cancellationToken)
    {
        var tickets = await _technicianTicketService.GetAssignedTicketsAsync(
            technicianId,
            cancellationToken);

        return Ok(tickets);
    }

    [HttpPut("{ticketId:guid}/start")]
    public Task<IActionResult> StartProcess(
        Guid technicianId,
        Guid ticketId,
        [FromBody] TicketActionRequest request,
        CancellationToken cancellationToken) =>
        ExecuteAsync(() => _technicianTicketService.StartProcessAsync(
            ticketId,
            new TechnicianTicketActionCommand(
                technicianId,
                request.RowVersion),
            cancellationToken));

    [HttpPost("{ticketId:guid}/comments")]
    public Task<IActionResult> AddProgressComment(
        Guid technicianId,
        Guid ticketId,
        [FromBody] RegisterTicketCommentRequest request,
        CancellationToken cancellationToken) =>
        ExecuteAsync(() => _technicianTicketService.AddProgressCommentAsync(
            ticketId,
            new RegisterTechnicianCommentCommand(
                technicianId,
                request.Content,
                request.RowVersion),
            cancellationToken));

    [HttpPut("{ticketId:guid}/resolve")]
    public Task<IActionResult> Resolve(
        Guid technicianId,
        Guid ticketId,
        [FromBody] RegisterTicketCommentRequest request,
        CancellationToken cancellationToken) =>
        ExecuteAsync(() => _technicianTicketService.ResolveAsync(
            ticketId,
            new RegisterTechnicianCommentCommand(
                technicianId,
                request.Content,
                request.RowVersion),
            cancellationToken));

    [HttpPut("{ticketId:guid}/close")]
    public Task<IActionResult> Close(
        Guid technicianId,
        Guid ticketId,
        [FromBody] TicketActionRequest request,
        CancellationToken cancellationToken) =>
        ExecuteAsync(() => _technicianTicketService.CloseAsync(
            ticketId,
            new TechnicianTicketActionCommand(
                technicianId,
                request.RowVersion),
            cancellationToken));

    private static async Task<IActionResult> ExecuteAsync(
        Func<Task<TechnicianTicketResult>> operation)
    {
        try
        {
            return new OkObjectResult(await operation());
        }
        catch (KeyNotFoundException exception)
        {
            return new NotFoundObjectResult(new
            {
                message = exception.Message
            });
        }
        catch (ArgumentException exception)
        {
            return new BadRequestObjectResult(new
            {
                message = exception.Message
            });
        }
        catch (UnauthorizedAccessException exception)
        {
            return new ObjectResult(new
            {
                message = exception.Message
            })
            {
                StatusCode = StatusCodes.Status403Forbidden
            };
        }
        catch (DbUpdateConcurrencyException)
        {
            return new ConflictObjectResult(new
            {
                message = "El ticket ha sido modificado por otro usuario. Por favor actualice el listado."
            });
        }
        catch (InvalidOperationException exception)
        {
            return new ConflictObjectResult(new
            {
                message = exception.Message
            });
        }
    }
}