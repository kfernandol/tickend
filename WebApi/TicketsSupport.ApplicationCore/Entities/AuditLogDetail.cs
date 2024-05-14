using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TicketsSupport.ApplicationCore.Entities;

public partial class AuditLogDetail
{
    public int Id { get; set; }

    public long AudidLogId { get; set; }

    public string ColumnName { get; set; } = null!;

    public string? OldValue { get; set; }

    public string NewValue { get; set; } = null!;

    [EnumDataType(typeof(byte))]
    public TypeValue TypeValue { get; set; }

    public virtual AuditLog AudidLog { get; set; } = null!;
}
