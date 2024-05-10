using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Serilog.Parsing;
using System.Collections.Generic;
using System.Web;
using TicketsSupport.ApplicationCore.Configuration;
using TicketsSupport.ApplicationCore.DTOs;
using TicketsSupport.ApplicationCore.Entities;
using TicketsSupport.ApplicationCore.Exceptions;
using TicketsSupport.ApplicationCore.Interfaces;
using TicketsSupport.ApplicationCore.Utils;
using TicketsSupport.Infrastructure.Persistence.Contexts;
using TicketsSupport.Infrastructure.Services.Email;

namespace TicketsSupport.Infrastructure.Persistence.Repositories
{
    public class TicketRepository : ITicketRepository
    {
        private readonly TS_DatabaseContext _context;
        private readonly IMapper _mapper;
        private readonly WebApp _webAppConfig;
        private readonly IEmailSender _emailSender;

        public TicketRepository(TS_DatabaseContext context, IMapper mapper, IEmailSender emailSender, IOptions<WebApp> webAppConfig)
        {
            _context = context;
            _mapper = mapper;
            _webAppConfig = webAppConfig.Value;
            _emailSender = emailSender;
        }

        public async Task<TicketResponse> CreateTicket(string? username, CreateTicketRequest request)
        {
            User? user = await _context.Users.Include(x => x.RolNavigation)
                                             .FirstOrDefaultAsync(x => x.Username == username);

            if (user != null)
            {
                var DateCreate = DateTime.Now;

                var ticket = _mapper.Map<Ticket>(request);
                ticket.CreateBy = user.Id;
                ticket.DateCreated = DateCreate;
                ticket.Active = true;
                this._context.Tickets.Add(ticket);
                await this._context.SaveChangesAsync();

                var TicketType = _context.TicketTypes.Find(ticket.TicketTypeId);
                var Project = await _context.Projects.Include(x => x.ProjectXclients)
                                                .ThenInclude(x => x.Client)
                                               .Include(x => x.ProjectXdevelopers)
                                                .ThenInclude(x => x.Developer)
                                               .Where(x => x.Id == ticket.ProjectId)
                                               .FirstOrDefaultAsync();

                var clients = Project.ProjectXclients.Where(x => x.Client.Active == true).Select(x => x.Client).ToList();

                //Send Email All Clients And Administrators
                foreach (var client in clients)
                {
                    var TicketViewLink = $"{_webAppConfig.Url}/Ticket/Edit/{ticket.Id}";
                    Dictionary<string, string> EmailData = new Dictionary<string, string>
                    {
                        {"FullName", $"{client.FirstName} {client.LastName}"},
                        {"TicketTitle", ticket.Title},
                        {"TicketCreateDate", DateCreate.ToString("dd/MM/yyyy")},
                        {"TicketProject", Project?.Name ?? string.Empty},
                        {"TicketType", TicketType?.Name ?? string.Empty},
                        {"CreateBy", $"{user.FirstName} {user.LastName}"},
                        {"ViewTicketLink", TicketViewLink},
                    };

                    if (client != null && client.Email != null)
                    {
                        await _emailSender.SendEmail(client.Email, ticket.Title, EmailTemplate.TicketCreate, EmailData);
                    }
                }

                var administrators = _context.Users.AsNoTracking()
                                                   .Include(x => x.RolNavigation)
                                                   .Where(x => x.RolNavigation.PermissionLevel == PermissionLevel.Administrator && x.Active == true)
                                                   .ToList();

                var devs = Project.ProjectXdevelopers.Where(x => x.Developer.Active == true).Select(x => x.Developer).ToList();
                var adminsAndDevs = administrators.Union(devs);

                //Send Email All Developers
                foreach (var Usr in adminsAndDevs)
                {
                    var TicketViewLink = $"{_webAppConfig.Url}/Ticket/Edit/{ticket.Id}";
                    Dictionary<string, string> EmailData = new Dictionary<string, string>
                    {
                        {"FullName", $"{Usr?.FirstName} {Usr?.LastName}"},
                        {"TicketTitle", ticket.Title},
                        {"TicketCreateDate", DateCreate.ToString("dd/MM/yyyy")},
                        {"TicketProject", Project?.Name ?? string.Empty},
                        {"TicketType", TicketType?.Name ?? string.Empty},
                        {"CreateBy", $"{Usr.FirstName} {Usr.LastName}"},
                        {"ViewTicketLink", TicketViewLink},
                    };

                    if (Usr != null && Usr.Email != null)
                    {
                        var Email = await _emailSender.SendEmail(Usr.Email, ticket.Title, EmailTemplate.TicketCreate, EmailData);
                        await _emailSender.ReplyEmailTicket(Email.to, Email.subject, ticket.Description);
                    }
                }


                return this._mapper.Map<TicketResponse>(ticket);
            }

            throw new NotFoundException(ExceptionMessage.NotFound("User", $"{username}"));
        }

