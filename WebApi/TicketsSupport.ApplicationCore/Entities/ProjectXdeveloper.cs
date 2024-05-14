using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TicketsSupport.ApplicationCore.Entities;

public partial class ProjectXdeveloper
{
    public int Id { get; set; }

    public int ProjectId { get; set; }

    public int DeveloperId { get; set; }

    public virtual User Developer { get; set; } = null!;

    public virtual Project Project { get; set; } = null!;
}
