using System;
using System.Collections.Generic;

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

    public virtual Rol? RolNavigation { get; set; }
}
