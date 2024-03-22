using TicketsSupport.ApplicationCore.DTOs;

namespace TicketsSupport.ApplicationCore.Interfaces
{
    public interface IMenuRepository
    {
        Task<List<MenuResponse>> GetMenus();
        Task<MenuResponse> GetMenusById(int id);
        Task<List<MenuResponse>> GetMenusByUser(int userId);
        Task DeleteMenuById(int id);
        Task<MenuResponse> CreateMenu(CreateMenuRequest request);
        Task<MenuResponse> UpdateMenu(int id, UpdateMenuRequest request);
    }
}
