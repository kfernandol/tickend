using TicketsSupport.ApplicationCore.DTOs;

namespace TicketsSupport.ApplicationCore.Interfaces
{
    public interface ITicketStatusRepository
    {
        Task<List<TicketStatusResponse>> GetTicketStatus(string? username);
        Task<TicketStatusResponse> GetTicketStatusById(int id);
        Task<List<TicketStatusResponse>> GetTicketStatusByProject(int projectId);
        Task DeleteTicketStatusById(int id);
        Task<TicketStatusResponse> CreateTicketStatus(CreateTicketStatusRequest request);
        Task<TicketStatusResponse> UpdateTicketStatus(int id, UpdateTicketStatusRequest request);
    }
}
