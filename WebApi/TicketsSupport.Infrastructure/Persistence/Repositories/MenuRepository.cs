using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using TicketsSupport.ApplicationCore.Configuration;
using TicketsSupport.ApplicationCore.DTOs;
using TicketsSupport.ApplicationCore.Entities;
using TicketsSupport.ApplicationCore.Exceptions;
using TicketsSupport.ApplicationCore.Interfaces;
using TicketsSupport.ApplicationCore.Utils;
using TicketsSupport.Infrastructure.Persistence.Contexts;

namespace TicketsSupport.Infrastructure.Persistence.Repositories
{
    public class MenuRepository : IMenuRepository
    {
        private readonly TS_DatabaseContext _context;
        private readonly IMapper _mapper;
        private int UserIdRequest;
        private int OrganizationId;

        public MenuRepository(TS_DatabaseContext context, IMapper mapper, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _mapper = mapper;

            //Get UserId
            string? userIdTxt = httpContextAccessor.HttpContext?.User.Claims.FirstOrDefault(x => x.Type == "id")?.Value;
            int.TryParse(userIdTxt, out UserIdRequest);
            //Get OrganizationId
            string? organizationIdTxt = httpContextAccessor.HttpContext?.User.Claims.FirstOrDefault(x => x.Type == "organization")?.Value;
            int.TryParse(organizationIdTxt, out OrganizationId);
        }

        public async Task<MenuResponse> CreateMenu(CreateMenuRequest request)
        {
            var menu = _mapper.Map<Menu>(request);
            menu.OrganizationId = OrganizationId;
            menu.ParentId = request.ParentId > 0 ? request.ParentId : null;
            menu.Active = true;

            this._context.Menus.Add(menu);
            await this._context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Created);

            return this._mapper.Map<MenuResponse>(menu);
        }

        public async Task DeleteMenuById(int id)
        {
            var menu = this._context.Menus.Find(id);
            if (menu != null)
            {
                menu.Active = false;

                this._context.Update(menu);
                await this._context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Delete);
            }
            else
                throw new NotFoundException(ExceptionMessage.NotFound("Menu", $"{id}"));
        }

        public async Task<List<MenuResponse>> GetMenus()
        {
            return this._context.Menus.Where(x => x.OrganizationId == OrganizationId && x.Active == true)
                                      .Select(x => this._mapper.Map<MenuResponse>(x))
                                      .AsNoTracking()
                                      .ToList();
        }

        public async Task<MenuResponse> GetMenusById(int id)
        {
            var menu = this._context.Menus.Where(x => x.OrganizationId == OrganizationId && x.Active == true)
                                          .AsNoTracking()
                                          .FirstOrDefault(x => x.Id == id);

            if (menu != null)
                return this._mapper.Map<MenuResponse>(menu);

            throw new NotFoundException(ExceptionMessage.NotFound("Menu", $"{id}"));
        }

        public async Task<List<MenuResponse>> GetMenusByUser(int userId)
        {
            var menuByUser = await _context.MenuXrols.Include(x => x.Menu)
                                                     .Include(x => x.Role)
                                                     .ThenInclude(x => x.RolXusers)
                                                     .ThenInclude(x => x.User)
                                                     .Where(x => x.Role.RolXusers.Any(x => x.User.Id == userId) &&
                                                            x.Menu.OrganizationId == OrganizationId &&
                                                            x.Role.OrganizationId == OrganizationId &&
                                                            x.Menu.Active == true)
                                                     .OrderBy(p => p.Id)
                                                     .Select(x => _mapper.Map<MenuResponse>(x.Menu))
                                                     .AsSplitQuery()
                                                     .AsNoTracking()
                                                     .ToListAsync();

            return menuByUser;
        }

        public async Task<MenuResponse> UpdateMenu(int id, UpdateMenuRequest request)
        {
            var menu = this._context.Menus.FirstOrDefault(x => x.Id == id && x.Active == true);
            if (menu != null)
            {
                menu.Url = request.Url;
                menu.Icon = request.Icon;
                menu.Position = request.Position;
                menu.ParentId = request.ParentId > 0 ? request.ParentId : null;
                menu.Show = request.Show;
                menu.Active = true;

                this._context.Menus.Update(menu);
                await this._context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Modified);

                return this._mapper.Map<MenuResponse>(menu);
            }

            throw new NotFoundException(ExceptionMessage.NotFound("Menu", $"{id}"));
        }
    }
}
