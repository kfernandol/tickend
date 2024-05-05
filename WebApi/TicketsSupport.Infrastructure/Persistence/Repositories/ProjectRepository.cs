using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
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

        public ProjectRepository(TS_DatabaseContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ProjectResponse> CreateProject(CreateProjectRequest request)
        {
            var project = _mapper.Map<Project>(request);

            //Save Photo
            if (request.Photo != null)
            {
                using (var ms = new MemoryStream())
                {
                    await request.Photo.CopyToAsync(ms);
                    var fileBytes = ms.ToArray();
                    project.Photo = fileBytes;
                }
            }

            project.Active = true;

            this._context.Projects.Add(project);
            await this._context.SaveChangesAsync();

            //Add Tickets Type
            if (!string.IsNullOrWhiteSpace(request.TicketTypesJson))
            {
                List<int>? TicketTypes = JsonSerializer.Deserialize<List<int>>(request.TicketTypesJson);
                foreach (var TicketStatusId in TicketTypes)
                {
                    var ticketType = new ProjectXticketType
                    {
                        ProjectId = project.Id,
                        TicketTypeId = TicketStatusId
                    };

                    _context.ProjectXticketTypes.Add(ticketType);
                    await _context.SaveChangesAsync();
                }
            }


            //Add Tickets Priorities
            if (!string.IsNullOrWhiteSpace(request.TicketPrioritiesJson))
            {
                List<int>? TicketPriorities = JsonSerializer.Deserialize<List<int>>(request.TicketPrioritiesJson);
                foreach (var TicketPriorityId in TicketPriorities)
                {
                    var ticketPriority = new ProjectXticketPriority
                    {
                        ProjectId = project.Id,
                        TicketPriorityId = TicketPriorityId
                    };

                    _context.ProjectXticketPriorities.Add(ticketPriority);
                    await _context.SaveChangesAsync();
                }
            }


            //Add Tickets Status
            if (!string.IsNullOrWhiteSpace(request.TicketStatusJson))
            {
                List<int>? TicketStatus = JsonSerializer.Deserialize<List<int>>(request.TicketStatusJson);
                foreach (var TicketStatusId in TicketStatus)
                {
                    var ticketStatus = new ProjectXticketStatus
                    {
                        ProjectId = project.Id,
                        TicketStatusId = TicketStatusId
                    };

                    _context.ProjectXticketStatuses.Add(ticketStatus);
                    await _context.SaveChangesAsync();
                }
            }


            //Add Clients
            if (!string.IsNullOrWhiteSpace(request.ClientsJson))
            {
                List<int>? Clients = JsonSerializer.Deserialize<List<int>>(request.ClientsJson);
                foreach (var ClientsId in Clients)
                {
                    var projectXclient = new ProjectXclient
                    {
                        ProjectId = project.Id,
                        ClientId = ClientsId
                    };

                    _context.ProjectXclients.Add(projectXclient);
                    await _context.SaveChangesAsync();
                }
            }


            //Add Developer
            if (!string.IsNullOrWhiteSpace(request.DevelopersJson))
            {
                List<int> Developers = JsonSerializer.Deserialize<List<int>>(request.DevelopersJson);
                foreach (var DeveloperId in Developers)
                {
                    var projectXDeveloper = new ProjectXdeveloper
                    {
                        ProjectId = project.Id,
                        DeveloperId = DeveloperId
                    };

                    _context.ProjectXdevelopers.Add(projectXDeveloper);
                    await _context.SaveChangesAsync();
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
                                                      .FirstOrDefaultAsync(x => x.Id == id);
            if (project != null)
            {
                project.Active = false;

                this._context.Update(project);
                await this._context.SaveChangesAsync();
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
                                                .Where(x => x.Active == true && x.Id == id)
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
            User? user = await _context.Users.Include(x => x.RolNavigation)
                                             .AsNoTracking()
                                             .FirstOrDefaultAsync(x => x.Username == username);

            List<Project>? result = new List<Project>();
            if (user?.RolNavigation?.PermissionLevel == PermissionLevel.Administrator)
            {
                result = await _context.Projects.Include(x => x.ProjectXclients)
                                                .Include(x => x.ProjectXticketPriorities)
                                                .Include(x => x.ProjectXticketTypes)
                                                .Include(x => x.ProjectXticketStatuses)
                                                .Include(x => x.ProjectXdevelopers)
                                                .Where(x => x.Active == true)
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
                                                            (x.ProjectXclients.Any(c => c.Client.Username == username) || x.ProjectXdevelopers.Any(d => d.Developer.Username == username)))
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
            var project = _context.Projects.Find(id);

            if (project == null)
                throw new NotFoundException(ExceptionMessage.NotFound("Project"));

            //Update Photo
            if (request.Photo != null)
            {
                using (var ms = new MemoryStream())
                {
                    await request.Photo.CopyToAsync(ms);
                    var fileBytes = ms.ToArray();
                    project.Photo = fileBytes;
                }
            }


            //Delete all Tickets Types
            var TicketsType = await _context.ProjectXticketTypes.Where(x => x.ProjectId == project.Id).ToListAsync();
            _context.ProjectXticketTypes.RemoveRange(TicketsType);
            await _context.SaveChangesAsync();

            //Add Tickets Type
            List<int> TicketTypes = JsonSerializer.Deserialize<List<int>>(request.TicketTypesJson);

            foreach (var TicketStatusId in TicketTypes)
            {
                var ticketType = new ProjectXticketType
                {
                    ProjectId = project.Id,
                    TicketTypeId = TicketStatusId
                };

                _context.ProjectXticketTypes.Add(ticketType);
                await _context.SaveChangesAsync();
            }

            //Delete all Tickets Priorities
            var TicketsPriorities = await _context.ProjectXticketPriorities.Where(x => x.ProjectId == project.Id).ToListAsync();
            _context.ProjectXticketPriorities.RemoveRange(TicketsPriorities);
            await _context.SaveChangesAsync();

            //Add Tickets Priorities
            List<int> TicketPriorities = JsonSerializer.Deserialize<List<int>>(request.TicketPrioritiesJson);
            foreach (var TicketPriorityId in TicketPriorities)
            {
                var ticketPriority = new ProjectXticketPriority
                {
                    ProjectId = project.Id,
                    TicketPriorityId = TicketPriorityId
                };

                _context.ProjectXticketPriorities.Add(ticketPriority);
                await _context.SaveChangesAsync();
            }

            //Delete Tickets Status
            var TicketsStatus = await _context.ProjectXticketStatuses.Where(x => x.ProjectId == project.Id).ToListAsync();
            _context.ProjectXticketStatuses.RemoveRange(TicketsStatus);
            await _context.SaveChangesAsync();

            //Add Tickets Status
            List<int> TicketStatus = JsonSerializer.Deserialize<List<int>>(request.TicketStatusJson);
            foreach (var TicketStatusId in TicketStatus)
            {
                var ticketStatus = new ProjectXticketStatus
                {
                    ProjectId = project.Id,
                    TicketStatusId = TicketStatusId
                };

                _context.ProjectXticketStatuses.Add(ticketStatus);
                await _context.SaveChangesAsync();
            }

            //Delete clients
            var Clients = await _context.ProjectXclients.Where(x => x.ProjectId == project.Id).ToListAsync();
            _context.ProjectXclients.RemoveRange(Clients);
            await _context.SaveChangesAsync();

            //Add Clients
            List<int> clients = JsonSerializer.Deserialize<List<int>>(request.ClientsJson);
            foreach (var ClientsId in clients)
            {
                var projectXclient = new ProjectXclient
                {
                    ProjectId = project.Id,
                    ClientId = ClientsId
                };

                _context.ProjectXclients.Add(projectXclient);
                await _context.SaveChangesAsync();
            }

            //remove Developers
            var Developers = await _context.ProjectXdevelopers.Where(x => x.ProjectId == project.Id).ToListAsync();
            _context.ProjectXdevelopers.RemoveRange(Developers);
            await _context.SaveChangesAsync();

            //Add Developer
            List<int> developers = JsonSerializer.Deserialize<List<int>>(request.DevelopersJson);
            foreach (var DeveloperId in developers)
            {
                var projectXDeveloper = new ProjectXdeveloper
                {
                    ProjectId = project.Id,
                    DeveloperId = DeveloperId
                };

                _context.ProjectXdevelopers.Add(projectXDeveloper);
                await _context.SaveChangesAsync();
            }

            return this._mapper.Map<ProjectResponse>(project);
        }
    }
}
