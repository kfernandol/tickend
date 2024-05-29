using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TicketsSupport.ApplicationCore.Entities;

public partial class OrganizationsXuser
{
    public int Id { get; set; }

    public int OrganizationId { get; set; }

    public int UserId { get; set; }

    public virtual Organization Organization { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
