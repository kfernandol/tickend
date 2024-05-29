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
    public class TicketTypeRepository : ITicketTypeRepository
    {
        private readonly TS_DatabaseContext _context;
        private readonly IMapper _mapper;
        private int UserIdRequest;
        private int OrganizationId;

        public TicketTypeRepository(TS_DatabaseContext context, IMapper mapper, IHttpContextAccessor httpContextAccessor)
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

        public async Task<TicketTypeResponse> CreateTicketType(CreateTicketTypeRequest request)
        {
            var ticketType = _mapper.Map<TicketType>(request);
            ticketType.OrganizationId = OrganizationId;
            ticketType.Active = true;

            _context.TicketTypes.Add(ticketType);
            await _context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Created);

            return _mapper.Map<TicketTypeResponse>(ticketType);
        }

        public async Task DeleteTicketTypeById(int id)
        {
            var ticketType = await _context.TicketTypes.FirstOrDefaultAsync(x => x.Id == id && x.OrganizationId == OrganizationId);
            if (ticketType != null)
            {
                ticketType.Active = false;

                _context.Update(ticketType);
                await _context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Delete);
            }
            else
                throw new NotFoundException(ExceptionMessage.NotFound("Ticket Type", $"{id}"));
        }

        public async Task<List<TicketTypeResponse>> GetTicketType(string? username)
        {
            User? user = await _context.Users.Include(x => x.RolXusers)
                                             .ThenInclude(x => x.Rol)
                                             .AsNoTracking()
                                             .FirstOrDefaultAsync(x => x.Username == username && x.RolXusers.Any(x => x.Rol.OrganizationId == OrganizationId));

            List<TicketType>? result = new List<TicketType>();
            if (user?.RolXusers?.FirstOrDefault(x => x.Rol.OrganizationId == OrganizationId)?.Rol?.PermissionLevel == PermissionLevel.Administrator)
            {
                result = await _context.TicketTypes.AsNoTracking()
                                                   .Where(x => x.OrganizationId == OrganizationId)
                                                   .ToListAsync();
            }
            else
            {
                result = await _context.ProjectXticketTypes.Include(x => x.TicketType)
                                                                    .Include(x => x.Project)
                                                                        .ThenInclude(x => x.ProjectXclients)
                                                                        .ThenInclude(x => x.Client)
                                                                    .Include(x => x.Project)
                                                                        .ThenInclude(x => x.ProjectXdevelopers)
                                                                        .ThenInclude(x => x.Developer)
                                                                    .Where(x =>
                                                                                x.TicketType.OrganizationId == OrganizationId &&
                                                                                (x.Project.ProjectXclients.Any(c => c.Client.Username == username) ||
                                                                                x.Project.ProjectXdevelopers.Any(d => d.Developer.Username == username)))
                                                                    .Select(x => x.TicketType)
                                                                    .AsNoTracking()
                                                                    .AsSplitQuery()
                                                                    .ToListAsync();
            }

            result = result.Where(x => x.Active == true).DistinctBy(x => x.Id).ToList();

            if (result != null)
                return _mapper.Map<List<TicketTypeResponse>>(result);

            throw new NotFoundException(ExceptionMessage.NotFound("Ticket Type by username", $"{username}"));
        }

        public async Task<TicketTypeResponse> GetTicketTypeById(int id)
        {
            var ticketType = await _context.TicketTypes.Where(x => x.Active == true)
                                                       .AsNoTracking()
                                                       .FirstOrDefaultAsync(x => x.Id == id && x.OrganizationId == OrganizationId);

            if (ticketType != null)
                return _mapper.Map<TicketTypeResponse>(ticketType);

            throw new NotFoundException(ExceptionMessage.NotFound("Ticket Type", $"{id}"));
        }

        public async Task<List<TicketTypeResponse>> GetTicketTypeByProject(int projectId)
        {
            var ticketType = await _context.Projects.Include(x => x.ProjectXticketTypes)
                                                             .ThenInclude(x => x.TicketType)
                                                         .Where(x => x.Id == projectId &&
                                                                     x.ProjectXticketTypes.Any(p => p.TicketType.Active == true && p.TicketType.OrganizationId == OrganizationId))
                                                         .SelectMany(x => x.ProjectXticketTypes
                                                             .Select(p => p.TicketType))
                                                         .AsNoTracking()
                                                         .AsSplitQuery()
                                                         .ToListAsync();

            if (ticketType != null)
                return this._mapper.Map<List<TicketTypeResponse>>(ticketType);

            throw new NotFoundException(ExceptionMessage.NotFound("Ticket TicketType by Project", $"{projectId}"));
        }

        public async Task<TicketTypeResponse> UpdateTicketType(int id, UpdateTicketTypeRequest request)
        {
            var ticketType = await _context.TicketTypes.FirstOrDefaultAsync(x => x.Id == id && x.OrganizationId == OrganizationId && x.Active == true);
            if (ticketType != null)
            {
                ticketType.Name = request.Name;
                ticketType.Icon = request.Icon;
                ticketType.IconColor = request.IconColor;
                ticketType.Active = true;

                this._context.TicketTypes.Update(ticketType);
                await this._context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Modified);

                return this._mapper.Map<TicketTypeResponse>(ticketType);
            }

            throw new NotFoundException(ExceptionMessage.NotFound("Ticket Type", $"{id}"));
        }
    }
}
