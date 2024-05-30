using TicketsSupport.ApplicationCore.DTOs;
using TicketsSupport.ApplicationCore.Models;

namespace TicketsSupport.ApplicationCore.Interfaces
{
    public interface IStadisticsRepository
    {
        Task<int> GetTotalTickets();
        Task<int> GetClosedTickets();
        Task<int> GetOpenTickets();
        Task<int> GetPendingTickets();
        Task<double> GetTicketAvgClosed();
        Task<int> GetProjectsAssigned();
        Task<List<ChartData>> GetStatusTicketsClosedChart();
        Task<ChartData> GetStatusTicketsChart();
        Task<List<ChartData>> GetTicketsByMonthChart();
        Task<List<TicketResponse>> GetLastTicketsCreated();
        Task<List<TicketsByProjectResponse>> GetTicketsByProject();
    }
}
