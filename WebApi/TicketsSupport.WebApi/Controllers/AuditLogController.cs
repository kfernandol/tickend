using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TicketsSupport.ApplicationCore.Authorization.Menu;
using TicketsSupport.ApplicationCore.Commons;
using TicketsSupport.ApplicationCore.DTOs;
using TicketsSupport.ApplicationCore.Interfaces;

namespace TicketsSupport.WebApi.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/audit-log")]
    public class AuditLogController : ControllerBase
    {
        private readonly IAuditLogRepository _auditLogRepository;
        public AuditLogController(IAuditLogRepository auditLogRepository)
        {
            _auditLogRepository = auditLogRepository;
        }

        /// <summary>
        /// Get all auditlogs
        /// </summary>
        /// <returns></returns>
        [AuthorizeMenu("AuditLogs")]
        [HttpGet, MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(List<AuditLogResponse>))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> GetAuditLogs()
        {
            var auditLogs = await _auditLogRepository.GetAuditLogs();
            return Ok(auditLogs);
        }

        /// <summary>
        /// Get all actions
        /// </summary>
        /// <returns></returns>
        [AuthorizeMenu("AuditLogs")]
        [HttpGet("actions/"), MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(List<AuditLogActionsResponse>))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> GetAuditLogActions()
        {
            var auditLogsActions = await _auditLogRepository.GetAuditLogActions();
            return Ok(auditLogsActions);
        }
    }
}
