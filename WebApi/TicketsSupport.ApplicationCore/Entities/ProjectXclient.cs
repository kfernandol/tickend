using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TicketsSupport.ApplicationCore.Entities;

public partial class ProjectXclient
{
    public int Id { get; set; }

    public int ProjectId { get; set; }

    public int ClientId { get; set; }

    public virtual User Client { get; set; } = null!;

    public virtual Project Project { get; set; } = null!;
}
