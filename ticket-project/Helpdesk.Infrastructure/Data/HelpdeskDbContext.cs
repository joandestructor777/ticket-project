using Helpdesk.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Helpdesk.Infrastructure.Data;

public class HelpdeskDbContext : DbContext
{
    public HelpdeskDbContext(DbContextOptions<HelpdeskDbContext> options)
        : base(options)
    {
    }

    public DbSet<Ticket> Tickets => Set<Ticket>();
    public DbSet<Technician> Technicians => Set<Technician>();
    public DbSet<TechnicianSpecialty> TechnicianSpecialties => Set<TechnicianSpecialty>();
    public DbSet<SystemSetting> SystemSettings => Set<SystemSetting>();
    public DbSet<TicketComment> TicketComments => Set<TicketComment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Ticket>(entity =>
        {
            entity.HasKey(ticket => ticket.Id);

            entity.Property(ticket => ticket.Title)
                .IsRequired()
                .HasMaxLength(150);

            entity.Property(ticket => ticket.Description)
                .IsRequired();

            entity.Property(ticket => ticket.Category)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(ticket => ticket.Priority)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(ticket => ticket.CreatedByClientId)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(ticket => ticket.State)
                .HasConversion<string>()
                .HasMaxLength(20);

            entity.Property(ticket => ticket.ResolutionComment)
                .HasMaxLength(2000);

            entity.Property(ticket => ticket.ReopenJustification)
                .HasMaxLength(2000);

            entity.Property(ticket => ticket.RowVersion)
                .IsRowVersion();

            entity.HasIndex(ticket => new
            {
                ticket.CreatedByClientId,
                ticket.CreationDate
            });

            entity.HasOne(ticket => ticket.AssignedTechnician)
                .WithMany()
                .HasForeignKey(ticket => ticket.AssignedTechnicianId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasMany(ticket => ticket.Comments)
                .WithOne(comment => comment.Ticket)
                .HasForeignKey(comment => comment.TicketId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(ticket => new
            {
                ticket.AssignedTechnicianId,
                ticket.State
            });
        });

        modelBuilder.Entity<Technician>(entity =>
        {
            entity.HasKey(technician => technician.Id);

            entity.Property(technician => technician.FullName)
                .IsRequired()
                .HasMaxLength(150);

            entity.Property(technician => technician.MaxOpenTickets)
                .IsRequired();

            entity.HasMany(technician => technician.Specialties)
                .WithOne(specialty => specialty.Technician)
                .HasForeignKey(specialty => specialty.TechnicianId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<TechnicianSpecialty>(entity =>
        {
            entity.HasKey(specialty => new
            {
                specialty.TechnicianId,
                specialty.Category
            });

            entity.Property(specialty => specialty.Category)
                .IsRequired()
                .HasMaxLength(50);
        });

        modelBuilder.Entity<TicketComment>(entity =>
        {
            entity.HasKey(comment => comment.Id);

            entity.Property(comment => comment.Content)
                .IsRequired()
                .HasMaxLength(2000);

            entity.Property(comment => comment.IsResolution)
                .IsRequired();

            entity.Property(comment => comment.CreatedAt)
                .IsRequired();

            entity.HasIndex(comment => new
            {
                comment.TicketId,
                comment.CreatedAt
            });

            entity.HasOne(comment => comment.Technician)
                .WithMany()
                .HasForeignKey(comment => comment.TechnicianId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<SystemSetting>(entity =>
        {
            entity.HasKey(setting => setting.Key);

            entity.Property(setting => setting.Value)
                .IsRequired()
                .HasMaxLength(100);

            entity.HasData(new SystemSetting
            {
                Key = "GracePeriodHours",
                Value = "48"
            });
        });
    }
}