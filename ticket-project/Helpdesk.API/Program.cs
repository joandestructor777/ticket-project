using Helpdesk.Application.Interfaces;
using Helpdesk.Application.Services;
using Helpdesk.Domain.Interfaces;
using Helpdesk.Infrastructure.Data;
using Helpdesk.Infrastructure.Repositories;
using Helpdesk.API.Workers;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<HelpdeskDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<ITicketRepository, TicketRepository>();

builder.Services.AddScoped<ISlaMonitorService, SlaMonitorService>();

builder.Services.AddHostedService<SlaMonitorWorker>();

var app = builder.Build();

app.UseAuthorization();
app.MapControllers();

app.Run();