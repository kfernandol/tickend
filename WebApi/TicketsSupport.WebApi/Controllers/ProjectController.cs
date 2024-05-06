using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using System.Security.Claims;
using TicketsSupport.ApplicationCore.Authorization.Menu;
using TicketsSupport.ApplicationCore.Authorization.Role;
using TicketsSupport.ApplicationCore.Commons;
using TicketsSupport.ApplicationCore.DTOs;
using TicketsSupport.ApplicationCore.Interfaces;
using TicketsSupport.ApplicationCore.Utils;
using TicketsSupport.Infrastructure.Persistence.Repositories;

namespace TicketsSupport.WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/projects/")]
    public class ProjectController : Controller
    {
        public readonly IProjectRepository _projectRepository;
        public ProjectController(IProjectRepository projectRepository)
        {
            _projectRepository = projectRepository;
        }

        /// <summary>
        /// Get all projects
        /// </summary>
        /// <returns></returns>
        [AuthorizeMenu("Projects")]
        [HttpGet, MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(List<ProjectResponse>))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> GetProjects()
        {
            string? username = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            var projects = await _projectRepository.GetProjects(username);
            return Ok(projects);
        }

        /// <summary>
        /// Get project by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [AuthorizeMenu("Projects")]
        [HttpGet("{id}"), MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(ProjectResponse))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> GetProjectById(int id)
        {
            var project = await _projectRepository.GetProjectById(id);
            return Ok(project);
        }

        /// <summary>
        /// Create new project
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [AuthorizeRole(PermissionLevel.Administrator)]
        [AuthorizeMenu("Projects")]
        [HttpPost, MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(BasicResponse))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> CreateProject(CreateProjectRequest request)
        {
            await _projectRepository.CreateProject(request);
            return Ok(new BasicResponse { Success = true, Message = string.Format(ResourcesUtils.GetResponseMessage("ElementAdded"), ResourcesUtils.GetResponseMessage("Project")) });
        }

        /// <summary>
        /// Update project
        /// </summary>
        /// <param name="id"></param>
        /// <param name="request"></param>
        /// <returns></returns>
        [AuthorizeRole(PermissionLevel.Administrator)]
        [AuthorizeMenu("Projects")]
        [HttpPut("{id}"), MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(BasicResponse))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> UpdateProject(int id, UpdateProjectRequest request)
        {
            await _projectRepository.UpdateProject(id, request);
            return Ok(new BasicResponse { Success = true, Message = string.Format(ResourcesUtils.GetResponseMessage("ElementUpdated"), ResourcesUtils.GetResponseMessage("Project")) });
        }

        /// <summary>
        /// Delete project
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [AuthorizeRole(PermissionLevel.Administrator)]
        [AuthorizeMenu("Projects")]
        [HttpDelete("{id}"), MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(BasicResponse))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> DeleteProjectById(int id)
        {
            await _projectRepository.DeleteProjectById(id);
            return Ok(new BasicResponse { Success = true, Message = string.Format(ResourcesUtils.GetResponseMessage("ElementDeleted"), ResourcesUtils.GetResponseMessage("Project")) });
        }
    }
}
