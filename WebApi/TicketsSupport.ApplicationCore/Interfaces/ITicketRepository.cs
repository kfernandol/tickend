using TicketsSupport.ApplicationCore.DTOs;

namespace TicketsSupport.ApplicationCore.Interfaces
{
    public interface ITicketRepository
    {
        Task<List<TicketResponse>> GetTickets();
        Task<TicketResponse> GetTicketById(int id);
        Task DeleteTicketById(int id);
        Task<TicketResponse> CreateTicket(CreateTicketRequest request);
        Task<TicketResponse> ReplyTicket(CreateTicketRequest request);
        Task<TicketResponse> UpdateTicket(int id, UpdateTicketRequest request);
    }
}
