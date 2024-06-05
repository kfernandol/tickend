using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using TicketsSupport.ApplicationCore.DTOs;
using TicketsSupport.ApplicationCore.Entities;
using TicketsSupport.ApplicationCore.Exceptions;
using TicketsSupport.ApplicationCore.Interfaces;
using TicketsSupport.ApplicationCore.Utils;
using TicketsSupport.Infrastructure.Persistence.Contexts;

namespace TicketsSupport.Infrastructure.Persistence.Repositories
{
    public class TicketStatusRepository : ITicketStatusRepository
    {
        private readonly TS_DatabaseContext _context;
        private readonly IMapper _mapper;
        private int UserIdRequest;
        private int OrganizationId;

        public TicketStatusRepository(TS_DatabaseContext context, IMapper mapper, IHttpContextAccessor httpContextAccessor)
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

        public async Task<TicketStatusResponse> CreateTicketStatus(CreateTicketStatusRequest request)
        {
            var ticketStatus = _mapper.Map<TicketStatus>(request);
            ticketStatus.OrganizationId = OrganizationId;
            ticketStatus.Active = true;

            this._context.TicketStatuses.Add(ticketStatus);
            await this._context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Created);

            return this._mapper.Map<TicketStatusResponse>(ticketStatus);
        }

        public async Task DeleteTicketStatusById(int id)
        {
            var ticketStatus = await _context.TicketStatuses.FirstOrDefaultAsync(x => x.Id == id && x.OrganizationId == OrganizationId);
            if (ticketStatus != null)
            {
                ticketStatus.Active = false;

                this._context.Update(ticketStatus);
                await this._context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Delete);
            }
            else
                throw new NotFoundException(ExceptionMessage.NotFound("Ticket Status", $"{id}"));
        }

        public async Task<List<TicketStatusResponse>> GetTicketStatus(string? username)
        {
            User? user = await _context.Users.Include(x => x.RolXusers)
                                             .ThenInclude(x => x.Rol)
                                             .AsNoTracking()
                                             .FirstOrDefaultAsync(x => x.Username == username && x.RolXusers.Any(x => x.Rol.OrganizationId == OrganizationId));

            List<TicketStatus>? result = new List<TicketStatus>();
            if (user?.RolXusers.FirstOrDefault(x => x.Rol.OrganizationId == OrganizationId)?.Rol?.PermissionLevel == PermissionLevel.Administrator)
            {
                result = await _context.TicketStatuses.AsNoTracking()
                                                      .Where(x => x.Active == true && x.OrganizationId == OrganizationId)
                                                      .ToListAsync();
            }
            else
            {
                result = await _context.ProjectXticketStatuses.Include(x => x.TicketStatus)
                                                                    .Include(x => x.Project)
                                                                        .ThenInclude(x => x.ProjectXclients)
                                                                        .ThenInclude(x => x.Client)
                                                                    .Include(x => x.Project)
                                                                        .ThenInclude(x => x.ProjectXdevelopers)
                                                                        .ThenInclude(x => x.Developer)
                                                                    .Where(x => x.TicketStatus.OrganizationId == OrganizationId &&
                                                                                (x.Project.ProjectXclients.Any(c => c.Client.Username == username) ||
                                                                                x.Project.ProjectXdevelopers.Any(d => d.Developer.Username == username)))
                                                                    .Select(x => x.TicketStatus)
                                                                    .AsNoTracking()
                                                                    .AsSplitQuery()
                                                                    .ToListAsync();
            }

            result = result.Where(x => x.Active == true).DistinctBy(x => x.Id).ToList();

            if (result != null)
                return _mapper.Map<List<TicketStatusResponse>>(result);

            throw new NotFoundException(ExceptionMessage.NotFound("Ticket Status", $"{username}"));
        }

        public async Task<TicketStatusResponse> GetTicketStatusById(int id)
        {
            var ticketStatus = await _context.TicketStatuses.AsNoTracking()
                                                            .FirstOrDefaultAsync(x => x.Id == id && x.Active == true && x.OrganizationId == OrganizationId);

            if (ticketStatus != null)
                return this._mapper.Map<TicketStatusResponse>(ticketStatus);

            throw new NotFoundException(ExceptionMessage.NotFound("Ticket Status", $"{id}"));
        }

        public async Task<List<TicketStatusResponse>> GetTicketStatusByProject(int projectId)
        {
            var ticketType = await _context.Projects.Include(x => x.ProjectXticketStatuses)
                                                        .ThenInclude(x => x.TicketStatus)
                                                    .Where(x => x.Id == projectId &&
                                                                x.ProjectXticketStatuses.Any(p => p.TicketStatus.Active == true && p.TicketStatus.OrganizationId == OrganizationId))
                                                    .SelectMany(x => x.ProjectXticketStatuses
                                                        .Select(p => p.TicketStatus))
                                                    .AsNoTracking()
                                                    .AsSplitQuery()
                                                    .ToListAsync();

            if (ticketType != null)
                return this._mapper.Map<List<TicketStatusResponse>>(ticketType);

            throw new NotFoundException(ExceptionMessage.NotFound("Ticket TicketType by Project", $"{projectId}"));
        }

        public async Task<TicketStatusResponse> UpdateTicketStatus(int id, UpdateTicketStatusRequest request)
        {
            var ticketStatus = this._context.TicketStatuses.FirstOrDefault(x => x.Id == id &&
                                                                                x.OrganizationId == OrganizationId &&
                                                                                x.Active == true);
            if (ticketStatus != null)
            {
                ticketStatus.Name = request.Name;
                ticketStatus.Color = request.Color;
                ticketStatus.Active = true;

                this._context.TicketStatuses.Update(ticketStatus);
                await this._context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Modified);

                return this._mapper.Map<TicketStatusResponse>(ticketStatus);
            }

            throw new NotFoundException(ExceptionMessage.NotFound("Ticket Status", $"{id}"));
        }
    }
}
