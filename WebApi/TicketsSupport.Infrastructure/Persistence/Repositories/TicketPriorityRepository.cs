using AutoMapper;
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

        public TicketPriorityRepository(TS_DatabaseContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<TicketPriorityResponse> CreateTicketPriority(CreateTicketPriorityRequest request)
        {
            var ticketPriority = _mapper.Map<TicketPriority>(request);
            ticketPriority.Active = true;

            this._context.TicketPriorities.Add(ticketPriority);
            await this._context.SaveChangesAsync();

            return this._mapper.Map<TicketPriorityResponse>(ticketPriority);
        }

        public async Task DeleteTicketPriorityById(int id)
        {
            var ticketPriority = this._context.TicketPriorities.Find(id);
            if (ticketPriority != null)
            {
                ticketPriority.Active = false;

                this._context.Update(ticketPriority);
                await this._context.SaveChangesAsync();
            }
            else
                throw new NotFoundException(ExceptionMessage.NotFound("Ticket Priority", $"{id}"));
        }

        public async Task<List<TicketPriorityResponse>> GetTicketPriority()
        {
            return this._context.TicketPriorities.Where(x => x.Active == true)
                                                .Select(x => this._mapper.Map<TicketPriorityResponse>(x))
                                                .ToList();
        }

        public async Task<TicketPriorityResponse> GetTicketPriorityById(int id)
        {
            var ticketPriority = this._context.TicketPriorities.Where(x => x.Active == true).FirstOrDefault(x => x.Id == id);

            if (ticketPriority != null)
                return this._mapper.Map<TicketPriorityResponse>(ticketPriority);

            throw new NotFoundException(ExceptionMessage.NotFound("Ticket Priority", $"{id}"));
        }

        public async Task<TicketPriorityResponse> UpdateTicketPriority(int id, UpdateTicketPriorityRequest request)
        {
            var ticketPriority = this._context.TicketPriorities.FirstOrDefault(x => x.Id == id && x.Active == true);
            if (ticketPriority != null)
            {
                ticketPriority.Name = request.Name;
                ticketPriority.Color = request.Color;
                ticketPriority.Active = true;

                this._context.TicketPriorities.Update(ticketPriority);
                await this._context.SaveChangesAsync();

                return this._mapper.Map<TicketPriorityResponse>(ticketPriority);
            }

            throw new NotFoundException(ExceptionMessage.NotFound("Ticket Priority", $"{id}"));
        }
    }
}
