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
    public class TicketPriorityRepository : ITicketPriorityRepository
    {
        private readonly TS_DatabaseContext _context;
        private readonly IMapper _mapper;
        private int UserIdRequest;
        private int OrganizationId;

        public TicketPriorityRepository(TS_DatabaseContext context, IMapper mapper, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _mapper = mapper;

            //Get UserId
            string? userIdTxt = httpContextAccessor.HttpContext?.User.Claims.FirstOrDefault(x => x.Type == "id")?.Value;
            int.TryParse(userIdTxt, out UserIdRequest);
            //Get OrganizationId
            string? organizationIdTxt = httpContextAccessor.HttpContext?.User.Claims.FirstOrDefault(x => x.Type == "organization")?.Value;
            if (!string.IsNullOrWhiteSpace(organizationIdTxt))
                OrganizationId = int.Parse(organizationIdTxt);
        }
        public async Task<TicketPriorityResponse> CreateTicketPriority(CreateTicketPriorityRequest request)
        {
            var ticketPriority = _mapper.Map<TicketPriority>(request);
            ticketPriority.OrganizationId = OrganizationId;
            ticketPriority.Active = true;

            this._context.TicketPriorities.Add(ticketPriority);
            await this._context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Created);

            return this._mapper.Map<TicketPriorityResponse>(ticketPriority);
        }

        public async Task DeleteTicketPriorityById(int id)
        {
            var ticketPriority = await _context.TicketPriorities.FirstOrDefaultAsync(x => x.Id == id && x.OrganizationId == OrganizationId);
            if (ticketPriority != null)
            {
                ticketPriority.Active = false;

                this._context.Update(ticketPriority);
                await this._context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Delete);
            }
            else
                throw new NotFoundException(ExceptionMessage.NotFound("Ticket Priority", $"{id}"));
        }

        public async Task<List<TicketPriorityResponse>> GetTicketPriority(string? username)
        {
            User? user = await _context.Users.Include(x => x.RolXusers)
                                             .ThenInclude(x => x.Rol)
                                             .AsNoTracking()
                                             .FirstOrDefaultAsync(x => x.Username == username && x.RolXusers.Any(x => x.Rol.OrganizationId == OrganizationId));

            List<TicketPriority>? result = new List<TicketPriority>();
            if (user?.RolXusers.FirstOrDefault(x => x.Rol.OrganizationId == OrganizationId)?.Rol?.PermissionLevel == PermissionLevel.Administrator)
            {
                result = await _context.TicketPriorities.AsNoTracking()
                                                        .Where(x => x.OrganizationId == OrganizationId)
                                                        .ToListAsync();
            }
            else
            {
                result = await _context.ProjectXticketPriorities.Include(x => x.TicketPriority)
                                                                    .Include(x => x.Project)
                                                                        .ThenInclude(x => x.ProjectXclients)
                                                                        .ThenInclude(x => x.Client)
                                                                    .Include(x => x.Project)
                                                                        .ThenInclude(x => x.ProjectXdevelopers)
                                                                        .ThenInclude(x => x.Developer)
                                                                    .Where(x => x.TicketPriority.OrganizationId == OrganizationId &&
                                                                                (x.Project.ProjectXclients.Any(c => c.Client.Username == username) ||
                                                                                x.Project.ProjectXdevelopers.Any(d => d.Developer.Username == username)))
                                                                    .Select(x => x.TicketPriority)
                                                                    .AsNoTracking()
                                                                    .AsSplitQuery()
                                                                    .ToListAsync();
            }

            result = result.Where(x => x.Active == true).DistinctBy(x => x.Id).ToList();

            if (result != null)
                return _mapper.Map<List<TicketPriorityResponse>>(result);

            throw new NotFoundException(ExceptionMessage.NotFound("Ticket Priority by username", $"{username}"));
        }

        public async Task<TicketPriorityResponse> GetTicketPriorityById(int id)
        {
            var ticketPriority = this._context.TicketPriorities.AsNoTracking()
                                                               .FirstOrDefault(x => x.Id == id &&
                                                                                    x.OrganizationId == OrganizationId &&
                                                                                    x.Active == true);

            if (ticketPriority != null)
                return this._mapper.Map<TicketPriorityResponse>(ticketPriority);

            throw new NotFoundException(ExceptionMessage.NotFound("Ticket Priority", $"{id}"));
        }

        public async Task<List<TicketPriorityResponse>> GetTicketPriorityByProject(int projectId)
        {
            var ticketPriorities = await _context.Projects.Include(x => x.ProjectXticketPriorities)
                                                             .ThenInclude(x => x.TicketPriority)
                                                         .Where(x => x.Id == projectId &&
                                                                     x.ProjectXticketPriorities.Any(p => p.TicketPriority.Active == true && p.TicketPriority.OrganizationId == OrganizationId))
                                                         .SelectMany(x => x.ProjectXticketPriorities
                                                             .Select(p => p.TicketPriority))
                                                         .AsNoTracking()
                                                         .AsSplitQuery()
                                                         .ToListAsync();


            if (ticketPriorities != null)
                return this._mapper.Map<List<TicketPriorityResponse>>(ticketPriorities);

            throw new NotFoundException(ExceptionMessage.NotFound("Ticket Priority by Project", $"{projectId}"));
        }

        public async Task<TicketPriorityResponse> UpdateTicketPriority(int id, UpdateTicketPriorityRequest request)
        {
            var ticketPriority = this._context.TicketPriorities.FirstOrDefault(x => x.Id == id &&
                                                                                    x.OrganizationId == OrganizationId &&
                                                                                    x.Active == true);
            if (ticketPriority != null)
            {
                ticketPriority.Name = request.Name;
                ticketPriority.Color = request.Color;
                ticketPriority.Active = true;

                this._context.TicketPriorities.Update(ticketPriority);
                await this._context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Modified);

                return this._mapper.Map<TicketPriorityResponse>(ticketPriority);
            }

            throw new NotFoundException(ExceptionMessage.NotFound("Ticket Priority", $"{id}"));
        }
    }
}
