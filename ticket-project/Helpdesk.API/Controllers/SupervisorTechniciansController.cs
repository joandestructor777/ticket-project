using Helpdesk.API.Contracts;
using Helpdesk.Application.Interfaces;
using Helpdesk.Application.Models;
using Microsoft.AspNetCore.Mvc;

namespace Helpdesk.API.Controllers;

[ApiController]
[Route("api/supervisor/technicians")]
public sealed class SupervisorTechniciansController : ControllerBase
{
    private readonly ITechnicianManagementService _technicianService;

    public SupervisorTechniciansController(
        ITechnicianManagementService technicianService)
    {
        _technicianService = technicianService;
    }

    [HttpPost]
    public async Task<ActionResult<TechnicianResult>> Create(
        CreateTechnicianRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var result = await _technicianService.CreateAsync(
                new CreateTechnicianCommand(
                    request.FullName,
                    request.MaxOpenTickets,
                    request.Specialties),
                cancellationToken);

            return StatusCode(StatusCodes.Status201Created, result);
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new { message = exception.Message });
        }
    }
}