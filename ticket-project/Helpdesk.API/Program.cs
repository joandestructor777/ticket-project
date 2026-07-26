using Helpdesk.Application.Interfaces;
using Helpdesk.Application.Services;
using Helpdesk.Domain.Interfaces;
using Helpdesk.Infrastructure.Data;
using Helpdesk.Infrastructure.Repositories;
using Helpdesk.API.Workers;
using Microsoft.EntityFrameworkCore;
using Helpdesk.Domain.Entities;
using Helpdesk.Domain.Enums;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddCors();

builder.Services.AddDbContext<HelpdeskDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<ITicketRepository, TicketRepository>();

builder.Services.AddScoped<ITicketService, TicketService>();
builder.Services.AddScoped<ISlaMonitorService, SlaMonitorService>();

builder.Services.AddHostedService<SlaMonitorWorker>();

var app = builder.Build();

// SEEDER: Crear tickets de prueba si la base de datos está vacía
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<HelpdeskDbContext>();
    if (!context.Tickets.Any())
    {
        context.Tickets.AddRange(
            new Ticket { 
                Id = Guid.NewGuid(), Title = "Fallo de servidor central", Description = "Servidor 1 no responde", 
                Category = "Hardware", Priority = "Crítica", State = TicketState.Opened, 
                CreationDate = DateTime.UtcNow.AddDays(-2), LimitDateSLA = DateTime.UtcNow.AddDays(-1), TechnicianId = 1 
            },
            new Ticket { 
                Id = Guid.NewGuid(), Title = "Cambio de contraseña", Description = "Usuario olvidó clave", 
                Category = "Software", Priority = "Baja", State = TicketState.Resolved, 
                CreationDate = DateTime.UtcNow.AddHours(-50), LimitDateSLA = DateTime.UtcNow.AddHours(-10), 
                ResolutionDate = DateTime.UtcNow.AddHours(-49), TechnicianId = 2 
            },
            new Ticket { 
                Id = Guid.NewGuid(), Title = "Problema de red", Description = "No hay internet en piso 2", 
                Category = "Red", Priority = "Alta", State = TicketState.Expired, 
                CreationDate = DateTime.UtcNow.AddDays(-3), LimitDateSLA = DateTime.UtcNow.AddDays(-2), TechnicianId = 1,
                RegisteredExpirationAlert = true, LogAlert = "SLA Expirado."
            },
            new Ticket { 
                Id = Guid.NewGuid(), Title = "Instalar Office", Description = "Nueva PC de gerencia", 
                Category = "Software", Priority = "Media", State = TicketState.Closed, 
                CreationDate = DateTime.UtcNow.AddDays(-10), LimitDateSLA = DateTime.UtcNow.AddDays(-8), 
                ResolutionDate = DateTime.UtcNow.AddDays(-9), TechnicianId = 3 
            }
        );
        context.SaveChanges();
    }
}

app.UseCors(policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
app.UseAuthorization();
app.MapControllers();

app.Run();