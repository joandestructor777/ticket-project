using Helpdesk.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Helpdesk.Infrastructure.Data;

public class HelpdeskDbContext : DbContext
{
    public HelpdeskDbContext(DbContextOptions<HelpdeskDbContext> options) : base(options)
    {
    }

    public DbSet<Ticket> Tickets => Set<Ticket>();
    public DbSet<Technician> Technicians => Set<Technician>();

    public DbSet<TechnicianSpecialty> TechnicianSpecialties => Set<TechnicianSpecialty>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    modelBuilder.Entity<Ticket>(entity =>
    {
        entity.HasKey(ticket => ticket.Id);

        entity.Property(ticket => ticket.Title)
            .IsRequired()
            .HasMaxLength(150);

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

        entity.HasIndex(ticket => new
        {
            ticket.CreatedByClientId,
            ticket.CreationDate
        });

        entity.HasOne(ticket => ticket.AssignedTechnician)
            .WithMany()
            .HasForeignKey(ticket => ticket.AssignedTechnicianId)
            .OnDelete(DeleteBehavior.Restrict);

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
}
}
