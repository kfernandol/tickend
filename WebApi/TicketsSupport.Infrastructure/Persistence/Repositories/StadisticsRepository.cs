using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Net.Sockets;
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
        private int OrganizationId;

        public StadisticsRepository(TS_DatabaseContext context, IMapper mapper, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _mapper = mapper;

            //Get UserId
            string? userIdTxt = httpContextAccessor.HttpContext?.User.Claims.FirstOrDefault(x => x.Type == "id")?.Value;
            int.TryParse(userIdTxt, out UserIdRequest);
            //Get OrganizationId
            string? organizationIdTxt = httpContextAccessor.HttpContext?.User.Claims.FirstOrDefault(x => x.Type == "organization")?.Value;
            int.TryParse(organizationIdTxt, out OrganizationId);
        }

        public async Task<int> GetClosedTickets()
        {
            var user = await _context.Users.AsNoTracking()
                                           .Include(x => x.RolXusers)
                                           .ThenInclude(x => x.Rol)
                                           .FirstOrDefaultAsync(x => x.Id == UserIdRequest);

            if (user?.RolXusers.FirstOrDefault(x => x.Rol.OrganizationId == OrganizationId)?.Rol?.PermissionLevel == PermissionLevel.Administrator)
                return _context.Tickets.AsNoTracking().Where(x => x.IsClosed == true && x.OrganizationId == OrganizationId && x.Reply == null).Count();
            else
            {
                var tickets = await _context.Tickets.Where(x => x.Reply == null)
                                                    .Include(x => x.Project)
                                                    .ThenInclude(x => x.ProjectXclients)
                                                    .ThenInclude(x => x.Client)
                                                    .Include(x => x.Project)
                                                        .ThenInclude(x => x.ProjectXdevelopers)
                                                        .ThenInclude(x => x.Developer)
                                                    .Include(x => x.TicketStatus)
                                                    .Where(x => x.OrganizationId == OrganizationId &&
                                                                x.IsClosed == true &&
                                                                x.Project.ProjectXclients.Any(c => c.Client.Id == UserIdRequest) ||
                                                                x.Project.ProjectXdevelopers.Any(d => d.Developer.Id == UserIdRequest))
                                                    .AsNoTracking()
                                                    .AsSplitQuery()
                                                    .ToListAsync();

                return tickets.Count();
            }
        }

        public async Task<List<TicketResponse>> GetLastTicketsCreated()
        {
            var user = await _context.Users.AsNoTracking()
                                           .Include(x => x.RolXusers)
                                           .ThenInclude(x => x.Rol)
                                           .FirstOrDefaultAsync(x => x.Id == UserIdRequest);

            List<Ticket>? lastTickets = new List<Ticket>();
            if (user?.RolXusers.FirstOrDefault(x => x.Rol.OrganizationId == OrganizationId)?.Rol?.PermissionLevel == PermissionLevel.Administrator)
            {
                lastTickets = await _context.Tickets.OrderByDescending(x => x.DateCreated)
                                                    .Take(10)
                                                    .Where(x => x.Reply == null && x.OrganizationId == OrganizationId && x.Active == true)
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
                lastTickets = await _context.Tickets.Where(x => x.Reply == null)
                                                    .Include(x => x.Project)
                                                        .ThenInclude(x => x.ProjectXclients)
                                                        .ThenInclude(x => x.Client)
                                                    .Include(x => x.Project)
                                                        .ThenInclude(x => x.ProjectXdevelopers)
                                                        .ThenInclude(x => x.Developer)
                                                    .OrderByDescending(x => x.DateCreated)
                                                    .Take(10)
                                                    .Where(x => x.OrganizationId == OrganizationId &&
                                                                (x.Project.ProjectXclients.Any(c => c.Client.Id == UserIdRequest) ||
                                                                x.Project.ProjectXdevelopers.Any(d => d.Developer.Id == UserIdRequest) &&
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

        public async Task<int> GetOpenTickets()
        {
            var user = await _context.Users.AsNoTracking()
                                            .Include(x => x.RolXusers)
                                            .ThenInclude(x => x.Rol)
                                            .FirstOrDefaultAsync(x => x.Id == UserIdRequest);

            if (user?.RolXusers.FirstOrDefault(x => x.Rol.OrganizationId == OrganizationId)?.Rol?.PermissionLevel == PermissionLevel.Administrator)
                return _context.Tickets.AsNoTracking().Where(x => x.Reply == null && x.OrganizationId == OrganizationId && x.IsClosed == false).Count();
            else
            {
                var tickets = await _context.Tickets.Where(x => x.Reply == null)
                                                    .Include(x => x.Project)
                                                    .ThenInclude(x => x.ProjectXclients)
                                                    .ThenInclude(x => x.Client)
                                                    .Include(x => x.Project)
                                                        .ThenInclude(x => x.ProjectXdevelopers)
                                                        .ThenInclude(x => x.Developer)
                                                    .Include(x => x.TicketStatus)
                                                    .Where(x => x.OrganizationId == OrganizationId &&
                                                                x.IsClosed == false &&
                                                                x.Project.ProjectXclients.Any(c => c.Client.Id == UserIdRequest) ||
                                                                x.Project.ProjectXdevelopers.Any(d => d.Developer.Id == UserIdRequest))
                                                    .AsNoTracking()
                                                    .AsSplitQuery()
                                                    .ToListAsync();

                return tickets.Count();
            }
        }

        public async Task<int> GetPendingTickets()
        {
            var user = await _context.Users.AsNoTracking()
                                           .Include(x => x.RolXusers)
                                           .ThenInclude(x => x.Rol)
                                           .FirstOrDefaultAsync(x => x.Id == UserIdRequest);

            if (user?.RolXusers.FirstOrDefault(x => x.Rol.OrganizationId == OrganizationId)?.Rol?.PermissionLevel == PermissionLevel.Administrator)
                return _context.Tickets.AsNoTracking().Where(x => x.Reply == null && x.OrganizationId == OrganizationId && x.IsClosed == false && x.TicketPriorityId == null).Count();
            else
            {
                var tickets = await _context.Tickets.Where(x => x.Reply == null)
                                                    .Include(x => x.Project)
                                                    .ThenInclude(x => x.ProjectXclients)
                                                    .ThenInclude(x => x.Client)
                                                    .Include(x => x.Project)
                                                        .ThenInclude(x => x.ProjectXdevelopers)
                                                        .ThenInclude(x => x.Developer)
                                                    .Include(x => x.TicketStatus)
                                                    .Where(x => x.OrganizationId == OrganizationId &&
                                                                x.IsClosed == false &&
                                                                x.TicketPriorityId == null &&
                                                                x.Project.ProjectXclients.Any(c => c.Client.Id == UserIdRequest) ||
                                                                x.Project.ProjectXdevelopers.Any(d => d.Developer.Id == UserIdRequest))
                                                    .AsNoTracking()
                                                    .AsSplitQuery()
                                                    .ToListAsync();

                return tickets.Count();
            }
        }

        public async Task<int> GetProjectsAssigned()
        {

            var user = await _context.Users.AsNoTracking()
                                            .Include(x => x.RolXusers)
                                            .ThenInclude(x => x.Rol)
                                            .FirstOrDefaultAsync(x => x.Id == UserIdRequest);

            if (user?.RolXusers.FirstOrDefault(x => x.Rol.OrganizationId == OrganizationId)?.Rol?.PermissionLevel == PermissionLevel.Administrator)
            {
                return _context.Projects.AsNoTracking().Where(x => x.Active == true && x.OrganizationId == OrganizationId).Count();
            }
            else
            {
                return _context.Projects.Include(x => x.ProjectXclients)
                                            .ThenInclude(x => x.Client)
                                        .Include(x => x.ProjectXdevelopers)
                                            .ThenInclude(x => x.Developer)
                                        .Where(x => x.Active == true &&
                                                    x.OrganizationId == OrganizationId &&
                                                    (x.ProjectXclients.Any(c => c.ClientId == UserIdRequest) ||
                                                    x.ProjectXdevelopers.Any(d => d.DeveloperId == UserIdRequest)))
                                        .AsSplitQuery()
                                        .AsNoTracking()
                                        .Count();
            }
        }

        public async Task<ChartData> GetStatusTicketsChart()
        {
            var user = await _context.Users.AsNoTracking()
                                            .Include(x => x.RolXusers)
                                            .ThenInclude(x => x.Rol)
                                            .FirstOrDefaultAsync(x => x.Id == UserIdRequest);

            if (user?.RolXusers.FirstOrDefault(x => x.Rol.OrganizationId == OrganizationId)?.Rol?.PermissionLevel == PermissionLevel.Administrator)
            {
                ChartData ticketsStatusChart = new ChartData
                {
                    Labels = _context.Tickets
                        .Where(x => x.Reply == null && x.OrganizationId == OrganizationId && x.IsClosed == false)
                        .Select(t => t.TicketStatus != null ? t.TicketStatus.Name : null)
                        .Distinct()
                        .ToList(),
                    Data = _context.Tickets
                        .Where(x => x.Reply == null && x.OrganizationId == OrganizationId && x.IsClosed == false)
                        .GroupBy(t => t.TicketStatus.Name)
                        .Select(g => g.Count())
                        .ToList()
                };

                return ticketsStatusChart;
            }
            else
            {
                var tickets = await _context.Tickets.Where(x => x.Reply == null)
                                                    .Include(x => x.Project)
                                                    .ThenInclude(x => x.ProjectXclients)
                                                    .ThenInclude(x => x.Client)
                                                    .Include(x => x.Project)
                                                        .ThenInclude(x => x.ProjectXdevelopers)
                                                        .ThenInclude(x => x.Developer)
                                                    .Include(x => x.TicketStatus)
                                                    .Where(x => x.Project.Active == true &&
                                                                x.Reply == null &&
                                                                x.IsClosed == false &&
                                                                x.OrganizationId == OrganizationId &&
                                                               (x.Project.ProjectXclients.Any(c => c.Client.Id == UserIdRequest) ||
                                                                x.Project.ProjectXdevelopers.Any(d => d.Developer.Id == UserIdRequest)))
                                                    .AsNoTracking()
                                                    .AsSplitQuery()
                                                    .ToListAsync();

                ChartData ticketsStatusChart = new ChartData
                {
                    Labels = tickets
                      .Select(t => t.TicketStatus != null ? t.TicketStatus.Name : null)
                      .Distinct()
                      .ToList(),
                    Data = tickets
                      .GroupBy(t => t.TicketStatus?.Name)
                      .Select(g => g.Count())
                      .ToList()
                };

                return ticketsStatusChart;
            }
        }

        public async Task<List<ChartData>> GetStatusTicketsClosedChart()
        {
            var user = await _context.Users.AsNoTracking()
                                          .Include(x => x.RolXusers)
                                          .ThenInclude(x => x.Rol)
                                          .FirstOrDefaultAsync(x => x.Id == UserIdRequest);

            int currentMonth = DateTime.Now.Month;
            int currentYear = DateTime.Now.Year;

            if (user?.RolXusers.FirstOrDefault(x => x.Rol.OrganizationId == OrganizationId)?.Rol?.PermissionLevel == PermissionLevel.Administrator)
            {
                var projects = await _context.Projects.Include(x => x.ProjectXclients)
                                                      .Include(x => x.ProjectXticketPriorities)
                                                      .Include(x => x.ProjectXticketTypes)
                                                      .Include(x => x.ProjectXticketStatuses)
                                                      .Include(x => x.ProjectXdevelopers)
                                                      .Where(x => x.OrganizationId == OrganizationId && x.Active == true)
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
                            .Where(x => x.Reply == null && x.IsClosed == true)
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
                                                                x.OrganizationId == OrganizationId &&
                                                                (x.ProjectXclients.Any(c => c.Client.Id == UserIdRequest) ||
                                                                 x.ProjectXdevelopers.Any(d => d.Developer.Id == UserIdRequest)))
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
                            .Where(x => x.Reply == null && x.IsClosed == true)
                            .Count(t => t.ProjectId == project.Id && t.DateCreated.Month == month && t.DateCreated.Year == currentYear))
                        .ToList()
                })
                .ToList();

                return ticketsByMonth;
            }
        }

        public async Task<double> GetTicketAvgClosed()
        {
            var user = await _context.Users.AsNoTracking()
                                             .Include(x => x.RolXusers)
                                             .ThenInclude(x => x.Rol)
                                             .FirstOrDefaultAsync(x => x.Id == UserIdRequest);

            if (user?.RolXusers.FirstOrDefault(x => x.Rol.OrganizationId == OrganizationId)?.Rol?.PermissionLevel == PermissionLevel.Administrator)
            {
                var ticketsAssigned = await _context.Tickets.Where(x => x.DateClosed.HasValue && x.Active == true && x.OrganizationId == OrganizationId)
                                                            .Select(x => new
                                                            {
                                                                ClosedTime = (x.DateClosed.Value - x.DateCreated).TotalHours
                                                            })
                                                            .ToListAsync();
                if (ticketsAssigned.Any())
                    return ticketsAssigned.Select(x => x.ClosedTime).Average();

                return 0;
            }
            else
            {
                var ticketsAssigned = await _context.Tickets.Include(x => x.Project)
                                                .ThenInclude(x => x.ProjectXclients)
                                                .ThenInclude(x => x.Client)
                                             .Include(x => x.Project)
                                                .ThenInclude(x => x.ProjectXdevelopers)
                                                .ThenInclude(x => x.Developer)
                                             .Where(x => x.DateClosed.HasValue &&
                                                         x.Active == true &&
                                                         x.OrganizationId == OrganizationId &&
                                                         x.Project.Active == true &&
                                                        (x.Project.ProjectXclients.Any(c => c.Client.Id == UserIdRequest) ||
                                                         x.Project.ProjectXdevelopers.Any(d => d.Developer.Id == UserIdRequest)))
                                             .AsNoTracking()
                                             .AsSplitQuery()
                                             .Select(x => new
                                             {
                                                 ClosedTime = (x.DateClosed.Value - x.DateCreated).TotalHours
                                             })
                                             .ToListAsync();

                if (ticketsAssigned.Any())
                    return ticketsAssigned.Select(x => x.ClosedTime).Average();

                return 0;
            }
        }

        public async Task<List<ChartData>> GetTicketsByMonthChart()
        {
            var user = await _context.Users.AsNoTracking()
                                           .Include(x => x.RolXusers)
                                           .ThenInclude(x => x.Rol)
                                           .FirstOrDefaultAsync(x => x.Id == UserIdRequest);

            int currentMonth = DateTime.Now.Month;
            int currentYear = DateTime.Now.Year;

            if (user?.RolXusers.FirstOrDefault(x => x.Rol.OrganizationId == OrganizationId)?.Rol?.PermissionLevel == PermissionLevel.Administrator)
            {
                var projects = await _context.Projects.Include(x => x.ProjectXclients)
                                                      .Include(x => x.ProjectXticketPriorities)
                                                      .Include(x => x.ProjectXticketTypes)
                                                      .Include(x => x.ProjectXticketStatuses)
                                                      .Include(x => x.ProjectXdevelopers)
                                                      .Where(x => x.OrganizationId == OrganizationId && x.Active == true)
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
                            .Where(x => x.Reply == null)
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
                                                                x.OrganizationId == OrganizationId &&
                                                                (x.ProjectXclients.Any(c => c.Client.Id == UserIdRequest) ||
                                                                 x.ProjectXdevelopers.Any(d => d.Developer.Id == UserIdRequest)))
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
                            .Where(x => x.Reply == null)
                            .Count(t => t.ProjectId == project.Id && t.DateCreated.Month == month && t.DateCreated.Year == currentYear))
                        .ToList()
                })
                .ToList();

                return ticketsByMonth;
            }
        }

        public async Task<List<TicketsByProjectResponse>> GetTicketsByProject()
        {
            var user = await _context.Users.AsNoTracking()
                                            .Include(x => x.RolXusers)
                                            .ThenInclude(x => x.Rol)
                                            .FirstOrDefaultAsync(x => x.Id == UserIdRequest);

            if (user?.RolXusers.FirstOrDefault(x => x.Rol.OrganizationId == OrganizationId)?.Rol?.PermissionLevel == PermissionLevel.Administrator)
            {
                var TicketsByProjectResponse = await _context.Projects.Include(x => x.Tickets)
                                                                    .Where(x => x.Active == true && x.OrganizationId == OrganizationId && x.Tickets.Any(ticket => ticket.Active == true))
                                                                    .Select(x => new TicketsByProjectResponse
                                                                    {
                                                                        Project = _mapper.Map<ProjectResponse>(x),
                                                                        Total = x.Tickets.Where(x => x.Reply == null).Count(),
                                                                        Open = x.Tickets.Where(x => x.Reply == null && x.IsClosed == false).Count(),
                                                                        Closed = x.Tickets.Where(x => x.Reply == null && x.IsClosed == true).Count(),
                                                                        Pending = x.Tickets.Where(x => x.Reply == null && x.IsClosed == false && x.TicketPriorityId == null).Count()
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
                                                                                   x.OrganizationId == OrganizationId &&
                                                                                    x.ProjectXclients.Any(c => c.Client.Id == UserIdRequest ||
                                                                                    x.ProjectXdevelopers.Any(d => d.Developer.Id == UserIdRequest) &&
                                                                                    x.Tickets.Any(x => x.Reply == null && x.Active == true)))
                                                                       .Select(x => new TicketsByProjectResponse
                                                                       {
                                                                           Project = _mapper.Map<ProjectResponse>(x),
                                                                           Total = x.Tickets.Where(x => x.Reply == null).Count(),
                                                                           Open = x.Tickets.Where(x => x.Reply == null && x.IsClosed == false).Count(),
                                                                           Closed = x.Tickets.Where(x => x.Reply == null && x.IsClosed == true).Count(),
                                                                           Pending = x.Tickets.Where(x => x.Reply == null && x.IsClosed == false && x.TicketPriorityId == null).Count()
                                                                       })
                                                                       .AsNoTracking()
                                                                       .AsSplitQuery()
                                                                       .ToListAsync();

                return TicketsByProjectResponse;
            }
        }

        public async Task<int> GetTotalTickets()
        {
            var user = await _context.Users.AsNoTracking()
                                            .Include(x => x.RolXusers)
                                            .ThenInclude(x => x.Rol)
                                            .FirstOrDefaultAsync(x => x.Id == UserIdRequest);

            if (user?.RolXusers.FirstOrDefault(x => x.Rol.OrganizationId == OrganizationId)?.Rol?.PermissionLevel == PermissionLevel.Administrator)
                return _context.Tickets.AsNoTracking().Where(x => x.Reply == null && x.OrganizationId == OrganizationId && x.Active == true).Count();
            else
            {
                var tickets = await _context.Tickets.Include(x => x.Project)
                                                    .ThenInclude(x => x.ProjectXclients)
                                                    .ThenInclude(x => x.Client)
                                                    .Include(x => x.Project)
                                                        .ThenInclude(x => x.ProjectXdevelopers)
                                                        .ThenInclude(x => x.Developer)
                                                    .Include(x => x.TicketStatus)
                                                    .Where(x => x.OrganizationId == OrganizationId &&
                                                                x.Reply == null &&
                                                                x.Active == true &&
                                                                x.Project.ProjectXclients.Any(c => c.Client.Id == UserIdRequest) ||
                                                                x.Project.ProjectXdevelopers.Any(d => d.Developer.Id == UserIdRequest))
                                                    .AsNoTracking()
                                                    .AsSplitQuery()
                                                    .ToListAsync();
                return tickets.Count();
            }
        }

        public async Task<double> GetTicketAvgRating()
        {
            var user = await _context.Users.AsNoTracking()
                                             .Include(x => x.RolXusers)
                                             .ThenInclude(x => x.Rol)
                                             .FirstOrDefaultAsync(x => x.Id == UserIdRequest);

            if (user?.RolXusers.FirstOrDefault(x => x.Rol.OrganizationId == OrganizationId)?.Rol?.PermissionLevel == PermissionLevel.Administrator)
            {
                var ticketsAssigned = await _context.Tickets.Where(x => x.DateClosed.HasValue && x.Active == true && x.OrganizationId == OrganizationId)
                                                            .Select(x => new
                                                            {
                                                                Rating = (double)(x.Rating != null ? x.Rating : 0)
                                                            })
                                                            .ToListAsync();
                if (ticketsAssigned.Any())
                    return ticketsAssigned.Select(x => x.Rating).Average();

                return 0;
            }
            else
            {
                var ticketsAssigned = await _context.Tickets.Include(x => x.Project)
                                                .ThenInclude(x => x.ProjectXclients)
                                                .ThenInclude(x => x.Client)
                                             .Include(x => x.Project)
                                                .ThenInclude(x => x.ProjectXdevelopers)
                                                .ThenInclude(x => x.Developer)
                                             .Where(x => x.DateClosed.HasValue &&
                                                         x.Active == true &&
                                                         x.OrganizationId == OrganizationId &&
                                                         x.Project.Active == true &&
                                                        (x.Project.ProjectXclients.Any(c => c.Client.Id == UserIdRequest) ||
                                                         x.Project.ProjectXdevelopers.Any(d => d.Developer.Id == UserIdRequest)))
                                             .AsNoTracking()
                                             .AsSplitQuery()
                                             .Select(x => new
                                             {
                                                 Rating = (double)(x.Rating != null ? x.Rating : 0)
                                             })
                                             .ToListAsync();

                if (ticketsAssigned.Any())
                    return ticketsAssigned.Select(x => x.Rating).Average();

                return 0;
            }
        }
    }
}
