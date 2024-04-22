using TicketsSupport.ApplicationCore.DTOs;

namespace TicketsSupport.ApplicationCore.Interfaces
{
    public interface ITicketPriorityRepository
    {
        Task<List<TicketPriorityResponse>> GetTicketPriority(string? username);
        Task<TicketPriorityResponse> GetTicketPriorityById(int id);
        Task<List<TicketPriorityResponse>> GetTicketPriorityByProject(int projectId);
        Task DeleteTicketPriorityById(int id);
        Task<TicketPriorityResponse> CreateTicketPriority(CreateTicketPriorityRequest request);
        Task<TicketPriorityResponse> UpdateTicketPriority(int id, UpdateTicketPriorityRequest request);
    }
}
