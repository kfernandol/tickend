using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TicketsSupport.ApplicationCore.Entities;

public partial class User
{
    public int Id { get; set; }

    public string? Photo { get; set; }

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public string Username { get; set; } = null!;

    public string? Email { get; set; }

    public string Password { get; set; } = null!;

    public string? Phone { get; set; }

    public string? Direction { get; set; }

    public string Salt { get; set; } = null!;

    public string? RefreshToken { get; set; }

    public DateTime? RefreshTokenExpirationTime { get; set; }

    public bool Active { get; set; }

    public virtual ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();

    public virtual ICollection<OrganizationsXuser> OrganizationsXusers { get; set; } = new List<OrganizationsXuser>();

    public virtual ICollection<ProjectXclient> ProjectXclients { get; set; } = new List<ProjectXclient>();

    public virtual ICollection<ProjectXdeveloper> ProjectXdevelopers { get; set; } = new List<ProjectXdeveloper>();

    public virtual ICollection<RolXuser> RolXusers { get; set; } = new List<RolXuser>();

    public virtual ICollection<Ticket> TicketClosedByNavigations { get; set; } = new List<Ticket>();

    public virtual ICollection<Ticket> TicketCreateByNavigations { get; set; } = new List<Ticket>();

    public virtual ICollection<Ticket> TicketLastUpdatedByNavigations { get; set; } = new List<Ticket>();

    public virtual ICollection<UserRegisterHistory> UserRegisterHistories { get; set; } = new List<UserRegisterHistory>();

    public virtual ICollection<UserRestorePassword> UserRestorePasswords { get; set; } = new List<UserRestorePassword>();
}
