using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using TicketsSupport.ApplicationCore.DTOs;
using TicketsSupport.ApplicationCore.Entities;
using TicketsSupport.ApplicationCore.Exceptions;
using TicketsSupport.ApplicationCore.Interfaces;
using TicketsSupport.ApplicationCore.Utils;
using TicketsSupport.Infrastructure.Persistence.Contexts;

namespace TicketsSupport.Infrastructure.Persistence.Repositories
{
    public class ProjectRepository : IProjectRepository
    {
        private readonly TS_DatabaseContext _context;
        private readonly IMapper _mapper;
        private int UserIdRequest;
        private int? OrganizationId = null;

        public ProjectRepository(TS_DatabaseContext context, IMapper mapper, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _mapper = mapper;

            //Get UserId
            string? userIdTxt = httpContextAccessor.HttpContext?.User.Claims.FirstOrDefault(x => x.Type == "id")?.Value;
            int.TryParse(userIdTxt, out UserIdRequest);
            //Get OrganizationId
            string? organizationIdTxt = httpContextAccessor.HttpContext?.User.Claims.FirstOrDefault(x => x.Type == "organization")?.Value;
            if (!string.IsNullOrWhiteSpace(organizationIdTxt))
                OrganizationId = int.Parse(organizationIdTxt);
        }

        public async Task<ProjectResponse> CreateProject(CreateProjectRequest request)
        {
            var project = _mapper.Map<Project>(request);
            project.OrganizationId = (int)OrganizationId;

            //Save Photo
            if (!string.IsNullOrEmpty(request.Photo))
                project.Photo = request.Photo;

            project.Active = true;

            this._context.Projects.Add(project);
            await this._context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Created);

            //Add Tickets Type
            if (request.TicketTypes != null)
            {
                foreach (var TicketStatusId in request.TicketTypes)
                {
                    var ticketType = new ProjectXticketType
                    {
                        ProjectId = project.Id,
                        TicketTypeId = TicketStatusId
                    };

                    _context.ProjectXticketTypes.Add(ticketType);
                    await _context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Created);
                }
            }


