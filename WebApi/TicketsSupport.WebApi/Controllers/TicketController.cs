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
    [Route("api/v{version:apiVersion}/tickets")]
    public class TicketController : Controller
    {
        private readonly ITicketRepository _ticketRepository;

        public TicketController(ITicketRepository ticketRepository)
        {
            _ticketRepository = ticketRepository;
        }

        /// <summary>
        /// Get all tickets
        /// </summary>
        /// <returns></returns>
        [HttpGet, MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(List<TicketResponse>))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> GetTickets()
        {
            string? username = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            var tickets = await _ticketRepository.GetTickets();
            return Ok(tickets);
        }

        /// <summary>
        /// Get ticket by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}"), MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(TicketResponse))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> GetTicketById(int id)
        {
            var ticket = await _ticketRepository.GetTicketById(id);
            return Ok(ticket);
        }

        /// <summary>
        /// Create new ticket
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [AuthorizeMenu("Tickets")]
        [HttpPost, MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(BasicResponse))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> CreateTicket(CreateTicketRequest request)
        {
            await _ticketRepository.CreateTicket(request);
            return Ok(new BasicResponse { Success = true, Message = string.Format(ResourcesUtils.GetResponseMessage("ElementAdded"), ResourcesUtils.GetResponseMessage("Ticket")) });
        }


        /// <summary>
        /// Reply a ticket
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [AuthorizeMenu("Tickets")]
        [HttpPost("reply"), MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(BasicResponse))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> ReplyTicket(CreateTicketRequest request)
        {
            await _ticketRepository.ReplyTicket(request);
            return Ok(new BasicResponse { Success = true, Message = string.Format(ResourcesUtils.GetResponseMessage("TicketReply"), ResourcesUtils.GetResponseMessage("Ticket")) });
        }

        /// <summary>
        /// Update ticket
        /// </summary>
        /// <param name="id"></param>
        /// <param name="request"></param>
        /// <returns></returns>
        [AuthorizeMenu("Tickets")]
        [HttpPut("{id}"), MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(BasicResponse))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> UpdateTicket(int id, UpdateTicketRequest request)
        {
            await _ticketRepository.UpdateTicket(id, request);
            return Ok(new BasicResponse { Success = true, Message = string.Format(ResourcesUtils.GetResponseMessage("ElementUpdated"), ResourcesUtils.GetResponseMessage("Ticket")) });
        }

        /// <summary>
        /// Delete ticket
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [AuthorizeRole(PermissionLevel.Administrator)]
        [AuthorizeMenu("Tickets")]
        [HttpDelete("{id}"), MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(BasicResponse))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> DeleteTicketById(int id)
        {
            await _ticketRepository.DeleteTicketById(id);
            return Ok(new BasicResponse { Success = true, Message = string.Format(ResourcesUtils.GetResponseMessage("ElementDeleted"), ResourcesUtils.GetResponseMessage("Ticket")) });
        }
    }
}
