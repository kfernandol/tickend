using System;
using System.Collections.Generic;

namespace TicketsSupport.ApplicationCore.Entities;

public partial class User
{
    public int Id { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    public string Username { get; set; }

    public string Email { get; set; }

    public string Password { get; set; }

    public string Salt { get; set; }

    public string? RefreshToken { get; set; }

    public int? Rol { get; set; }

    public bool Active { get; set; }

    public virtual Rol RolNavigation { get; set; }
}