            //Add Tickets Priorities
            if (request.TicketPriorities != null)
            {
                foreach (var TicketPriorityId in request.TicketPriorities)
                {
                    var ticketPriority = new ProjectXticketPriority
                    {
                        ProjectId = project.Id,
                        TicketPriorityId = TicketPriorityId
                    };

                    _context.ProjectXticketPriorities.Add(ticketPriority);
                    await _context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Created);
                }
            }


            //Add Tickets Status
            if (request.TicketStatus != null)
            {
                foreach (var TicketStatusId in request.TicketStatus)
                {
                    var ticketStatus = new ProjectXticketStatus
                    {
                        ProjectId = project.Id,
                        TicketStatusId = TicketStatusId
                    };

                    _context.ProjectXticketStatuses.Add(ticketStatus);
                    await _context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Created);
                }
            }


            //Add Clients
            if (request.Clients != null)
            {
                foreach (var ClientsId in request.Clients)
                {
                    var projectXclient = new ProjectXclient
                    {
                        ProjectId = project.Id,
                        ClientId = ClientsId
                    };

                    _context.ProjectXclients.Add(projectXclient);
                    await _context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Created);
                }
            }


            //Add Developer
            if (request.Developers != null)
            {
                foreach (var DeveloperId in request.Developers)
                {
                    var projectXDeveloper = new ProjectXdeveloper
                    {
                        ProjectId = project.Id,
                        DeveloperId = DeveloperId
                    };

                    _context.ProjectXdevelopers.Add(projectXDeveloper);
                    await _context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Created);
                }
            }


            return this._mapper.Map<ProjectResponse>(project);
        }

        public async Task DeleteProjectById(int id)
        {
            var project = await this._context.Projects.Include(x => x.ProjectXclients)
                                                      .Include(x => x.ProjectXticketPriorities)
                                                      .Include(x => x.ProjectXticketTypes)
                                                      .Include(x => x.ProjectXticketStatuses)
                                                      .Include(x => x.ProjectXdevelopers)
                                                      .FirstOrDefaultAsync(x => x.Id == id && x.OrganizationId == (int)OrganizationId);
            if (project != null)
            {
                project.Active = false;

                this._context.Update(project);
                await this._context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Delete);
            }
            else
                throw new NotFoundException(ExceptionMessage.NotFound("Project", $"{id}"));
        }

        public async Task<ProjectResponse> GetProjectById(int id)
        {
            var project = this._context.Projects.Include(x => x.ProjectXclients)
                                                .Include(x => x.ProjectXticketPriorities)
                                                .Include(x => x.ProjectXticketTypes)
                                                .Include(x => x.ProjectXticketStatuses)
                                                .Include(x => x.ProjectXdevelopers)
                                                .Where(x => x.Active == true && x.Id == id && x.OrganizationId == (int)OrganizationId)
                                                .Select(x => this._mapper.Map<ProjectResponse>(x))
                                                .AsNoTracking()
                                                .AsSplitQuery()
                                                .FirstOrDefault();

            if (project != null)
                return project;

            throw new NotFoundException(ExceptionMessage.NotFound("Project", $"{id}"));
        }

        public async Task<List<ProjectResponse>> GetProjects(string? username)
        {
            User? user = await _context.Users.Include(x => x.RolXusers)
                                             .ThenInclude(x => x.Rol)
                                             .AsNoTracking()
                                             .FirstOrDefaultAsync(x => x.Username == username);

            List<Project>? result = new List<Project>();
            if (user?.RolXusers.FirstOrDefault(x => x.Rol.OrganizationId == OrganizationId)?.Rol?.PermissionLevel == PermissionLevel.Administrator)
            {
                result = await _context.Projects.Include(x => x.ProjectXclients)
                                                .Include(x => x.ProjectXticketPriorities)
                                                .Include(x => x.ProjectXticketTypes)
                                                .Include(x => x.ProjectXticketStatuses)
                                                .Include(x => x.ProjectXdevelopers)
                                                .Where(x => x.Active == true && x.OrganizationId == (int)OrganizationId)
                                                .AsNoTracking()
                                                .AsSplitQuery()
                                                .ToListAsync();


            }
            else
            {
                result = await _context.Projects.Include(x => x.ProjectXclients)
                                                    .ThenInclude(x => x.Client)
                                                .Include(x => x.ProjectXticketPriorities)
                                                .Include(x => x.ProjectXticketTypes)
                                                .Include(x => x.ProjectXticketStatuses)
                                                .Include(x => x.ProjectXdevelopers)
                                                    .ThenInclude(x => x.Developer)
                                                .Where(x => x.Active == true &&
                                                            (x.ProjectXclients.Any(c => c.Client.Username == username) ||
                                                              x.ProjectXdevelopers.Any(d => d.Developer.Username == username) ||
                                                              x.OrganizationId == (int)OrganizationId))
                                                .AsNoTracking()
                                                .AsSplitQuery()
                                                .ToListAsync();
            }

            result = result.DistinctBy(x => x.Id).ToList();

            if (result != null)
                return _mapper.Map<List<ProjectResponse>>(result);

            throw new NotFoundException(ExceptionMessage.NotFound("Ticket Priority by username", $"{username}"));
        }

        public async Task<ProjectResponse> UpdateProject(int id, UpdateProjectRequest request)
        {
            var project = await _context.Projects.FirstOrDefaultAsync(x => x.Id == id && x.OrganizationId == (int)OrganizationId);
            project.Description = request.Description;

            if (project == null)
                throw new NotFoundException(ExceptionMessage.NotFound("Project"));

            //Update Photo
            if (!string.IsNullOrWhiteSpace(request.Photo))
                project.Photo = request.Photo;

            //Delete all Tickets Types
            var TicketsType = await _context.ProjectXticketTypes.Where(x => x.ProjectId == project.Id).ToListAsync();
            _context.ProjectXticketTypes.RemoveRange(TicketsType);
            await _context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Delete);

            foreach (var TicketStatusId in request.TicketTypes)
            {
                var ticketType = new ProjectXticketType
                {
                    ProjectId = project.Id,
                    TicketTypeId = TicketStatusId
                };

                _context.ProjectXticketTypes.Add(ticketType);
                await _context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Created);
            }

            //Delete all Tickets Priorities
            var TicketsPriorities = await _context.ProjectXticketPriorities.Where(x => x.ProjectId == project.Id).ToListAsync();
            _context.ProjectXticketPriorities.RemoveRange(TicketsPriorities);
            await _context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Delete);

            //Add Tickets Priorities
            foreach (var TicketPriorityId in request.TicketPriorities)
            {
                var ticketPriority = new ProjectXticketPriority
                {
                    ProjectId = project.Id,
                    TicketPriorityId = TicketPriorityId
                };

                _context.ProjectXticketPriorities.Add(ticketPriority);
                await _context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Created);
            }

            //Delete Tickets Status
            var TicketsStatus = await _context.ProjectXticketStatuses.Where(x => x.ProjectId == project.Id).ToListAsync();
            _context.ProjectXticketStatuses.RemoveRange(TicketsStatus);
            await _context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Delete);

            //Add Tickets Status
            foreach (var TicketStatusId in request.TicketStatus)
            {
                var ticketStatus = new ProjectXticketStatus
                {
                    ProjectId = project.Id,
                    TicketStatusId = TicketStatusId
                };

                _context.ProjectXticketStatuses.Add(ticketStatus);
                await _context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Created);
            }

            //Delete clients
            var Clients = await _context.ProjectXclients.Where(x => x.ProjectId == project.Id).ToListAsync();
            _context.ProjectXclients.RemoveRange(Clients);
            await _context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Delete);

            //Add Clients
            foreach (var ClientsId in request.Clients)
            {
                var projectXclient = new ProjectXclient
                {
                    ProjectId = project.Id,
                    ClientId = ClientsId
                };

                _context.ProjectXclients.Add(projectXclient);
                await _context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Created);
            }

            //remove Developers
            var Developers = await _context.ProjectXdevelopers.Where(x => x.ProjectId == project.Id).ToListAsync();
            _context.ProjectXdevelopers.RemoveRange(Developers);
            await _context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Delete);

            //Add Developer
            foreach (var DeveloperId in request.Developers)
            {
                var projectXDeveloper = new ProjectXdeveloper
                {
                    ProjectId = project.Id,
                    DeveloperId = DeveloperId
                };

                _context.ProjectXdevelopers.Add(projectXDeveloper);
                await _context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Created);
            }

            return this._mapper.Map<ProjectResponse>(project);
        }
    }
}
