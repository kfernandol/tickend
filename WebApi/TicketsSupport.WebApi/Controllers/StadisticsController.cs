using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using System.Security.Claims;
using TicketsSupport.ApplicationCore.Authorization.Menu;
using TicketsSupport.ApplicationCore.Commons;
using TicketsSupport.ApplicationCore.DTOs;
using TicketsSupport.ApplicationCore.Interfaces;
using TicketsSupport.ApplicationCore.Models;
using TicketsSupport.Infrastructure.Persistence.Repositories;

namespace TicketsSupport.WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/stadistics")]
    public class StadisticsController : Controller
    {
        private readonly IStadisticsRepository _stadisticsRepository;

        public StadisticsController(IStadisticsRepository stadisticsRepository)
        {
            _stadisticsRepository = stadisticsRepository;
        }

        /// <summary>
        /// gets the total number of tickets 
        /// </summary>
        /// <returns></returns>
        [HttpGet("tickets/total/"), MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(int))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> GetTotalTickets()
        {
            string? username = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            var ticketsTotal = await _stadisticsRepository.GetTotalTickets(username);
            return Ok(ticketsTotal);
        }

        /// <summary>
        /// gets the total number of outstanding tickets
        /// </summary>
        /// <returns></returns>
        [HttpGet("tickets/pending/"), MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(int))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> GetPendingTickets()
        {
            string? username = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            var ticketsPending = await _stadisticsRepository.GetPendingTickets(username);
            return Ok(ticketsPending);
        }

        /// <summary>
        /// gets the total number of open tickets
        /// </summary>
        /// <returns></returns>
        [HttpGet("tickets/open/"), MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(int))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> GetOpenTickets()
        {
            string? username = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            var openTickets = await _stadisticsRepository.GetOpenTickets(username);
            return Ok(openTickets);
        }

        /// <summary>
        /// gets the total number of closed tickets
        /// </summary>
        /// <returns></returns>
        [HttpGet("tickets/closed/"), MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(int))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> GetClosedTickets()
        {
            string? username = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            var closedTickets = await _stadisticsRepository.GetClosedTickets(username);
            return Ok(closedTickets);
        }

        /// <summary>
        /// gets the data for the ticket chart by state
        /// </summary>
        /// <returns></returns>
        [HttpGet("tickets/status-chart/"), MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(ChartData))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> GetStatusTicketsChart()
        {
            string? username = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            var chartData = await _stadisticsRepository.GetStatusTicketsChart(username);
            return Ok(chartData);
        }

        /// <summary>
        /// gets the data for the ticket chart by month and by project
        /// </summary>
        /// <returns></returns>
        [HttpGet("tickets/month-chart/"), MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(List<int>))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> GetTicketsByMonthChart()
        {
            string? username = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            var chartDatas = await _stadisticsRepository.GetTicketsByMonthChart(username);
            return Ok(chartDatas);
        }

        /// <summary>
        /// gets the data of the last created tickets
        /// </summary>
        /// <returns></returns>
        [HttpGet("tickets/last-created/"), MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(List<int>))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> GetLastTicketsCreated()
        {
            string? username = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            var ticketResponses = await _stadisticsRepository.GetLastTicketsCreated(username);
            return Ok(ticketResponses);
        }

        /// <summary>
        /// obtains ticket data by project
        /// </summary>
        /// <returns></returns>
        [HttpGet("tickets/byproject/"), MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(List<TicketsByProjectResponse>))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> GetTicketsByProject()
        {
            string? username = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            var ticketsByProjects = await _stadisticsRepository.GetTicketsByProject(username);
            return Ok(ticketsByProjects);
        }
    }
}
