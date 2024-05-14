using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using TicketsSupport.ApplicationCore.DTOs;
using TicketsSupport.ApplicationCore.Entities;
using TicketsSupport.ApplicationCore.Interfaces;
using TicketsSupport.ApplicationCore.Models;
using TicketsSupport.Infrastructure.Persistence.Contexts;

namespace TicketsSupport.Infrastructure.Persistence.Repositories
{
    public class StadisticsRepository : IStadisticsRepository
    {
        private readonly TS_DatabaseContext _context;
        private readonly IMapper _mapper;
        private int UserIdRequest;

        public StadisticsRepository(TS_DatabaseContext context, IMapper mapper, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _mapper = mapper;

            //Get UserId
            string? userIdTxt = httpContextAccessor.HttpContext?.User.Claims.FirstOrDefault(x => x.Type == "id")?.Value;
            int.TryParse(userIdTxt, out UserIdRequest);
        }

        public async Task<int> GetClosedTickets(string? username)
        {
            var user = await _context.Users.AsNoTracking()
                                           .Include(x => x.RolNavigation)
                                           .FirstOrDefaultAsync(x => x.Username == username);

            if (user?.RolNavigation?.PermissionLevel == PermissionLevel.Administrator)
                return _context.Tickets.AsNoTracking().Where(x => x.IsClosed == true).Count();
            else
            {
                var tickets = await _context.Tickets
                                                    .Include(x => x.Project)
                                                    .ThenInclude(x => x.ProjectXclients)
                                                    .ThenInclude(x => x.Client)
                                                    .Include(x => x.Project)
                                                        .ThenInclude(x => x.ProjectXdevelopers)
                                                        .ThenInclude(x => x.Developer)
                                                    .Include(x => x.TicketStatus)
                                                    .Where(x => x.Project.ProjectXclients.Any(c => c.Client.Username == username) ||
                                                                x.Project.ProjectXdevelopers.Any(d => d.Developer.Username == username))
                                                    .AsNoTracking()
                                                    .AsSplitQuery()
                                                    .ToListAsync();

                return tickets.Where(x => x.IsClosed == true).Count();
            }
        }

        public async Task<List<TicketResponse>> GetLastTicketsCreated(string? username)
        {
            var user = await _context.Users.AsNoTracking()
                                           .Include(x => x.RolNavigation)
                                           .FirstOrDefaultAsync(x => x.Username == username);

            List<Ticket>? lastTickets = new List<Ticket>();
            if (user?.RolNavigation?.PermissionLevel == PermissionLevel.Administrator)
            {
                lastTickets = await _context.Tickets.OrderByDescending(x => x.DateCreated)
                                                    .Take(10)
                                                    .Where(x => x.Active == true)
                                                    .Select(x => new Ticket
                                                    {
                                                        Id = x.Id,
                                                        Title = x.Title,
                                                        Description = "",
                                                        ProjectId = x.ProjectId,
                                                        TicketPriorityId = x.TicketPriorityId,
                                                        TicketStatusId = x.TicketStatusId,
                                                        TicketTypeId = x.TicketTypeId,
                                                        DateCreated = x.DateCreated,
                                                        DateUpdated = x.DateUpdated,
                                                        CreateBy = x.CreateBy,
                                                        IsClosed = x.IsClosed,
                                                    })
                                                    .AsNoTracking()
                                                    .ToListAsync();


            }
            else
            {
                lastTickets = await _context.Tickets.Include(x => x.Project)
                                                        .ThenInclude(x => x.ProjectXclients)
                                                        .ThenInclude(x => x.Client)
                                                    .Include(x => x.Project)
                                                        .ThenInclude(x => x.ProjectXdevelopers)
                                                        .ThenInclude(x => x.Developer)
                                                    .OrderByDescending(x => x.DateCreated)
                                                    .Take(10)
                                                    .Where(x => x.Project.ProjectXclients.Any(c => c.Client.Username == username) ||
                                                                x.Project.ProjectXdevelopers.Any(d => d.Developer.Username == username &&
                                                                x.Active == true))
                                                    .Select(x => new Ticket
                                                    {
                                                        Id = x.Id,
                                                        Title = x.Title,
                                                        Description = "",
                                                        ProjectId = x.ProjectId,
                                                        TicketPriorityId = x.TicketPriorityId,
                                                        TicketStatusId = x.TicketStatusId,
                                                        TicketTypeId = x.TicketTypeId,
                                                        DateCreated = x.DateCreated,
                                                        DateUpdated = x.DateUpdated,
                                                        CreateBy = x.CreateBy,
                                                        IsClosed = x.IsClosed,
                                                    })
                                                    .AsNoTracking()
                                                    .AsSplitQuery()
                                                    .ToListAsync();

            }

            lastTickets = lastTickets.DistinctBy(x => x.Id).ToList();
            return _mapper.Map<List<TicketResponse>>(lastTickets);
        }

