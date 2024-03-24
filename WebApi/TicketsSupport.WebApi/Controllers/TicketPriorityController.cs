using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
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
        public async Task<IActionResult> GetTicketPriorities()
        {
            var ticketPriorities = await _ticketPriorityRepository.GetTicketPriority();
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
        public async Task<IActionResult> GetMenuById(int id)
        {
            var ticketPriority = await _ticketPriorityRepository.GetTicketPriorityById(id);
            return Ok(ticketPriority);
        }

        /// <summary>
        /// Create new ticket priority
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost, MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(BasicResponse))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> Create(CreateTicketPriorityRequest request)
        {
            await _ticketPriorityRepository.CreateTicketPriority(request);
            return Ok(new BasicResponse { Success = true, Message = string.Format(ResourcesUtils.GetResponseMessage("ElementAdded"), "Ticket priority") });
        }

        /// <summary>
        /// Update ticket priority
        /// </summary>
        /// <param name="id"></param>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPut("{id}"), MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(BasicResponse))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> Update(int id, UpdateTicketPriorityRequest request)
        {
            await _ticketPriorityRepository.UpdateTicketPriority(id, request);
            return Ok(new BasicResponse { Success = true, Message = string.Format(ResourcesUtils.GetResponseMessage("ElementUpdated"), "Ticket priority") });
        }

        /// <summary>
        /// Delete ticket priority
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id}"), MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(BasicResponse))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> Delete(int id)
        {
            await _ticketPriorityRepository.DeleteTicketPriorityById(id);
            return Ok(new BasicResponse { Success = true, Message = string.Format(ResourcesUtils.GetResponseMessage("ElementDeleted"), "Ticket priority") });
        }
    }
}
