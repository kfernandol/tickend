using TicketsSupport.ApplicationCore.DTOs;
using TicketsSupport.ApplicationCore.Models;

namespace TicketsSupport.ApplicationCore.Interfaces
{
    public interface IStadisticsRepository
    {
        Task<int> GetTotalTickets(string? username);
        Task<int> GetClosedTickets(string? username);
        Task<int> GetOpenTickets(string? username);
        Task<int> GetPendingTickets(string? username);
        Task<ChartData> GetStatusTicketsChart(string? username);
        Task<List<ChartData>> GetTicketsByMonthChart(string? username);
        Task<List<TicketResponse>> GetLastTicketsCreated(string? username);
        Task<List<TicketsByProjectResponse>> GetTicketsByProject(string? username);
    }
}
