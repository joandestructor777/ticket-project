using Helpdesk.API.Contracts;
using Helpdesk.Application.Interfaces;
using Helpdesk.Application.Models;
using Microsoft.AspNetCore.Mvc;

namespace Helpdesk.API.Controllers;

[ApiController]
[Route("api/supervisor")]
public sealed class SupervisorAssignmentsController : ControllerBase
{
    private readonly IAssignmentService _assignmentService;

    public SupervisorAssignmentsController(
        IAssignmentService assignmentService)
    {
        _assignmentService = assignmentService;
    }

    [HttpGet("tickets/open")]
    public async Task<ActionResult<IReadOnlyList<OpenTicketForAssignmentResult>>>
        GetOpenTickets(CancellationToken cancellationToken)
    {
        var tickets = await _assignmentService.GetOpenTicketsAsync(
            cancellationToken);

        return Ok(tickets);
    }

    [HttpGet("technicians/available")]
    public async Task<ActionResult<IReadOnlyList<TechnicianAvailabilityResult>>>
        GetAvailableTechnicians(
            [FromQuery] string category,
            [FromQuery] bool includeAtCapacityTechnicians,
            CancellationToken cancellationToken)
    {
        try
        {
            var technicians =
                await _assignmentService.GetAvailableTechniciansAsync(
                    category,
                    includeAtCapacityTechnicians,
                    cancellationToken);

            return Ok(technicians);
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new { message = exception.Message });
        }
    }

    [HttpPost("tickets/{ticketId:guid}/assignment")]
    public async Task<ActionResult<TicketAssignmentResult>> AssignTicket(
        Guid ticketId,
        AssignTicketRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var result = await _assignmentService.AssignAsync(
                ticketId,
                new AssignTicketCommand(
                    request.TechnicianId,
                    request.ForceAssignment),
                cancellationToken);

            return Ok(result);
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new { message = exception.Message });
        }
        catch (KeyNotFoundException exception)
        {
            return NotFound(new { message = exception.Message });
        }
        catch (InvalidOperationException exception)
        {
            return Conflict(new { message = exception.Message });
        }
    }
}