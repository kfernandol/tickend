using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TicketsSupport.ApplicationCore.Entities;

public partial class UserRestorePassword
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string Hash { get; set; } = null!;

    public DateTime CreateDate { get; set; }

    public DateTime ExpirationDate { get; set; }

    public bool Used { get; set; }

    public virtual User User { get; set; } = null!;
}
