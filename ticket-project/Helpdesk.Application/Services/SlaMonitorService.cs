using Helpdesk.Application.Interfaces;
using Helpdesk.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace Helpdesk.Application.Services;

public class SlaMonitorService : ISlaMonitorService
{
    private readonly ITicketRepository _ticketRepository;
    private readonly ILogger<SlaMonitorService> _logger;

    public SlaMonitorService(ITicketRepository ticketRepository, ILogger<SlaMonitorService> logger)
    {
        _ticketRepository = ticketRepository;
        _logger = logger;
    }

    public async Task ProcessExpireTicketsAsync()
    {
        var now = DateTime.UtcNow;
        _logger.LogInformation("Consultando tickets vencidos en el SLA a fecha {Ahora} UTC", now);

        var expiredTickets = await _ticketRepository.GetActiveTicketsWithExpiredSlaAsync(now);

        int processedCount = 0;
        foreach (var ticket in expiredTickets)
        {
            _logger.LogWarning("Ticket ID {Id} superó la fecha límite {Sla}. Marcando como vencido...", ticket.Id, ticket.LimitDateSLA);

            ticket.MarkAsDefeated("El tiempo límite de resolución asignado por SLA ha expirado.");

            await _ticketRepository.UpdateAsync(ticket);
            processedCount++;
        }

        if (processedCount > 0)
        {
            _logger.LogInformation("Se han procesado e informado {Cantidad} tickets vencidos.", processedCount);
        }
    }
}
