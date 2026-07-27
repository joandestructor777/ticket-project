using Helpdesk.API.Workers;
using Helpdesk.Application.Interfaces;
using Helpdesk.Application.Models;
using Helpdesk.Application.Services;
using Helpdesk.Domain.Interfaces;
using Helpdesk.Infrastructure.Data;
using Helpdesk.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? ["http://localhost:3000"];
builder.Services.AddCors(options => options.AddPolicy("frontend", policy => policy
    .WithOrigins(allowedOrigins)
    .AllowAnyHeader()
    .AllowAnyMethod()));

builder.Services.AddDbContext<HelpdeskDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<ITicketRepository, TicketRepository>();
builder.Services.AddScoped<ITechnicianRepository, TechnicianRepository>();
builder.Services.AddScoped<ISystemSettingRepository, SystemSettingRepository>();
builder.Services.AddScoped<IClientTicketService, ClientTicketService>();
builder.Services.AddScoped<IAssignmentService, AssignmentService>();
builder.Services.AddScoped<ITechnicianManagementService, TechnicianManagementService>();
builder.Services.AddScoped<ITicketService, TicketService>();
builder.Services.AddScoped<ITechnicianTicketService, TechnicianTicketService>();
builder.Services.AddScoped<ISlaMonitorService, SlaMonitorService>();

var slaOptions = builder.Configuration.GetSection(SlaOptions.SectionName).Get<SlaOptions>() ?? new SlaOptions();
builder.Services.AddSingleton(slaOptions);
builder.Services.AddHostedService<SlaMonitorWorker>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("frontend");
app.UseAuthorization();
app.MapControllers();
app.Run();
