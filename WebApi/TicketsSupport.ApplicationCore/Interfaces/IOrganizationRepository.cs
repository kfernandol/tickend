using TicketsSupport.ApplicationCore.DTOs;

namespace TicketsSupport.ApplicationCore.Interfaces
{
    public interface IOrganizationRepository
    {
        Task<List<OrganizationResponse>> GetOrganizations();
        Task<List<OrganizationResponse>> GetOrganizationsByUser(int userId);
        Task<OrganizationResponse> GetOrganizationsById(int Id);
        Task DeleteOrganizationById(int id);
        Task CreateOrganization(CreateOrganizationRequest request);
        Task UpdateOrganization(int id, UpdateOrganizationRequest request);
    }
}
