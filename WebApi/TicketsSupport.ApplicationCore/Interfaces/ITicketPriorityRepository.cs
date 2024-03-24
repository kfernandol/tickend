using TicketsSupport.ApplicationCore.DTOs;

namespace TicketsSupport.ApplicationCore.Interfaces
{
    public interface ITicketPriorityRepository
    {
        Task<List<TicketPriorityResponse>> GetTicketPriority();
        Task<TicketPriorityResponse> GetTicketPriorityById(int id);
        Task DeleteTicketPriorityById(int id);
        Task<TicketPriorityResponse> CreateTicketPriority(CreateTicketPriorityRequest request);
        Task<TicketPriorityResponse> UpdateTicketPriority(int id, UpdateTicketPriorityRequest request);
    }
}
