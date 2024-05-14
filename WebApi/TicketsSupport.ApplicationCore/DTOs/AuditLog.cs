namespace TicketsSupport.ApplicationCore.DTOs
{
    public class AuditLogResponse
    {
        public long Id { get; set; }
        public int? UserId { get; set; }
        public byte Action { get; set; }
        public DateTime Date { get; set; }
        public string Table { get; set; } = null!;
        public string PrimaryId { get; set; } = null!;
        public List<AuditLogDetailResponse>? auditLogDetailResponses { get; set; }
    }

    public class AuditLogDetailResponse
    {
        public int Id { get; set; }
        public string ColumnName { get; set; } = null!;
        public string OldValue { get; set; } = null!;
        public string NewValue { get; set; } = null!;
        public byte TypeValue { get; set; }
    }

    public class AuditLogActionsResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
