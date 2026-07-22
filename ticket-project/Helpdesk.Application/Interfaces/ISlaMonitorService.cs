namespace Helpdesk.Application.Interfaces;

public interface ISlaMonitorService
{
    Task ProcessExpireTicketsAsync();
}