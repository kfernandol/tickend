using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using TicketsSupport.ApplicationCore.Configuration;
using TicketsSupport.ApplicationCore.DTOs;
using TicketsSupport.ApplicationCore.Entities;
using TicketsSupport.ApplicationCore.Interfaces;
using TicketsSupport.Infrastructure.Persistence.Contexts;

namespace TicketsSupport.Infrastructure.Persistence.Repositories
{
    public class AuditLogRepository : IAuditLogRepository
    {
        private readonly TS_DatabaseContext _context;
        private readonly IMapper _mapper;
        private int OrganizationId;
        public AuditLogRepository(TS_DatabaseContext context, IMapper mapper, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _mapper = mapper;
            //Get OrganizationId
            string? organizationIdTxt = httpContextAccessor.HttpContext?.User.Claims.FirstOrDefault(x => x.Type == "organization")?.Value;
            int.TryParse(organizationIdTxt, out OrganizationId);
        }

        public async Task<List<AuditLogResponse>> GetAuditLogs()
        {
            return await _context.AuditLogs.Include(x => x.AuditLogDetails)
                                           .Where(x => x.OrganizationId == OrganizationId)
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
