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
    public class TicketTypeRepository : ITicketTypeRepository
    {
        private readonly TS_DatabaseContext _context;
        private readonly IMapper _mapper;

        public TicketTypeRepository(TS_DatabaseContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<TicketTypeResponse> CreateTicketType(CreateTicketTypeRequest request)
        {
            var ticketType = _mapper.Map<TicketType>(request);
            ticketType.Active = true;

            _context.TicketTypes.Add(ticketType);
            await _context.SaveChangesAsync();

            return _mapper.Map<TicketTypeResponse>(ticketType);
        }

        public async Task DeleteTicketTypeById(int id)
        {
            var ticketType = _context.TicketTypes.Find(id);
            if (ticketType != null)
            {
                ticketType.Active = false;

                _context.Update(ticketType);
                await _context.SaveChangesAsync();
            }
            else
                throw new NotFoundException(ExceptionMessage.NotFound("Ticket Type", $"{id}"));
        }

        public async Task<List<TicketTypeResponse>> GetTicketType(string? username)
        {
            User? user = await _context.Users.Include(x => x.RolNavigation)
                                             .AsNoTracking()
                                             .FirstOrDefaultAsync(x => x.Username == username);

            List<TicketType>? result = new List<TicketType>();
            if (user?.RolNavigation?.PermissionLevel == PermissionLevel.Administrator)
            {
                result = await _context.TicketTypes.AsNoTracking()
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
                                                                    .Where(x => x.Project.ProjectXclients.Any(c => c.Client.Username == username) ||
                                                                                x.Project.ProjectXdevelopers.Any(d => d.Developer.Username == username))
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
                                                       .FirstOrDefaultAsync(x => x.Id == id);

            if (ticketType != null)
                return _mapper.Map<TicketTypeResponse>(ticketType);

            throw new NotFoundException(ExceptionMessage.NotFound("Ticket Type", $"{id}"));
        }

        public async Task<List<TicketTypeResponse>> GetTicketTypeByProject(int projectId)
        {
            var ticketType = await _context.Projects.Include(x => x.ProjectXticketTypes)
                                                             .ThenInclude(x => x.TicketType)
                                                         .Where(x => x.Id == projectId &&
                                                                     x.ProjectXticketTypes.Any(p => p.TicketType.Active))
                                                         .SelectMany(x => x.ProjectXticketTypes
                                                             .Where(p => p.TicketType.Active)
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
            var ticketType = await _context.TicketTypes.FirstOrDefaultAsync(x => x.Id == id && x.Active == true);
            if (ticketType != null)
            {
                ticketType.Name = request.Name;
                ticketType.Icon = request.Icon;
                ticketType.IconColor = request.IconColor;
                ticketType.Active = true;

                this._context.TicketTypes.Update(ticketType);
                await this._context.SaveChangesAsync();

                return this._mapper.Map<TicketTypeResponse>(ticketType);
            }

            throw new NotFoundException(ExceptionMessage.NotFound("Ticket Type", $"{id}"));
        }
    }
}
