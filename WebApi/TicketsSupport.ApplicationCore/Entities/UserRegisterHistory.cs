using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TicketsSupport.ApplicationCore.Entities;

public partial class UserRegisterHistory
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string? HashConfirmation { get; set; }

    public string Ip { get; set; } = null!;

    public DateTime RegisterDate { get; set; }

    public DateTime? ConfirmationDate { get; set; }

    public bool Confirmed { get; set; }

    public virtual User User { get; set; } = null!;
}
