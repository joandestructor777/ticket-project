using Helpdesk.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Helpdesk.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TicketsController : ControllerBase
{
    private readonly ITicketService _ticketService;

    public TicketsController(ITicketService ticketService)
    {
        _ticketService = ticketService;
    }

    [HttpGet]
    public async Task<IActionResult> GetTickets()
    {
        try
        {
            var tickets = await _ticketService.GetAllTicketsAsync();
            // Note: Returning tickets directly. In a real app we'd map to a DTO.
            return Ok(tickets);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpPost("{id}/reopen")]
    public async Task<IActionResult> ReopenTicket(Guid id, [FromBody] ReopenRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.Justification))
                return BadRequest(new { error = "La justificación es requerida para reabrir un ticket." });

            var ticket = await _ticketService.ReopenTicketAsync(id, request.Justification);
            return Ok(ticket);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPut("{id}/assign/{technicianId}")]
    public async Task<IActionResult> AssignTicket(Guid id, int technicianId)
    {
        try
        {
            var ticket = await _ticketService.AssignTicketAsync(id, technicianId);
            return Ok(ticket);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateTicketStatus(Guid id, [FromBody] StatusUpdateRequest request)
    {
        try
        {
            var ticket = await _ticketService.UpdateTicketStatusAsync(id, request.State, request.ResolutionComment);
            return Ok(ticket);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("technician/{technicianId}")]
    public async Task<IActionResult> GetTicketsByTechnician(int technicianId)
    {
        var tickets = await _ticketService.GetTicketsByTechnicianAsync(technicianId);
        return Ok(tickets);
    }
}

public class ReopenRequest
{
    public string Justification { get; set; } = string.Empty;
}

public class StatusUpdateRequest
{
    public Helpdesk.Domain.Enums.TicketState State { get; set; }
    public string? ResolutionComment { get; set; }
}
