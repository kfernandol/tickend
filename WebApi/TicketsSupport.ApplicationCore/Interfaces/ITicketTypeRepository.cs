using TicketsSupport.ApplicationCore.DTOs;

namespace TicketsSupport.ApplicationCore.Interfaces
{
    public interface ITicketTypeRepository
    {
        Task<List<TicketTypeResponse>> GetTicketType();
        Task<TicketTypeResponse> GetTicketTypeById(int id);
        Task DeleteTicketTypeById(int id);
        Task<TicketTypeResponse> CreateTicketType(CreateTicketTypeRequest request);
        Task<TicketTypeResponse> UpdateTicketType(int id, UpdateTicketTypeRequest request);
    }
}
