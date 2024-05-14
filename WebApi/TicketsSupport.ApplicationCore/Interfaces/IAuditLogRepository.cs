using TicketsSupport.ApplicationCore.DTOs;

namespace TicketsSupport.ApplicationCore.Interfaces
{
    public interface IAuditLogRepository
    {
        Task<List<AuditLogResponse>> GetAuditLogs();
        Task<List<AuditLogActionsResponse>> GetAuditLogActions();
    }
}
