using TicketsSupport.ApplicationCore.DTOs;

namespace TicketsSupport.ApplicationCore.Interfaces
{
    public interface IProjectRepository
    {
        Task<List<ProjectResponse>> GetProjects(string username);
        Task<ProjectResponse> GetProjectById(int id);
        Task DeleteProjectById(int id);
        Task<ProjectResponse> CreateProject(CreateProjectRequest request);
        Task<ProjectResponse> UpdateProject(int id, UpdateProjectRequest request);
    }
}
