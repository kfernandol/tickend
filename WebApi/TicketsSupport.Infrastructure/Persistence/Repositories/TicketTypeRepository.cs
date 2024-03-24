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

        public async Task<List<TicketTypeResponse>> GetTicketType()
        {
            return await _context.TicketTypes.Where(x => x.Active == true)
                                             .Select(x => _mapper.Map<TicketTypeResponse>(x))
                                             .ToListAsync();
        }

        public async Task<TicketTypeResponse> GetTicketTypeById(int id)
        {
            var ticketType = await _context.TicketTypes.Where(x => x.Active == true).FirstOrDefaultAsync(x => x.Id == id);

            if (ticketType != null)
                return _mapper.Map<TicketTypeResponse>(ticketType);

            throw new NotFoundException(ExceptionMessage.NotFound("Ticket Type", $"{id}"));
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
