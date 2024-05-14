using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TicketsSupport.ApplicationCore.Entities;

public partial class AuditLog
{
    public long Id { get; set; }

    public int? UserId { get; set; }

    [EnumDataType(typeof(byte))]
    public InterceptorActions Action { get; set; }

    public DateTime Date { get; set; }

    public string Table { get; set; } = null!;

    public string PrimaryId { get; set; } = null!;

    public virtual ICollection<AuditLogDetail> AuditLogDetails { get; set; } = new List<AuditLogDetail>();

    public virtual User? User { get; set; }
}