        public async Task<int> GetOpenTickets(string? username)
        {
            var user = await _context.Users.AsNoTracking()
                                            .Include(x => x.RolNavigation)
                                            .FirstOrDefaultAsync(x => x.Username == username);

            if (user?.RolNavigation?.PermissionLevel == PermissionLevel.Administrator)
                return _context.Tickets.AsNoTracking().Where(x => x.IsClosed == false).Count();
            else
            {
                var tickets = await _context.Tickets
                                                    .Include(x => x.Project)
                                                    .ThenInclude(x => x.ProjectXclients)
                                                    .ThenInclude(x => x.Client)
                                                    .Include(x => x.Project)
                                                        .ThenInclude(x => x.ProjectXdevelopers)
                                                        .ThenInclude(x => x.Developer)
                                                    .Include(x => x.TicketStatus)
                                                    .Where(x => x.Project.ProjectXclients.Any(c => c.Client.Username == username) ||
                                                                x.Project.ProjectXdevelopers.Any(d => d.Developer.Username == username))
                                                    .AsNoTracking()
                                                    .AsSplitQuery()
                                                    .ToListAsync();

                return tickets.Where(x => x.IsClosed == false).Count();
            }
        }

        public async Task<int> GetPendingTickets(string? username)
        {
            var user = await _context.Users.AsNoTracking()
                                            .Include(x => x.RolNavigation)
                                            .FirstOrDefaultAsync(x => x.Username == username);

            if (user?.RolNavigation?.PermissionLevel == PermissionLevel.Administrator)
                return _context.Tickets.AsNoTracking().Where(x => x.IsClosed == false && x.TicketPriorityId == null).Count();
            else
            {
                var tickets = await _context.Tickets
                                                    .Include(x => x.Project)
                                                    .ThenInclude(x => x.ProjectXclients)
                                                    .ThenInclude(x => x.Client)
                                                    .Include(x => x.Project)
                                                        .ThenInclude(x => x.ProjectXdevelopers)
                                                        .ThenInclude(x => x.Developer)
                                                    .Include(x => x.TicketStatus)
                                                    .Where(x => x.Project.ProjectXclients.Any(c => c.Client.Username == username) ||
                                                                x.Project.ProjectXdevelopers.Any(d => d.Developer.Username == username))
                                                    .AsNoTracking()
                                                    .AsSplitQuery()
                                                    .ToListAsync();

                return tickets.Where(x => x.IsClosed == false && x.TicketPriorityId == null).Count();
            }
        }

