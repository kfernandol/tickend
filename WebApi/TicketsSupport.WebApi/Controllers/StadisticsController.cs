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
            var ticketsTotal = await _stadisticsRepository.GetTotalTickets();
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
            var ticketsPending = await _stadisticsRepository.GetPendingTickets();
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
            var openTickets = await _stadisticsRepository.GetOpenTickets();
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
            var closedTickets = await _stadisticsRepository.GetClosedTickets();
            return Ok(closedTickets);
        }


        /// <summary>
        /// gets the total number of projects assigned
        /// </summary>
        /// <returns></returns>
        [HttpGet("projects/total/"), MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(int))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> GetProjectsAssigned()
        {
            var projects = await _stadisticsRepository.GetProjectsAssigned();
            return Ok(projects);
        }

        /// <summary>
        /// gets the avg ticket closed time
        /// </summary>
        /// <returns></returns>
        [HttpGet("tickets/closed-average/"), MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(double))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> GetTicketAvgClosed()
        {
            var ticketAvgClosed = await _stadisticsRepository.GetTicketAvgClosed();
            return Ok(ticketAvgClosed);
        }

        /// <summary>
        /// gets the avg ticket rating time
        /// </summary>
        /// <returns></returns>
        [HttpGet("tickets/rating-average/"), MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(double))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> GetTicketAvgRating()
        {
            var ticketAvgRating = await _stadisticsRepository.GetTicketAvgRating();
            return Ok(ticketAvgRating);
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
            var chartData = await _stadisticsRepository.GetStatusTicketsChart();
            return Ok(chartData);
        }

        /// <summary>
        /// gets the data for the ticket chart by month and by project
        /// </summary>
        /// <returns></returns>
        [HttpGet("tickets/month-chart/"), MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(List<ChartData>))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> GetTicketsByMonthChart()
        {
            var chartDatas = await _stadisticsRepository.GetTicketsByMonthChart();
            return Ok(chartDatas);
        }

        /// <summary>
        /// gets the data for the ticket closed chart by month and by project
        /// </summary>
        /// <returns></returns>
        [HttpGet("tickets/closed-month-chart/"), MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(List<ChartData>))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> GetStatusTicketsClosedChart()
        {
            var chartClosedMont = await _stadisticsRepository.GetStatusTicketsClosedChart();
            return Ok(chartClosedMont);
        }

        /// <summary>
        /// gets the data of the last created tickets
        /// </summary>
        /// <returns></returns>
        [HttpGet("tickets/last-created/"), MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(List<TicketResponse>))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> GetLastTicketsCreated()
        {
            var ticketResponses = await _stadisticsRepository.GetLastTicketsCreated();
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
            var ticketsByProjects = await _stadisticsRepository.GetTicketsByProject();
            return Ok(ticketsByProjects);
        }
    }
}
