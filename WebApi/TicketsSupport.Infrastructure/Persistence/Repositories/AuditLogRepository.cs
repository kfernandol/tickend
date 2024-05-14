using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using TicketsSupport.ApplicationCore.Configuration;
using TicketsSupport.ApplicationCore.DTOs;
using TicketsSupport.ApplicationCore.Interfaces;
using TicketsSupport.Infrastructure.Persistence.Contexts;

namespace TicketsSupport.Infrastructure.Persistence.Repositories
{
    public class AuditLogRepository : IAuditLogRepository
    {
        private readonly TS_DatabaseContext _context;
        private readonly IMapper _mapper;
        public AuditLogRepository(TS_DatabaseContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<AuditLogResponse>> GetAuditLogs()
        {
            return await _context.AuditLogs.Include(x => x.AuditLogDetails)
                                           .OrderByDescending(x => x.Date)
                                           .Select(x => _mapper.Map<AuditLogResponse>(x))
                                           .AsNoTracking()
                                           .AsSplitQuery()
                                           .ToListAsync();
        }

        public async Task<List<AuditLogActionsResponse>> GetAuditLogActions()
        {
            var auditLogActions = new List<AuditLogActionsResponse>();

            var values = Enum.GetValues(typeof(InterceptorActions)).Cast<byte>();
            foreach (var value in values)
            {
                var name = Enum.GetName(typeof(InterceptorActions), value);
                auditLogActions.Add(new AuditLogActionsResponse { Id = value, Name = name });
            }

            return auditLogActions;
        }
    }
}
