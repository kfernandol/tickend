using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TicketsSupport.ApplicationCore.Entities;

public partial class Menu
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Url { get; set; } = null!;

    public string? Icon { get; set; }

    public int Position { get; set; }

    public int? ParentId { get; set; }

    public bool Show { get; set; }

    public int OrganizationId { get; set; }

    public bool Active { get; set; }

    public virtual ICollection<MenuXrol> MenuXrols { get; set; } = new List<MenuXrol>();

    public virtual Organization Organization { get; set; } = null!;
}
