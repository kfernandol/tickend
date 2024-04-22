using TicketsSupport.ApplicationCore.DTOs;

namespace TicketsSupport.ApplicationCore.Interfaces
{
    public interface ITicketTypeRepository
    {
        Task<List<TicketTypeResponse>> GetTicketType(string? username);
        Task<TicketTypeResponse> GetTicketTypeById(int id);
        Task<List<TicketTypeResponse>> GetTicketTypeByProject(int projectId);
        Task DeleteTicketTypeById(int id);
        Task<TicketTypeResponse> CreateTicketType(CreateTicketTypeRequest request);
        Task<TicketTypeResponse> UpdateTicketType(int id, UpdateTicketTypeRequest request);
    }
}
