using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using TicketsSupport.ApplicationCore.Entities;
using TicketsSupport.Infrastructure.Persistence.Interceptors;

namespace TicketsSupport.Infrastructure.Persistence.Contexts;

public partial class TS_DatabaseContext : DbContext
{
    public TS_DatabaseContext(DbContextOptions<TS_DatabaseContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AuditLog> AuditLogs { get; set; }

    public virtual DbSet<AuditLogDetail> AuditLogDetails { get; set; }

    public virtual DbSet<Menu> Menus { get; set; }

    public virtual DbSet<MenuXrol> MenuXrols { get; set; }

    public virtual DbSet<Organization> Organizations { get; set; }

    public virtual DbSet<OrganizationInvitation> OrganizationInvitations { get; set; }

    public virtual DbSet<OrganizationsXuser> OrganizationsXusers { get; set; }

    public virtual DbSet<Project> Projects { get; set; }

    public virtual DbSet<ProjectXclient> ProjectXclients { get; set; }

    public virtual DbSet<ProjectXdeveloper> ProjectXdevelopers { get; set; }

    public virtual DbSet<ProjectXticketPriority> ProjectXticketPriorities { get; set; }

    public virtual DbSet<ProjectXticketStatus> ProjectXticketStatuses { get; set; }

    public virtual DbSet<ProjectXticketType> ProjectXticketTypes { get; set; }

    public virtual DbSet<Rol> Rols { get; set; }

    public virtual DbSet<RolXuser> RolXusers { get; set; }

    public virtual DbSet<Ticket> Tickets { get; set; }

    public virtual DbSet<TicketPriority> TicketPriorities { get; set; }

    public virtual DbSet<TicketStatus> TicketStatuses { get; set; }

    public virtual DbSet<TicketType> TicketTypes { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserRegisterHistory> UserRegisterHistories { get; set; }

    public virtual DbSet<UserRestorePassword> UserRestorePasswords { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.ToTable("AuditLog");

            entity.Property(e => e.Date).HasColumnType("datetime");
            entity.Property(e => e.PrimaryId)
                .IsRequired()
                .IsUnicode(false);
            entity.Property(e => e.Table)
                .IsRequired()
                .IsUnicode(false);

            entity.HasOne(d => d.Organization).WithMany(p => p.AuditLogs).HasForeignKey(d => d.OrganizationId);

            entity.HasOne(d => d.User).WithMany(p => p.AuditLogs).HasForeignKey(d => d.UserId);
        });

        modelBuilder.Entity<AuditLogDetail>(entity =>
        {
            entity.Property(e => e.ColumnName)
                .IsRequired()
                .IsUnicode(false);
            entity.Property(e => e.NewValue)
                .IsRequired()
                .IsUnicode(false);
            entity.Property(e => e.OldValue).IsUnicode(false);

            entity.HasOne(d => d.AudidLog).WithMany(p => p.AuditLogDetails)
                .HasForeignKey(d => d.AudidLogId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<Menu>(entity =>
        {
            entity.ToTable("Menu");

            entity.Property(e => e.Icon)
                .HasMaxLength(300)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Url)
                .IsRequired()
                .HasMaxLength(300)
                .IsUnicode(false);

            entity.HasOne(d => d.Organization).WithMany(p => p.Menus)
                .HasForeignKey(d => d.OrganizationId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<MenuXrol>(entity =>
        {
            entity.ToTable("MenuXRol");

            entity.HasOne(d => d.Menu).WithMany(p => p.MenuXrols)
                .HasForeignKey(d => d.MenuId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.Role).WithMany(p => p.MenuXrols)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<Organization>(entity =>
        {
            entity.ToTable("Organization");

            entity.Property(e => e.Address)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.CreateDate).HasColumnType("datetime");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.Phone)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Photo).IsUnicode(false);
        });

        modelBuilder.Entity<OrganizationInvitation>(entity =>
        {
            entity.Property(e => e.CreateDate).HasColumnType("datetime");
            entity.Property(e => e.ExpirationDate).HasColumnType("datetime");
            entity.Property(e => e.Hash)
                .IsRequired()
                .HasMaxLength(150)
                .IsUnicode(false);

            entity.HasOne(d => d.Organization).WithMany(p => p.OrganizationInvitations)
                .HasForeignKey(d => d.OrganizationId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.User).WithMany(p => p.OrganizationInvitations)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<OrganizationsXuser>(entity =>
        {
            entity.ToTable("OrganizationsXUser");

            entity.HasOne(d => d.Organization).WithMany(p => p.OrganizationsXusers)
                .HasForeignKey(d => d.OrganizationId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.User).WithMany(p => p.OrganizationsXusers)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<Project>(entity =>
        {
            entity.ToTable("Project");

            entity.Property(e => e.Description)
                .IsRequired()
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Photo).IsUnicode(false);

            entity.HasOne(d => d.Organization).WithMany(p => p.Projects)
                .HasForeignKey(d => d.OrganizationId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<ProjectXclient>(entity =>
        {
            entity.ToTable("ProjectXClients");

            entity.HasOne(d => d.Client).WithMany(p => p.ProjectXclients)
                .HasForeignKey(d => d.ClientId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.Project).WithMany(p => p.ProjectXclients)
                .HasForeignKey(d => d.ProjectId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<ProjectXdeveloper>(entity =>
        {
            entity.ToTable("ProjectXDeveloper");

            entity.HasOne(d => d.Developer).WithMany(p => p.ProjectXdevelopers)
                .HasForeignKey(d => d.DeveloperId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.Project).WithMany(p => p.ProjectXdevelopers)
                .HasForeignKey(d => d.ProjectId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<ProjectXticketPriority>(entity =>
        {
            entity.ToTable("ProjectXTicketPriority");

            entity.HasOne(d => d.Project).WithMany(p => p.ProjectXticketPriorities)
                .HasForeignKey(d => d.ProjectId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.TicketPriority).WithMany(p => p.ProjectXticketPriorities)
                .HasForeignKey(d => d.TicketPriorityId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<ProjectXticketStatus>(entity =>
        {
            entity.ToTable("ProjectXTicketStatus");

            entity.HasOne(d => d.Project).WithMany(p => p.ProjectXticketStatuses)
                .HasForeignKey(d => d.ProjectId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.TicketStatus).WithMany(p => p.ProjectXticketStatuses)
                .HasForeignKey(d => d.TicketStatusId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<ProjectXticketType>(entity =>
        {
            entity.ToTable("ProjectXTicketType");

            entity.HasOne(d => d.Project).WithMany(p => p.ProjectXticketTypes)
                .HasForeignKey(d => d.ProjectId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.TicketType).WithMany(p => p.ProjectXticketTypes)
                .HasForeignKey(d => d.TicketTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<Rol>(entity =>
        {
            entity.ToTable("Rol");

            entity.Property(e => e.Description)
                .HasMaxLength(1000)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(150)
                .IsUnicode(false);

            entity.HasOne(d => d.Organization).WithMany(p => p.Rols)
                .HasForeignKey(d => d.OrganizationId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<RolXuser>(entity =>
        {
            entity.ToTable("RolXUser");

            entity.HasOne(d => d.Rol).WithMany(p => p.RolXusers).HasForeignKey(d => d.RolId);

            entity.HasOne(d => d.User).WithMany(p => p.RolXusers).HasForeignKey(d => d.UserId);
        });

        modelBuilder.Entity<Ticket>(entity =>
        {
            entity.ToTable("Ticket");

            entity.Property(e => e.Browser)
                .IsRequired()
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.DateClosed).HasColumnType("datetime");
            entity.Property(e => e.DateCreated).HasColumnType("datetime");
            entity.Property(e => e.DateUpdated).HasColumnType("datetime");
            entity.Property(e => e.Description)
                .IsRequired()
                .IsUnicode(false);
            entity.Property(e => e.Ip)
                .IsRequired()
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("IP");
            entity.Property(e => e.Os)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("OS");
            entity.Property(e => e.Title)
                .IsRequired()
                .HasMaxLength(150)
                .IsUnicode(false);

            entity.HasOne(d => d.ClosedByNavigation).WithMany(p => p.TicketClosedByNavigations).HasForeignKey(d => d.ClosedBy);

            entity.HasOne(d => d.CreateByNavigation).WithMany(p => p.TicketCreateByNavigations)
                .HasForeignKey(d => d.CreateBy)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.LastUpdatedByNavigation).WithMany(p => p.TicketLastUpdatedByNavigations).HasForeignKey(d => d.LastUpdatedBy);

            entity.HasOne(d => d.Organization).WithMany(p => p.Tickets)
                .HasForeignKey(d => d.OrganizationId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.Project).WithMany(p => p.Tickets)
                .HasForeignKey(d => d.ProjectId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.ReplyNavigation).WithMany(p => p.InverseReplyNavigation).HasForeignKey(d => d.Reply);

            entity.HasOne(d => d.TicketPriority).WithMany(p => p.Tickets).HasForeignKey(d => d.TicketPriorityId);

            entity.HasOne(d => d.TicketStatus).WithMany(p => p.Tickets).HasForeignKey(d => d.TicketStatusId);

            entity.HasOne(d => d.TicketType).WithMany(p => p.Tickets)
                .HasForeignKey(d => d.TicketTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<TicketPriority>(entity =>
        {
            entity.ToTable("TicketPriority");

            entity.Property(e => e.Color)
                .IsRequired()
                .HasMaxLength(7)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(100)
                .IsUnicode(false);

            entity.HasOne(d => d.Organization).WithMany(p => p.TicketPriorities)
                .HasForeignKey(d => d.OrganizationId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<TicketStatus>(entity =>
        {
            entity.ToTable("TicketStatus");

            entity.Property(e => e.Color)
                .IsRequired()
                .HasMaxLength(7)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(100)
                .IsUnicode(false);

            entity.HasOne(d => d.Organization).WithMany(p => p.TicketStatuses)
                .HasForeignKey(d => d.OrganizationId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<TicketType>(entity =>
        {
            entity.ToTable("TicketType");

            entity.Property(e => e.Icon)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.IconColor)
                .IsRequired()
                .HasMaxLength(7)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(100)
                .IsUnicode(false);

            entity.HasOne(d => d.Organization).WithMany(p => p.TicketTypes)
                .HasForeignKey(d => d.OrganizationId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("User");

            entity.Property(e => e.Direction)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Email)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.FirstName)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.LastName)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.Password)
                .IsRequired()
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Phone)
                .HasMaxLength(16)
                .IsUnicode(false);
            entity.Property(e => e.Photo).IsUnicode(false);
            entity.Property(e => e.RefreshToken)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.RefreshTokenExpirationTime).HasColumnType("datetime");
            entity.Property(e => e.Salt)
                .IsRequired()
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Username)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<UserRegisterHistory>(entity =>
        {
            entity.ToTable("UserRegisterHistory");

            entity.Property(e => e.ConfirmationDate).HasColumnType("datetime");
            entity.Property(e => e.HashConfirmation)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.Ip)
                .IsRequired()
                .HasMaxLength(16)
                .IsUnicode(false)
                .HasColumnName("IP");
            entity.Property(e => e.RegisterDate).HasColumnType("datetime");

            entity.HasOne(d => d.User).WithMany(p => p.UserRegisterHistories)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<UserRestorePassword>(entity =>
        {
            entity.ToTable("UserRestorePassword");

            entity.Property(e => e.CreateDate).HasColumnType("datetime");
            entity.Property(e => e.ExpirationDate).HasColumnType("datetime");
            entity.Property(e => e.Hash)
                .IsRequired()
                .HasMaxLength(150)
                .IsUnicode(false);

            entity.HasOne(d => d.User).WithMany(p => p.UserRestorePasswords)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);

    public async Task<int> SaveChangesAsync(int userId, int? organizationId, InterceptorActions action, CancellationToken cancellationToken = default)
    {
        var interceptor = new AuditLogInterceptor(this);
        return await interceptor.SaveChangesAsync(userId, organizationId, action, cancellationToken);
    }

}
