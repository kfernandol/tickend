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

                //Send Email All Clients
                foreach (var ClientXProject in Project.ProjectXclients)
                {
                    var TicketViewLink = $"{_webAppConfig.Url}/Ticket/Edit/{ticket.Id}";
                    Dictionary<string, string> EmailData = new Dictionary<string, string>
                    {
                        {"FullName", $"{ClientXProject?.Client?.FirstName} {ClientXProject?.Client?.LastName}"},
                        {"TicketTitle", ticket.Title},
                        {"TicketCreateDate", DateCreate.ToString("dd/MM/yyyy")},
                        {"TicketProject", Project?.Name ?? string.Empty},
                        {"TicketType", TicketType?.Name ?? string.Empty},
                        {"CreateBy", $"{user.FirstName} {user.LastName}"},
                        {"ViewTicketLink", TicketViewLink},
                    };

                    if (ClientXProject != null && ClientXProject.Client != null && ClientXProject.Client.Email != null)
                        await _emailSender.SendEmail(ClientXProject.Client.Email, EmailTemplate.TicketCreate, EmailData);
                }

                //Send Email All Developers
                foreach (var DevelopertXProject in Project.ProjectXdevelopers)
                {
                    var TicketViewLink = $"{_webAppConfig.Url}/Ticket/Edit/{ticket.Id}";
                    Dictionary<string, string> EmailData = new Dictionary<string, string>
                    {
                        {"FullName", $"{DevelopertXProject?.Developer?.FirstName} {DevelopertXProject?.Developer?.LastName}"},
                        {"TicketTitle", ticket.Title},
                        {"TicketCreateDate", DateCreate.ToString("dd/MM/yyyy")},
                        {"TicketProject", Project?.Name ?? string.Empty},
                        {"TicketType", TicketType?.Name ?? string.Empty},
                        {"CreateBy", $"{user.FirstName} {user.LastName}"},
                        {"ViewTicketLink", TicketViewLink},
                    };

                    if (DevelopertXProject != null && DevelopertXProject.Developer != null && DevelopertXProject.Developer.Email != null)
                        await _emailSender.SendEmail(DevelopertXProject.Developer.Email, EmailTemplate.TicketCreate, EmailData);
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
                result = await _context.Tickets.Select(x => new Ticket
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
