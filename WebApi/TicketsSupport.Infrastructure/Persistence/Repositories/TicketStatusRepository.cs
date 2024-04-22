using AutoMapper;
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

        public TicketStatusRepository(TS_DatabaseContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<TicketStatusResponse> CreateTicketStatus(CreateTicketStatusRequest request)
        {
            var ticketStatus = _mapper.Map<TicketStatus>(request);
            ticketStatus.Active = true;

            this._context.TicketStatuses.Add(ticketStatus);
            await this._context.SaveChangesAsync();

            return this._mapper.Map<TicketStatusResponse>(ticketStatus);
        }

        public async Task DeleteTicketStatusById(int id)
        {
            var ticketStatus = this._context.TicketStatuses.Find(id);
            if (ticketStatus != null)
            {
                ticketStatus.Active = false;

                this._context.Update(ticketStatus);
                await this._context.SaveChangesAsync();
            }
            else
                throw new NotFoundException(ExceptionMessage.NotFound("Ticket Status", $"{id}"));
        }

        public async Task<List<TicketStatusResponse>> GetTicketStatus(string? username)
        {
            User? user = await _context.Users.Include(x => x.RolNavigation)
                                             .FirstOrDefaultAsync(x => x.Username == username);

            List<TicketStatus>? result = new List<TicketStatus>();
            if (user?.RolNavigation?.PermissionLevel == PermissionLevel.Administrator)
            {
                result = await _context.ProjectXticketStatuses.Include(x => x.TicketStatus)
                                                                   .Include(x => x.Project)
                                                                       .ThenInclude(x => x.ProjectXclients)
                                                                       .ThenInclude(x => x.Client)
                                                                   .Include(x => x.Project)
                                                                       .ThenInclude(x => x.ProjectXdevelopers)
                                                                       .ThenInclude(x => x.Developer)
                                                                    .Select(x => x.TicketStatus)
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
                                                                    .Where(x => x.Project.ProjectXclients.Any(c => c.Client.Username == username) ||
                                                                                x.Project.ProjectXdevelopers.Any(d => d.Developer.Username == username))
                                                                    .Select(x => x.TicketStatus)
                                                                    .ToListAsync();
            }

            result = result.Where(x => x.Active == true).DistinctBy(x => x.Id).ToList();

            if (result != null)
                return _mapper.Map<List<TicketStatusResponse>>(result);

            throw new NotFoundException(ExceptionMessage.NotFound("Ticket Status", $"{username}"));
        }

        public async Task<TicketStatusResponse> GetTicketStatusById(int id)
        {
            var ticketStatus = await _context.TicketStatuses.Where(x => x.Active == true).FirstOrDefaultAsync(x => x.Id == id);

            if (ticketStatus != null)
                return this._mapper.Map<TicketStatusResponse>(ticketStatus);

            throw new NotFoundException(ExceptionMessage.NotFound("Ticket Status", $"{id}"));
        }

        public async Task<List<TicketStatusResponse>> GetTicketStatusByProject(int projectId)
        {
            var ticketType = await _context.Projects.Include(x => x.ProjectXticketStatuses)
                                                             .ThenInclude(x => x.TicketStatus)
                                                         .Where(x => x.Id == projectId &&
                                                                     x.ProjectXticketStatuses.Any(p => p.TicketStatus.Active))
                                                         .SelectMany(x => x.ProjectXticketStatuses
                                                             .Where(p => p.TicketStatus.Active)
                                                             .Select(p => p.TicketStatus))
                                                         .ToListAsync();

            if (ticketType != null)
                return this._mapper.Map<List<TicketStatusResponse>>(ticketType);

            throw new NotFoundException(ExceptionMessage.NotFound("Ticket TicketType by Project", $"{projectId}"));
        }

        public async Task<TicketStatusResponse> UpdateTicketStatus(int id, UpdateTicketStatusRequest request)
        {
            var ticketStatus = this._context.TicketStatuses.FirstOrDefault(x => x.Id == id && x.Active == true);
            if (ticketStatus != null)
            {
                ticketStatus.Name = request.Name;
                ticketStatus.Color = request.Color;
                ticketStatus.Active = true;

                this._context.TicketStatuses.Update(ticketStatus);
                await this._context.SaveChangesAsync();

                return this._mapper.Map<TicketStatusResponse>(ticketStatus);
            }

            throw new NotFoundException(ExceptionMessage.NotFound("Ticket Status", $"{id}"));
        }
    }
}
