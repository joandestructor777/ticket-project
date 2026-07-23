using Helpdesk.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Helpdesk.Infrastructure.Data;

public class HelpdeskDbContext : DbContext
{
    public HelpdeskDbContext(DbContextOptions<HelpdeskDbContext> options) : base(options)
    {
    }

    public DbSet<Ticket> Tickets => Set<Ticket>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Ticket>(entity =>
        {
            entity.HasKey(t => t.Id);
            entity.Property(t => t.Title).IsRequired().HasMaxLength(150);
            entity.Property(t => t.Category).IsRequired().HasMaxLength(50);
            entity.Property(t => t.Priority).IsRequired().HasMaxLength(50);
            entity.Property(t => t.CreatedByClientId).IsRequired().HasMaxLength(100);
            entity.Property(t => t.State)
                .HasConversion<string>()
                .HasMaxLength(20);
            entity.HasIndex(t => new { t.CreatedByClientId, t.CreationDate });
        });
    }
}