        public async Task DeleteTicketById(int id)
        {
            var ticket = this._context.TicketStatuses.Find(id);
            if (ticket != null)
            {
                ticket.Active = false;

                this._context.Update(ticket);
                await this._context.SaveChangesAsync();
            }
            else
                throw new NotFoundException(ExceptionMessage.NotFound("Ticket", $"{id}"));
        }

        public async Task<TicketResponse> GetTicketById(int id)
        {
            var ticket = this._context.Tickets.Where(x => x.Active == true)
                                              .AsNoTracking()
                                              .FirstOrDefault(x => x.Id == id);

            if (ticket != null)
                return this._mapper.Map<TicketResponse>(ticket);

            throw new NotFoundException(ExceptionMessage.NotFound("Ticket", $"{id}"));
        }

        public async Task<List<TicketResponse>> GetTickets(string? username)
        {
            User? user = await _context.Users.Include(x => x.RolNavigation)
                                             .AsNoTracking()
                                             .FirstOrDefaultAsync(x => x.Username == username);

            List<Ticket>? result = new List<Ticket>();
            if (user?.RolNavigation?.PermissionLevel == PermissionLevel.Administrator)
            {
                result = await _context.Tickets
                                                .Select(x => new Ticket
                                                {
                                                    Id = x.Id,
                                                    Title = x.Title,
                                                    ProjectId = x.ProjectId,
                                                    TicketPriorityId = x.TicketPriorityId,
                                                    TicketStatusId = x.TicketStatusId,
                                                    TicketTypeId = x.TicketTypeId,
                                                    DateCreated = x.DateCreated,
                                                    DateUpdated = x.DateUpdated,
                                                    CreateBy = x.CreateBy,
                                                    IsClosed = x.IsClosed,
                                                    Active = x.Active
                                                })
                                               .Where(x => x.Active == true)
                                               .AsNoTracking()
                                               .ToListAsync();
            }
            else
            {
                result = await _context.Tickets.Include(x => x.Project)
                                                    .ThenInclude(x => x.ProjectXclients)
                                                    .ThenInclude(x => x.Client)
                                                .Include(x => x.Project)
                                                    .ThenInclude(x => x.ProjectXdevelopers)
                                                    .ThenInclude(x => x.Developer)
                                               .Where(x => x.Project.ProjectXclients.Any(c => c.Client.Username == username) ||
                                                                                x.Project.ProjectXdevelopers.Any(d => d.Developer.Username == username))
                                               .Select(x => new Ticket
                                               {
                                                   Id = x.Id,
                                                   Title = x.Title,
                                                   Description = "",
                                                   ProjectId = x.ProjectId,
                                                   TicketPriorityId = x.TicketPriorityId,
                                                   TicketStatusId = x.TicketStatusId,
                                                   TicketTypeId = x.TicketTypeId,
                                                   DateCreated = x.DateCreated,
                                                   DateUpdated = x.DateUpdated,
                                                   CreateBy = x.CreateBy,
                                                   IsClosed = x.IsClosed,
                                                   Active = x.Active
                                               })
                                               .AsNoTracking()
                                               .AsSplitQuery()
                                               .ToListAsync();
            }

            result = result.Where(x => x.Active == true).DistinctBy(x => x.Id).ToList();

            if (result != null)
                return _mapper.Map<List<TicketResponse>>(result);

            throw new NotFoundException(ExceptionMessage.NotFound("Ticket", $"{username}"));
        }

        public async Task<TicketResponse> UpdateTicket(int id, UpdateTicketRequest request)
        {
            var ticket = this._context.Tickets.FirstOrDefault(x => x.Id == id && x.Active == true);
            if (ticket != null)
            {
                ticket.TicketTypeId = request.TicketTypeId;
                ticket.TicketStatusId = request.TicketStatusId;
                ticket.TicketPriorityId = request.TicketPriorityId;
                ticket.DateUpdated = DateTime.Now;
                ticket.IsClosed = request.IsClosed;
                ticket.Active = true;

                this._context.Tickets.Update(ticket);
                await this._context.SaveChangesAsync();

                return this._mapper.Map<TicketResponse>(ticket);
            }

            throw new NotFoundException(ExceptionMessage.NotFound("Ticket", $"{id}"));
        }
    }
}
