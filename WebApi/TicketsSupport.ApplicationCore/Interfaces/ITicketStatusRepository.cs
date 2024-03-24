using TicketsSupport.ApplicationCore.DTOs;

namespace TicketsSupport.ApplicationCore.Interfaces
{
    public interface ITicketStatusRepository
    {
        Task<List<TicketStatusResponse>> GetTicketStatus();
        Task<TicketStatusResponse> GetTicketStatusById(int id);
        Task DeleteTicketStatusById(int id);
        Task<TicketStatusResponse> CreateTicketStatus(CreateTicketStatusRequest request);
        Task<TicketStatusResponse> UpdateTicketStatus(int id, UpdateTicketStatusRequest request);
    }
}
