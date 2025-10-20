using Microsoft.EntityFrameworkCore;
using FirstTryRequire.Domain.Entities;

namespace FirstTryRequire.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<WorkItem> WorkItems { get; set; }
    public DbSet<UserWorkItem> UserWorkItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("users");

            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();

            entity.Property(e => e.Username)
                .HasColumnName("username")
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(e => e.Email)
                .HasColumnName("email")
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(e => e.PasswordHash)
                .HasColumnName("password_hash")
                .HasMaxLength(255)
                .IsRequired();

            entity.Property(e => e.CreatedAt)
                .HasColumnName("created_at")
                .HasColumnType("timestamp");

            entity.Property(e => e.UpdatedAt)
                .HasColumnName("updated_at")
                .HasColumnType("timestamp");

            entity.Property(e => e.LastLogin)
                .HasColumnName("last_login")
                .HasColumnType("datetime");

            entity.Property(e => e.ManageLevel)
                .HasColumnName("manage_level")
                .HasConversion<string>()
                .IsRequired();

            entity.HasIndex(e => e.Username)
                .IsUnique()
                .HasDatabaseName("username");

            entity.HasIndex(e => e.Email)
                .IsUnique()
                .HasDatabaseName("email");
        });

        // Configure WorkItem entity
        modelBuilder.Entity<WorkItem>(entity =>
        {
            entity.ToTable("WorkItems");

            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();

            entity.Property(e => e.Title)
                .HasColumnName("title")
                .HasMaxLength(200)
                .IsRequired();

            entity.Property(e => e.Description)
                .HasColumnName("description")
                .HasMaxLength(4000);

            entity.Property(e => e.CreatedTime)
                .HasColumnName("created_time")
                .HasColumnType("datetime")
                .IsRequired();

            entity.Property(e => e.Status)
                .HasColumnName("status")
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(e => e.LastUpdatedTime)
                .HasColumnName("last_updated_time")
                .HasColumnType("datetime")
                .IsRequired();
        });

        // Configure UserWorkItem entity
        modelBuilder.Entity<UserWorkItem>(entity =>
        {
            entity.ToTable("UserWorkItem");

            entity.HasKey(e => new { e.UserId, e.WorkItemId });

            entity.Property(e => e.UserId)
                .HasColumnName("user_id");

            entity.Property(e => e.WorkItemId)
                .HasColumnName("workitem_id");

            entity.Property(e => e.Status)
                .HasColumnName("status")
                .HasMaxLength(50)
                .IsRequired();

            // Configure relationships
            entity.HasOne(uw => uw.User)
                .WithMany()
                .HasForeignKey(uw => uw.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(uw => uw.WorkItem)
                .WithMany(w => w.UserWorkItems)
                .HasForeignKey(uw => uw.WorkItemId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}