        public async Task<ChartData> GetStatusTicketsChart(string? username)
        {
            var user = await _context.Users.AsNoTracking()
                                            .Include(x => x.RolNavigation)
                                            .FirstOrDefaultAsync(x => x.Username == username);

            if (user?.RolNavigation?.PermissionLevel == PermissionLevel.Administrator)
            {
                ChartData ticketsStatusChart = new ChartData
                {
                    Labels = _context.Tickets
                        .Where(x => x.IsClosed == false)
                        .Select(t => t.TicketStatus != null ? t.TicketStatus.Name : null)
                        .Distinct()
                        .ToList(),
                    Data = _context.Tickets
                        .Where(x => x.IsClosed == false)
                        .GroupBy(t => t.TicketStatus.Name)
                        .Select(g => g.Count())
                        .ToList()
                };

                return ticketsStatusChart;
            }
            else
            {
                var tickets = await _context.Tickets
                                                    .Include(x => x.Project)
                                                    .ThenInclude(x => x.ProjectXclients)
                                                    .ThenInclude(x => x.Client)
                                                    .Include(x => x.Project)
                                                        .ThenInclude(x => x.ProjectXdevelopers)
                                                        .ThenInclude(x => x.Developer)
                                                    .Include(x => x.TicketStatus)
                                                    .Where(x => x.Project.ProjectXclients.Any(c => c.Client.Username == username) ||
                                                                x.Project.ProjectXdevelopers.Any(d => d.Developer.Username == username))
                                                    .AsNoTracking()
                                                    .AsSplitQuery()
                                                    .ToListAsync();

                ChartData ticketsStatusChart = new ChartData
                {
                    Labels = tickets
                      .Where(x => x.IsClosed == false)
                      .Select(t => t.TicketStatus != null ? t.TicketStatus.Name : null)
                      .Distinct()
                      .ToList(),
                    Data = tickets
                      .Where(x => x.IsClosed == false)
                      .GroupBy(t => t.TicketStatus?.Name)
                      .Select(g => g.Count())
                      .ToList()
                };

                return ticketsStatusChart;
            }
        }

        public async Task<List<ChartData>> GetTicketsByMonthChart(string? username)
        {
            var user = await _context.Users.AsNoTracking()
                                           .Include(x => x.RolNavigation)
                                           .FirstOrDefaultAsync(x => x.Username == username);

            int currentMonth = DateTime.Now.Month;
            int currentYear = DateTime.Now.Year;

            if (user?.RolNavigation?.PermissionLevel == PermissionLevel.Administrator)
            {
                var projects = await _context.Projects.Include(x => x.ProjectXclients)
                                                      .Include(x => x.ProjectXticketPriorities)
                                                      .Include(x => x.ProjectXticketTypes)
                                                      .Include(x => x.ProjectXticketStatuses)
                                                      .Include(x => x.ProjectXdevelopers)
                                                      .Where(x => x.Active == true)
                                                      .AsNoTracking()
                                                      .AsSplitQuery()
                                                      .ToListAsync();

                projects = projects.DistinctBy(x => x.Id).ToList();

                List<ChartData> ticketsByMonth = projects.Select(project => new ChartData
                {
                    Name = project.Name,
                    Labels = Enumerable.Range(1, currentMonth).Select(month => month.ToString()).ToList(),
                    Data = Enumerable.Range(1, currentMonth)
                        .Select(month => _context.Tickets
                            .Count(t => t.ProjectId == project.Id && t.DateCreated.Month == month && t.DateCreated.Year == currentYear))
                        .ToList()
                })
                .ToList();

                return ticketsByMonth;
            }
            else
            {
                var projects = await _context.Projects.Include(x => x.ProjectXclients)
                                                    .ThenInclude(x => x.Client)
                                                    .Include(x => x.ProjectXticketPriorities)
                                                    .Include(x => x.ProjectXticketTypes)
                                                    .Include(x => x.ProjectXticketStatuses)
                                                    .Include(x => x.ProjectXdevelopers)
                                                        .ThenInclude(x => x.Developer)
                                                    .Where(x => x.Active == true &&
                                                                (x.ProjectXclients.Any(c => c.Client.Username == username) || x.ProjectXdevelopers.Any(d => d.Developer.Username == username)))
                                                    .AsNoTracking()
                                                    .AsSplitQuery()
                                                    .ToListAsync();

                projects = projects.DistinctBy(x => x.Id).ToList();

                List<ChartData> ticketsByMonth = projects.Select(project => new ChartData
                {
                    Name = project.Name,
                    Labels = Enumerable.Range(1, currentMonth).Select(month => month.ToString()).ToList(),
                    Data = Enumerable.Range(1, currentMonth)
                        .Select(month => _context.Tickets
                            .Count(t => t.ProjectId == project.Id && t.DateCreated.Month == month && t.DateCreated.Year == currentYear))
                        .ToList()
                })
                .ToList();

                return ticketsByMonth;
            }
        }

