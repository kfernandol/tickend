using TicketsSupport.ApplicationCore.DTOs;

namespace TicketsSupport.ApplicationCore.Interfaces
{
    public interface ITicketRepository
    {
        Task<List<TicketResponse>> GetTickets(string? username);
        Task<TicketResponse> GetTicketById(int id);
        Task DeleteTicketById(int id);
        Task<TicketResponse> CreateTicket(string? username, CreateTicketRequest request);
        Task<TicketResponse> UpdateTicket(int id, UpdateTicketRequest request);
    }
}
