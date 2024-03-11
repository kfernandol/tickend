﻿using System;
using System.Collections.Generic;

namespace TicketsSupport.ApplicationCore.Entities;

public partial class MenuXrol
{
    public int Id { get; set; }

    public int MenuId { get; set; }

    public int RoleId { get; set; }

    public virtual Menu Menu { get; set; }

    public virtual Rol Role { get; set; }
}
