using Helpdesk.Application.Interfaces;
using Helpdesk.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace Helpdesk.Application.Services;

public class SlaMonitorService : ISlaMonitorService
{
    private readonly ITicketRepository _ticketRepository;
    private readonly ISystemSettingRepository _systemSettingRepository;
    private readonly ILogger<SlaMonitorService> _logger;

    public SlaMonitorService(
        ITicketRepository ticketRepository,
        ISystemSettingRepository systemSettingRepository,
        ILogger<SlaMonitorService> logger)
    {
        _ticketRepository = ticketRepository;
        _systemSettingRepository = systemSettingRepository;
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

            ticket.MarkAsExpired("El tiempo límite de resolución asignado por SLA ha expirado.");

            await _ticketRepository.UpdateAsync(ticket);
            processedCount++;
        }

        if (processedCount > 0)
        {
            _logger.LogInformation("Se han procesado e informado {Cantidad} tickets vencidos.", processedCount);
        }
    }

    public async Task ProcessGracePeriodTicketsAsync()
    {
        var now = DateTime.UtcNow;
        var setting = await _systemSettingRepository.GetByKeyAsync("GracePeriodHours");
        var gracePeriodHours = int.TryParse(setting?.Value, out var configuredHours) && configuredHours > 0
            ? configuredHours
            : 48;

        var limitTime = now.AddHours(-gracePeriodHours);

        _logger.LogInformation("Consultando tickets resueltos que superaron el plazo de gracia de {Horas}h (Límite: {Limite} UTC)", gracePeriodHours, limitTime);

        var pastGracePeriodTickets = await _ticketRepository.GetResolvedTicketsPastGracePeriodAsync(limitTime);

        int processedCount = 0;
        foreach (var ticket in pastGracePeriodTickets)
        {
            _logger.LogInformation("Ticket ID {Id} superó el plazo de gracia. Cerrando definitivamente...", ticket.Id);
            ticket.CloseAfterGracePeriod();
            await _ticketRepository.UpdateAsync(ticket);
            processedCount++;
        }

        if (processedCount > 0)
        {
            _logger.LogInformation("Se cerraron definitivamente {Cantidad} tickets tras expirar su plazo de gracia.", processedCount);
        }
    }
}
