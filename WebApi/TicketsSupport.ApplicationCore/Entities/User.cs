using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TicketsSupport.ApplicationCore.Entities;

public partial class User
{
    public int Id { get; set; }

    public byte[]? Photo { get; set; }

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public string Username { get; set; } = null!;

    public string? Email { get; set; }

    public string Password { get; set; } = null!;

    public string Salt { get; set; } = null!;

    public string? RefreshToken { get; set; }

    public DateTime? RefreshTokenExpirationTime { get; set; }

    public int? Rol { get; set; }

    public bool Active { get; set; }

    public virtual ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();

    public virtual ICollection<ProjectXclient> ProjectXclients { get; set; } = new List<ProjectXclient>();

    public virtual ICollection<ProjectXdeveloper> ProjectXdevelopers { get; set; } = new List<ProjectXdeveloper>();

    public virtual Rol? RolNavigation { get; set; }

    public virtual ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();

    public virtual ICollection<UserRestorePassword> UserRestorePasswords { get; set; } = new List<UserRestorePassword>();
}
