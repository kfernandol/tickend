using AutoMapper;
using Azure.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Serilog;
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
    public class OrganizationRepository : IOrganizationRepository
    {
        private readonly TS_DatabaseContext _context;
        private readonly IMapper _mapper;
        private readonly WebApp _webAppConfig;
        private readonly IEmailSender _emailSender;
        private int UserIdRequest;
        private int OrganizationId;

        public OrganizationRepository(
            TS_DatabaseContext context,
            IMapper mapper,
            IHttpContextAccessor httpContextAccessor,
            IOptions<WebApp> webAppConfig,
            IEmailSender emailSender)
        {
            _context = context;
            _mapper = mapper;
            _emailSender = emailSender;
            _webAppConfig = webAppConfig.Value;
            //Get UserId
            string? userIdTxt = httpContextAccessor.HttpContext?.User.Claims.FirstOrDefault(x => x.Type == "id")?.Value;
            int.TryParse(userIdTxt, out UserIdRequest);
            //Get OrganizationId
            string? organizationIdTxt = httpContextAccessor.HttpContext?.User.Claims.FirstOrDefault(x => x.Type == "organization")?.Value;
            if (!string.IsNullOrWhiteSpace(organizationIdTxt))
                OrganizationId = int.Parse(organizationIdTxt);
        }

        public async Task CreateOrganization(CreateOrganizationRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == UserIdRequest);

            if (user == null)
                throw new NotFoundException(ExceptionMessage.NotFound("User"));

            //Add Organization
            Organization newOrganization = new Organization
            {
                Name = request.Name,
                Photo = request.Photo,
                Address = request.Address,
                Email = request.Email,
                Phone = request.Phone,
                CreateDate = DateTime.Now,
                Active = true,
                OrganizationsXusers = new List<OrganizationsXuser> // Add User in Organization
                {
                    new OrganizationsXuser {
                        UserId = user.Id
                    }
                },

            };

            _context.Organizations.Add(newOrganization);
            await _context.SaveChangesAsync();

            //Add Rol Organization
            var rol = new Rol
            {
                Name = "Administrator",
                PermissionLevel = PermissionLevel.Administrator,
                OrganizationId = newOrganization.Id,
                Active = true,
            };

            _context.Rols.Add(rol);
            await _context.SaveChangesAsync();

            //Add user to Rol
            var rolXUser = new RolXuser
            {
                RolId = rol.Id,
                UserId = user.Id
            };

            _context.RolXusers.Add(rolXUser);
            await _context.SaveChangesAsync();

            //Add Menus Organization
            var menus = new List<Menu>
            {
                new Menu
                {
                    Name = "Security", Icon = "security",
                    Url = "#",
                    ParentId = null,
                    Position = 1,
                    Show = true,
                    OrganizationId = newOrganization.Id,
                    Active = true
                },
                new Menu
                {
                    Name = "Users",
                    Icon = "pi pi-users",
                    Url = "/Users",
                    ParentId = null,
                    Position = 1,
                    Show = true,
                    OrganizationId = newOrganization.Id,
                    Active = true
                },
                new Menu
                {
                    Name = "Roles",
                    Icon = "pi pi-id-card",
                    Url = "/Roles",
                    ParentId = null,
                    Position = 2,
                    Show = true,
                    OrganizationId = newOrganization.Id,
                    Active = true
                },
                new Menu
                {
                    Name = "Menus",
                    Icon = "pi pi-th-large",
                    Url = "/Menus",
                    ParentId = null,
                    Position = 3,
                    Show = true,
                    OrganizationId = newOrganization.Id,
                    Active = true
                },
                new Menu
                {
                    Name = "AuditLogs",
                    Icon = "pi pi-book",
                    Url = "/Audit",
                    ParentId = null,
                    Position = 4,
                    Show = true,
                    OrganizationId = newOrganization.Id,
                    Active = true
                },
                new Menu
                {
                    Name = "ProjectsP",
                    Icon = "",
                    Url = "#",
                    ParentId = null,
                    Position = 2,
                    Show = true,
                    OrganizationId = newOrganization.Id,
                    Active = true
                },
                new Menu
                {
                    Name = "Projects",
                    Icon = "pi pi-copy",
                    Url = "/Projects",
                    ParentId = null,
                    Position = 1,
                    Show = true,
                    OrganizationId = newOrganization.Id,
                    Active = true
                },
                new Menu
                {
                    Name = "TicketsP",
                    Icon = "",
                    Url = "#",
                    ParentId = null,
                    Position = 3,
                    Show = true,
                    OrganizationId = newOrganization.Id,
                    Active = true
                },
                new Menu
                {
                    Name = "Tickets",
                    Icon = "pi pi-ticket",
                    Url = "/Tickets",
                    ParentId = null,
                    Position = 1,
                    Show = true,
                    OrganizationId = newOrganization.Id,
                    Active = true
                },
                new Menu
                {
                    Name = "TicketTypes",
                    Icon = "pi pi-tags",
                    Url = "/Ticket/Types",
                    ParentId = null,
                    Position = 2,
                    Show = true,
                    OrganizationId = newOrganization.Id,
                    Active = true
                },
                new Menu
                {
                    Name = "TicketStatus",
                    Icon = "pi pi-sliders-h",
                    Url = "/Ticket/Status",
                    ParentId = null,
                    Position = 3,
                    Show = true,
                    OrganizationId = newOrganization.Id,
                    Active = true
                },
                new Menu
                {
                    Name = "TicketPriority",
                    Icon = "pi pi-sort-amount-up",
                    Url = "/Ticket/Priorities",
                    ParentId = null,
                    Position = 4,
                    Show = true,
                    OrganizationId = newOrganization.Id,
                    Active = true
                },
                new Menu
                {
                    Name = "StadisticsP",
                    Icon = "",
                    Url = "#",
                    ParentId = null,
                    Position = 4,
                    Show = true,
                    OrganizationId = newOrganization.Id,
                    Active = true
                },
                new Menu
                {
                    Name = "Stadistics",
                    Icon = "pi pi-chart-line",
                    Url = "/Stadistics",
                    ParentId = null,
                    Position = 1,
                    Show = true,
                    OrganizationId = newOrganization.Id,
                    Active = true
                }
            };

            await _context.Menus.AddRangeAsync(menus);
            await _context.SaveChangesAsync();


            // Retrieve the added menus to get their IDs
            var securityMenu = await _context.Menus.FirstAsync(m => m.Name == "Security" && m.OrganizationId == newOrganization.Id);
            var projectsPMenu = await _context.Menus.FirstAsync(m => m.Name == "ProjectsP" && m.OrganizationId == newOrganization.Id);
            var ticketsPMenu = await _context.Menus.FirstAsync(m => m.Name == "TicketsP" && m.OrganizationId == newOrganization.Id);
            var stadisticsPMenu = await _context.Menus.FirstAsync(m => m.Name == "StadisticsP" && m.OrganizationId == newOrganization.Id);

            // Update ParentId fields
            await _context.Menus.Where(m => m.Name == "Users" && m.OrganizationId == newOrganization.Id).ForEachAsync(m => m.ParentId = securityMenu.Id);
            await _context.Menus.Where(m => m.Name == "Roles" && m.OrganizationId == newOrganization.Id).ForEachAsync(m => m.ParentId = securityMenu.Id);
            await _context.Menus.Where(m => m.Name == "Menus" && m.OrganizationId == newOrganization.Id).ForEachAsync(m => m.ParentId = securityMenu.Id);
            await _context.Menus.Where(m => m.Name == "AuditLogs" && m.OrganizationId == newOrganization.Id).ForEachAsync(m => m.ParentId = securityMenu.Id);
            await _context.Menus.Where(m => m.Name == "Projects" && m.OrganizationId == newOrganization.Id).ForEachAsync(m => m.ParentId = projectsPMenu.Id);
            await _context.Menus.Where(m => m.Name == "Tickets" && m.OrganizationId == newOrganization.Id).ForEachAsync(m => m.ParentId = ticketsPMenu.Id);
            await _context.Menus.Where(m => m.Name == "TicketTypes" && m.OrganizationId == newOrganization.Id).ForEachAsync(m => m.ParentId = ticketsPMenu.Id);
            await _context.Menus.Where(m => m.Name == "TicketStatus" && m.OrganizationId == newOrganization.Id).ForEachAsync(m => m.ParentId = ticketsPMenu.Id);
            await _context.Menus.Where(m => m.Name == "TicketPriority" && m.OrganizationId == newOrganization.Id).ForEachAsync(m => m.ParentId = ticketsPMenu.Id);
            await _context.Menus.Where(m => m.Name == "Stadistics" && m.OrganizationId == newOrganization.Id).ForEachAsync(m => m.ParentId = stadisticsPMenu.Id);

            await _context.SaveChangesAsync();

            foreach (var menu in menus)
            {
                MenuXrol menuXrol = new MenuXrol
                {
                    RoleId = rol.Id,
                    MenuId = menu.Id,
                };
                _context.MenuXrols.Add(menuXrol);
            }

            await _context.SaveChangesAsync();
        }

        public async Task DeleteOrganizationById(int id)
        {
            var organization = await _context.OrganizationsXusers.Include(x => x.Organization)
                                                                 .Where(x => x.UserId == UserIdRequest && x.OrganizationId == id)
                                                                 .Select(x => x.Organization)
                                                                 .FirstOrDefaultAsync();

            if (organization == null)
                throw new NotFoundException(ExceptionMessage.NotFound("Organization"));

            organization.Active = false;
            _context.Organizations.Update(organization);
            await _context.SaveChangesAsync();
        }

        public async Task<List<OrganizationResponse>> GetOrganizations()
        {

            var organizations = await _context.OrganizationsXusers.Include(x => x.User)
                                                                  .Include(x => x.Organization)
                                                                  .Where(x => x.User.Id == UserIdRequest && x.Organization.Active == true)
                                                                  .Select(x => _mapper.Map<OrganizationResponse>(x.Organization))
                                                                  .AsNoTracking()
                                                                  .ToListAsync();

            return organizations;
        }

        public async Task<OrganizationResponse> GetOrganizationsById(int Id)
        {
            var organizations = await _context.OrganizationsXusers.Include(x => x.Organization)
                                                                  .AsNoTracking()
                                                                  .FirstOrDefaultAsync(x => x.Id == Id && x.Organization.Active == true);

            return _mapper.Map<OrganizationResponse>(organizations?.Organization);
        }

        public async Task<List<OrganizationResponse>> GetOrganizationsByUser(int userId)
        {
            var organizations = await _context.OrganizationsXusers.Include(x => x.Organization)
                                                                  .AsNoTracking()
                                                                  .Where(x => x.UserId == userId && x.Organization.Active == true)
                                                                  .Select(x => _mapper.Map<OrganizationResponse>(x.Organization))
                                                                  .ToListAsync();

            return organizations;
        }

        public async Task<bool> OrganizationInviteConfirmationAsync(string HashConfirmation)
        {
            try
            {
                var organizationInvitacion = await _context.OrganizationInvitations.Include(x => x.User)
                                                                                   .FirstOrDefaultAsync(x => x.Hash == HashConfirmation && x.Used == false);

                if (organizationInvitacion == null)
                    throw new NotFoundException(ExceptionMessage.Invalid("Organization Invitation"));

                if (DateTime.Now >= organizationInvitacion.ExpirationDate)
                    throw new InvalidException(ExceptionMessage.Invalid("Invitation expired"));


                //Add user to organization
                OrganizationsXuser organizationsXuser = new OrganizationsXuser
                {
                    OrganizationId = organizationInvitacion.OrganizationId,
                    UserId = organizationInvitacion.UserId,
                };

                _context.OrganizationsXusers.Add(organizationsXuser);
                await _context.SaveChangesAsync();

                //Mark Hash used
                organizationInvitacion.Used = true;
                _context.Update(organizationInvitacion);

                await _context.SaveChangesAsync(organizationInvitacion.User.Id, OrganizationId, InterceptorActions.Modified);

                return true;
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error change password");
                return false;
            }
        }

        public async Task<bool> OrganizationInviteUserAsync(OrganizationInviteRequest request)
        {
            try
            {
                var HashReset = TokenUtils.GenerateRandomHash();
                var organization = await _context.Organizations.FirstOrDefaultAsync(x => x.Id == request.OrganizationId);
                var user = await _context.Users.Include(x => x.OrganizationsXusers).FirstOrDefaultAsync(x => x.Email == request.Email);

                if (user != null)
                {
                    OrganizationInvitation organizationInvitation = new OrganizationInvitation();

                    organizationInvitation.UserId = user.Id;
                    organizationInvitation.OrganizationId = request.OrganizationId;
                    organizationInvitation.Hash = HashReset;
                    organizationInvitation.CreateDate = DateTime.Now;
                    organizationInvitation.ExpirationDate = DateTime.Now.AddDays(1);

                    _context.OrganizationInvitations.Add(organizationInvitation);
                    await _context.SaveChangesAsync(user.Id, OrganizationId, InterceptorActions.Modified);

                    var resetPasswordLink = $"{_webAppConfig.Url}/InviteOrganization/{HttpUtility.UrlEncode(HashReset)}";

                    Dictionary<string, string> EmailData = new Dictionary<string, string>
                    {
                        {"Subject", ResourcesUtils.GetEmailBtnLink("InviteBtn") ?? string.Empty},
                        {"Message", ResourcesUtils.GetEmailBtnLink("InviteMessage")?.ToString().Replace("{0}", "") ?? string.Empty},
                        {"FullName", $"{user.FirstName} {user.LastName}"},
                        {"BtnLink", resetPasswordLink},
                        {"BtnText", ResourcesUtils.GetEmailBtnLink("InviteBtn") ?? string.Empty},
                    };

                    await _emailSender.SendEmail(request.Email, string.Empty, EmailTemplate.EmailBtnLink, EmailData);
                    return true;
                }

                return false;
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error reset password");
                return false;
            }
        }

        public async Task UpdateOrganization(int id, UpdateOrganizationRequest request)
        {
            var organization = await _context.Organizations.FirstOrDefaultAsync(x => x.Id == x.Id);


            if (organization == null)
                throw new NotFoundException(ExceptionMessage.NotFound("Organization"));

            organization.Name = request.Name;
            organization.Photo = request.Photo;
            organization.Address = request.Address;
            organization.Email = request.Email;
            organization.Phone = request.Phone;
            organization.Active = true;

            _context.Organizations.Update(organization);
            await _context.SaveChangesAsync();
        }
    }
}
