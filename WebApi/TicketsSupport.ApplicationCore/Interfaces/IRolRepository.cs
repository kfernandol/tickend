using TicketsSupport.ApplicationCore.DTOs;

namespace TicketsSupport.ApplicationCore.Interfaces
{
    public interface IRolRepository
    {
        Task<List<RolResponse>> GetRol();
        Task<RolResponse> GetRolById(int id);
        Task DeleteRolById(int id);
        Task<RolResponse> CreateRol(CreateRolRequest request);
        Task<RolResponse> UpdateRol(int id, UpdateRolRequest request);
        Task<List<PermissionLevelResponse>> GetPermissionLevels();
    }
}
