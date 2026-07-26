using Helpdesk.Application.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Helpdesk.API.Workers;

public class SlaMonitorWorker : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<SlaMonitorWorker> _logger;
    private const int checkIntervalSeconds = 60;

    public SlaMonitorWorker(IServiceScopeFactory scopeFactory, ILogger<SlaMonitorWorker> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Background Service de Monitoreo de SLA iniciado.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using (var scope = _scopeFactory.CreateScope())
                {
                    var slaService = scope.ServiceProvider.GetRequiredService<ISlaMonitorService>();
                    await slaService.ProcessExpireTicketsAsync();
                    await slaService.ProcessGracePeriodTicketsAsync();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error crítico en la ejecución del SlaMonitorWorker.");
            }

            await Task.Delay(TimeSpan.FromSeconds(checkIntervalSeconds), stoppingToken);
        }

        _logger.LogInformation("Background Service de Monitoreo de SLA detenido.");
    }
}