        public async Task<List<TicketsByProjectResponse>> GetTicketsByProject(string? username)
        {
            var user = await _context.Users.AsNoTracking()
                                            .Include(x => x.RolNavigation)
                                            .FirstOrDefaultAsync(x => x.Username == username);

            if (user?.RolNavigation?.PermissionLevel == PermissionLevel.Administrator)
            {
                var TicketsByProjectResponse = await _context.Projects.Include(x => x.Tickets)
                                                                    .Where(x => x.Active == true && x.Tickets.Any(ticket => ticket.Active == true))
                                                                    .Select(x => new TicketsByProjectResponse
                                                                    {
                                                                        Project = _mapper.Map<ProjectResponse>(x),
                                                                        Total = x.Tickets.Count(),
                                                                        Open = x.Tickets.Where(x => x.IsClosed == false).Count(),
                                                                        Closed = x.Tickets.Where(x => x.IsClosed == true).Count(),
                                                                        Pending = x.Tickets.Where(x => x.IsClosed == false && x.TicketPriorityId == null).Count()
                                                                    })
                                                                    .AsNoTracking()
                                                                    .ToListAsync();
                return TicketsByProjectResponse;
            }
            else
            {
                var TicketsByProjectResponse = await _context.Projects.Include(x => x.ProjectXclients)
                                                                           .ThenInclude(x => x.Client)
                                                                       .Include(x => x.ProjectXticketPriorities)
                                                                       .Include(x => x.ProjectXticketTypes)
                                                                       .Include(x => x.ProjectXticketStatuses)
                                                                       .Include(x => x.ProjectXdevelopers)
                                                                           .ThenInclude(x => x.Developer)
                                                                        .Include(x => x.Tickets)
                                                                       .Where(x => x.Active == true &&
                                                                                x.ProjectXclients.Any(c => c.Client.Username == username ||
                                                                                x.ProjectXdevelopers.Any(d => d.Developer.Username == username) &&
                                                                                x.Tickets.Any(x => x.Active == true)))
                                                                       .Select(x => new TicketsByProjectResponse
                                                                       {
                                                                           Project = _mapper.Map<ProjectResponse>(x),
                                                                           Total = x.Tickets.Count(),
                                                                           Open = x.Tickets.Where(x => x.IsClosed == false).Count(),
                                                                           Closed = x.Tickets.Where(x => x.IsClosed == true).Count(),
                                                                           Pending = x.Tickets.Where(x => x.IsClosed == false && x.TicketPriorityId == null).Count()
                                                                       })
                                                                       .AsNoTracking()
                                                                       .AsSplitQuery()
                                                                       .ToListAsync();

                return TicketsByProjectResponse;
            }
        }

        public async Task<int> GetTotalTickets(string? username)
        {
            var user = await _context.Users.AsNoTracking()
                                            .Include(x => x.RolNavigation)
                                            .FirstOrDefaultAsync(x => x.Username == username);

            if (user?.RolNavigation?.PermissionLevel == PermissionLevel.Administrator)
                return _context.Tickets.AsNoTracking().Count();
            else
            {
                var tickets = await _context.Tickets
                                                    .Include(x => x.Project)
                                                    .ThenInclude(x => x.ProjectXclients)
                                                    .ThenInclude(x => x.Client)
                                                    .Include(x => x.Project)
                                                        .ThenInclude(x => x.ProjectXdevelopers)
                                                        .ThenInclude(x => x.Developer)
                                                    .Include(x => x.TicketStatus)
                                                    .Where(x => x.Project.ProjectXclients.Any(c => c.Client.Username == username) ||
                                                                x.Project.ProjectXdevelopers.Any(d => d.Developer.Username == username))
                                                    .AsNoTracking()
                                                    .AsSplitQuery()
                                                    .ToListAsync();
                return tickets.Count();
            }
        }
    }
}
