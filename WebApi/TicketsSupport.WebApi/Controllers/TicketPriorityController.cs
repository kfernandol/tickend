using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using System.Security.Claims;
using TicketsSupport.ApplicationCore.Authorization.Menu;
using TicketsSupport.ApplicationCore.Authorization.Role;
using TicketsSupport.ApplicationCore.Commons;
using TicketsSupport.ApplicationCore.DTOs;
using TicketsSupport.ApplicationCore.Interfaces;
using TicketsSupport.ApplicationCore.Utils;
using TicketsSupport.Infrastructure.Persistence.Repositories;

namespace TicketsSupport.WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/ticket/priorities")]
    public class TicketPriorityController : Controller
    {
        private readonly ITicketPriorityRepository _ticketPriorityRepository;

        public TicketPriorityController(ITicketPriorityRepository ticketPriorityRepository)
        {
            _ticketPriorityRepository = ticketPriorityRepository;
        }

        /// <summary>
        /// Get all ticket priorities
        /// </summary>
        /// <returns></returns>
        [HttpGet, MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(List<TicketPriorityResponse>))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> GetTicketPriority()
        {
            string? username = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            var ticketPriorities = await _ticketPriorityRepository.GetTicketPriority(username);
            return Ok(ticketPriorities);
        }

        /// <summary>
        /// Get ticket priority by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}"), MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(TicketPriorityResponse))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> GetTicketPriorityById(int id)
        {
            var ticketPriority = await _ticketPriorityRepository.GetTicketPriorityById(id);
            return Ok(ticketPriority);
        }

        /// <summary>
        /// Tickets Priority By Project
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("byproject/{id}"), MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(TicketTypeResponse))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> GetTicketPriorityByProject(int id)
        {
            var ticketPriority = await _ticketPriorityRepository.GetTicketPriorityByProject(id);
            return Ok(ticketPriority);
        }

        /// <summary>
        /// Create new ticket priority
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [AuthorizeRole(PermissionLevel.Administrator)]
        [AuthorizeMenu("TicketPriority")]
        [HttpPost, MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(BasicResponse))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> CreateTicketPriority(CreateTicketPriorityRequest request)
        {
            await _ticketPriorityRepository.CreateTicketPriority(request);
            return Ok(new BasicResponse { Success = true, Message = string.Format(ResourcesUtils.GetResponseMessage("ElementAdded"), ResourcesUtils.GetResponseMessage("TicketPriority")) });
        }

        /// <summary>
        /// Update ticket priority
        /// </summary>
        /// <param name="id"></param>
        /// <param name="request"></param>
        /// <returns></returns>
        [AuthorizeRole(PermissionLevel.Administrator)]
        [AuthorizeMenu("TicketPriority")]
        [HttpPut("{id}"), MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(BasicResponse))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> UpdateTicketPriority(int id, UpdateTicketPriorityRequest request)
        {
            await _ticketPriorityRepository.UpdateTicketPriority(id, request);
            return Ok(new BasicResponse { Success = true, Message = string.Format(ResourcesUtils.GetResponseMessage("ElementUpdated"), ResourcesUtils.GetResponseMessage("TicketPriority")) });
        }

        /// <summary>
        /// Delete ticket priority
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [AuthorizeRole(PermissionLevel.Administrator)]
        [AuthorizeMenu("TicketPriority")]
        [HttpDelete("{id}"), MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(BasicResponse))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> DeleteTicketPriorityById(int id)
        {
            await _ticketPriorityRepository.DeleteTicketPriorityById(id);
            return Ok(new BasicResponse { Success = true, Message = string.Format(ResourcesUtils.GetResponseMessage("ElementDeleted"), ResourcesUtils.GetResponseMessage("TicketPriority")) });
        }
    }
}
