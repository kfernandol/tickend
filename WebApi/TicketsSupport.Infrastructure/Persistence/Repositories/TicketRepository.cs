using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using MyCSharp.HttpUserAgentParser;
using Serilog.Parsing;
using System;
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
        private int UserIdRequest;
        private string UserIPRequest;
        private string UserAgentRequest;
        private string UserBrowserRequest;
        private string UserOsRequest;
        private int OrganizationId;

        public TicketRepository(TS_DatabaseContext context, IMapper mapper, IEmailSender emailSender, IOptions<WebApp> webAppConfig, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _mapper = mapper;
            _webAppConfig = webAppConfig.Value;
            _emailSender = emailSender;

            //Get UserId
            string? userIdTxt = httpContextAccessor.HttpContext?.User.Claims.FirstOrDefault(x => x.Type == "id")?.Value;
            int.TryParse(userIdTxt, out UserIdRequest);
            //Get UserIP
            string ipAddress = httpContextAccessor.HttpContext?.Connection?.RemoteIpAddress?.ToString();
            if (!string.IsNullOrEmpty(ipAddress) && ipAddress.StartsWith("::ffff:"))
                ipAddress = ipAddress.Substring(7); // Delte Prefix "::ffff:"
            UserIPRequest = ipAddress ?? string.Empty;
            //Get UserAgent
            UserAgentRequest = httpContextAccessor.HttpContext?.Request?.Headers["User-Agent"].FirstOrDefault() ?? string.Empty;

            if (!string.IsNullOrEmpty(UserAgentRequest))
            {
                HttpUserAgentInformation info = HttpUserAgentParser.Parse(UserAgentRequest);

                UserBrowserRequest = info.Name ?? string.Empty;
                UserOsRequest = info.Platform != null ? info.Platform.Value.Name : string.Empty;
            }
            //Get OrganizationId
            string? organizationIdTxt = httpContextAccessor.HttpContext?.User.Claims.FirstOrDefault(x => x.Type == "organization")?.Value;
            int.TryParse(organizationIdTxt, out OrganizationId);
        }

        public async Task<TicketResponse> CreateTicket(CreateTicketRequest request)
        {
            User? user = await _context.Users.Include(x => x.RolXusers)
                                             .ThenInclude(x => x.Rol)
                                             .FirstOrDefaultAsync(x => x.Id == UserIdRequest && x.RolXusers.Any(x => x.Rol.OrganizationId == OrganizationId));
            if (user != null)
            {
                var DateCreate = DateTime.Now;

                var ticket = _mapper.Map<Ticket>(request);
                ticket.Ip = UserIPRequest;
                ticket.Browser = UserBrowserRequest;
                ticket.Os = UserOsRequest;
                ticket.CreateBy = user.Id;
                ticket.DateCreated = DateCreate;
                ticket.OrganizationId = OrganizationId;
                ticket.Active = true;
                this._context.Tickets.Add(ticket);
                await this._context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Created);

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
                    var TicketViewLink = $"{_webAppConfig.Url}/Tickets/{ticket.Id}";
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
                                                   .Include(x => x.RolXusers)
                                                   .ThenInclude(x => x.Rol)
                                                   .Where(x => x.RolXusers.FirstOrDefault(x => x.Rol.OrganizationId == OrganizationId).Rol.PermissionLevel == PermissionLevel.Administrator &&
                                                               x.Active == true)
                                                   .ToList();

                var devs = Project.ProjectXdevelopers.Where(x => x.Developer.Active == true).Select(x => x.Developer).ToList();
                var adminsAndDevs = administrators.Union(devs);

                //Send Email All Developers
                foreach (var Usr in adminsAndDevs)
                {
                    var TicketViewLink = $"{_webAppConfig.Url}/Tickets/{ticket.Id}";
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

            throw new NotFoundException(ExceptionMessage.NotFound("UserId", $"{UserIdRequest}"));
        }

        public async Task<TicketResponse> ReplyTicket(CreateTicketRequest request)
        {
            User? user = await _context.Users.Include(x => x.RolXusers)
                                             .ThenInclude(x => x.Rol)
                                             .FirstOrDefaultAsync(x => x.Id == UserIdRequest && x.RolXusers.Any(x => x.Rol.OrganizationId == OrganizationId));

            if (user != null)
            {
                var DateCreate = DateTime.Now;

                var ticket = _mapper.Map<Ticket>(request);
                ticket.Ip = UserIPRequest;
                ticket.Browser = UserBrowserRequest;
                ticket.Os = UserOsRequest;
                ticket.CreateBy = user.Id;
                ticket.DateCreated = DateCreate;
                ticket.Reply = request.Reply;
                ticket.OrganizationId = OrganizationId;
                ticket.Active = true;
                this._context.Tickets.Add(ticket);
                await this._context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Created);

                var TicketType = _context.TicketTypes.Find(ticket.TicketTypeId);
                var Project = await _context.Projects.Include(x => x.ProjectXclients)
                                                .ThenInclude(x => x.Client)
                                               .Include(x => x.ProjectXdevelopers)
                                                .ThenInclude(x => x.Developer)
                                               .Where(x => x.Id == ticket.ProjectId)
                                               .FirstOrDefaultAsync();

                var clients = Project.ProjectXclients.Where(x => x.Client.Active == true).Select(x => x.Client).ToList();

                //Send Email All Clients
                foreach (var client in clients)
                {
                    if (client != null && client.Email != null)
                        await _emailSender.ReplyEmailTicket(client.Email, ticket.Title, ticket.Description);
                }

                //Search all Admins and devs
                var administrators = _context.Users.AsNoTracking()
                                                   .Include(x => x.RolXusers)
                                                   .ThenInclude(x => x.Rol)
                                                   .Where(x => x.RolXusers.FirstOrDefault(x => x.Rol.OrganizationId == OrganizationId).Rol.PermissionLevel == PermissionLevel.Administrator &&
                                                               x.Active == true)
                                                   .ToList();

                var devs = Project.ProjectXdevelopers.Where(x => x.Developer.Active == true).Select(x => x.Developer).ToList();
                var adminsAndDevs = administrators.Union(devs);

                //Send Email All Admins and Devs
                foreach (var Usr in adminsAndDevs)
                {
                    if (Usr != null && Usr.Email != null)
                        await _emailSender.ReplyEmailTicket(Usr.Email, ticket.Title, ticket.Description);
                }


                return this._mapper.Map<TicketResponse>(ticket);
            }

            throw new NotFoundException(ExceptionMessage.NotFound("UserId", $"{UserIdRequest}"));
        }

        public async Task DeleteTicketById(int id)
        {
            var ticket = await _context.TicketStatuses.FirstOrDefaultAsync(x => x.Id == id && x.OrganizationId == OrganizationId);
            if (ticket != null)
            {
                ticket.Active = false;

                this._context.Update(ticket);
                await this._context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Delete);
            }
            else
                throw new NotFoundException(ExceptionMessage.NotFound("Ticket", $"{id}"));
        }

        public async Task<TicketResponse> GetTicketById(int id)
        {
            var ticket = this._context.Tickets.AsNoTracking()
                                              .FirstOrDefault(x => x.Id == id && x.OrganizationId == OrganizationId && x.Active == true);

            if (ticket != null)
                return this._mapper.Map<TicketResponse>(ticket);

            throw new NotFoundException(ExceptionMessage.NotFound("Ticket", $"{id}"));
        }

        public async Task<List<TicketResponse>> GetTickets()
        {
            User? user = await _context.Users.Include(x => x.RolXusers)
                                             .ThenInclude(x => x.Rol)
                                             .AsNoTracking()
                                             .FirstOrDefaultAsync(x => x.Id == UserIdRequest && x.RolXusers.Any(x => x.Rol.OrganizationId == OrganizationId));

            List<Ticket>? result = new List<Ticket>();
            if (user?.RolXusers.FirstOrDefault(x => x.Rol.OrganizationId == OrganizationId)?.Rol?.PermissionLevel == PermissionLevel.Administrator)
            {
                result = await _context.Tickets
                                               .Where(x => x.OrganizationId == OrganizationId && x.Active == true)
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
                                                    Browser = x.Browser,
                                                    ClosedBy = x.ClosedBy,
                                                    DateClosed = x.DateClosed,
                                                    Ip = x.Ip,
                                                    Os = x.Os,
                                                    Reply = x.Reply,
                                                    LastUpdatedBy = x.LastUpdatedBy,
                                                    Active = x.Active
                                                })
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
                                               .Where(x => x.OrganizationId == OrganizationId &&
                                                           (x.Project.ProjectXclients.Any(c => c.Client.Id == UserIdRequest) ||
                                                            x.Project.ProjectXdevelopers.Any(d => d.Developer.Id == UserIdRequest)))
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
                                                   Browser = x.Browser,
                                                   ClosedBy = x.ClosedBy,
                                                   DateClosed = x.DateClosed,
                                                   Ip = x.Ip,
                                                   Os = x.Os,
                                                   Reply = x.Reply,
                                                   LastUpdatedBy = x.LastUpdatedBy,
                                                   Active = x.Active
                                               })
                                               .AsNoTracking()
                                               .AsSplitQuery()
                                               .ToListAsync();
            }

            result = result.Where(x => x.Active == true).DistinctBy(x => x.Id).ToList();

            if (result != null)
                return _mapper.Map<List<TicketResponse>>(result);

            throw new NotFoundException(ExceptionMessage.NotFound("UserId", $"{UserIdRequest}"));
        }

        public async Task<TicketResponse> UpdateTicket(int id, UpdateTicketRequest request)
        {
            var ticket = this._context.Tickets.Include(x => x.CreateByNavigation)
                                              .FirstOrDefault(x => x.Id == id && x.OrganizationId == OrganizationId && x.Active == true);

            int? originalStatusId = ticket?.TicketStatusId;
            int? originalPriorityId = ticket?.TicketPriorityId;
            if (ticket != null)
            {
                ticket.TicketTypeId = request.TicketTypeId;
                ticket.TicketStatusId = request.TicketStatusId;
                ticket.TicketPriorityId = request.TicketPriorityId;
                ticket.DateUpdated = DateTime.Now;
                ticket.LastUpdatedBy = UserIdRequest;
                ticket.Active = true;

                if (ticket.IsClosed == false && request.IsClosed == true)
                {
                    ticket.IsClosed = request.IsClosed;
                    ticket.DateClosed = DateTime.Now;
                    ticket.ClosedBy = UserIdRequest;
                }

                this._context.Tickets.Update(ticket);
                await this._context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Modified);

                //Notification Email Ticket Status Changed
                if (originalStatusId != request.TicketStatusId)
                {
                    var ticketStatusOld = await _context.TicketStatuses.FirstOrDefaultAsync(x => x.Id == originalStatusId);
                    var ticketStatusOldName = ticketStatusOld != null ? ticketStatusOld.Name : " -/- ";
                    var ticketStatusNew = await _context.TicketStatuses.FirstOrDefaultAsync(x => x.Id == request.TicketStatusId);
                    var ticketStatusNewName = ticketStatusNew != null ? ticketStatusNew.Name : " -/- ";

                    var subject = string.Format(ResourcesUtils.GetEmailSimpleMessage("SubjectTicketStatusChange"), ticket.Id);
                    var message = string.Format(ResourcesUtils.GetEmailSimpleMessage("MessageTicketStatusChange"), ticket.Id, ticketStatusOldName, ticketStatusNewName);
                    Dictionary<string, string> EmailData = new Dictionary<string, string>
                    {
                        {"FullName", $"{ticket.CreateByNavigation.FirstName} {ticket.CreateByNavigation.LastName}"},
                        {"Subject", subject},
                        {"Message", message},
                    };

                    await _emailSender.SendEmail(ticket.CreateByNavigation.Email, string.Empty, EmailTemplate.SimpleMessage, EmailData);
                }

                //Notification Email Ticket Priority Changed
                if (originalPriorityId != request.TicketPriorityId)
                {
                    var ticketPriorityNew = await _context.TicketPriorities.FirstOrDefaultAsync(x => x.Id == request.TicketPriorityId);
                    var ticketPriorityNewName = ticketPriorityNew != null ? ticketPriorityNew.Name : " -/- ";

                    var subject = string.Format(ResourcesUtils.GetEmailSimpleMessage("SubjectTicketPriorityChange"), ticket.Id);
                    var message = string.Format(ResourcesUtils.GetEmailSimpleMessage("MessageTicketPriorityChange"), ticket.Id, ticketPriorityNewName);
                    Dictionary<string, string> EmailData = new Dictionary<string, string>
                    {
                        {"FullName", $"{ticket.CreateByNavigation.FirstName} {ticket.CreateByNavigation.LastName}"},
                        {"Subject", subject},
                        {"Message", message},
                    };

                    await _emailSender.SendEmail(ticket.CreateByNavigation.Email, string.Empty, EmailTemplate.SimpleMessage, EmailData);
                }

                return this._mapper.Map<TicketResponse>(ticket);
            }

            throw new NotFoundException(ExceptionMessage.NotFound("Ticket", $"{id}"));
        }
    }
}
