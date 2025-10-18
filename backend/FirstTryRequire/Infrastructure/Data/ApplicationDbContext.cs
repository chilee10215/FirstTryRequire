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
    }
}

