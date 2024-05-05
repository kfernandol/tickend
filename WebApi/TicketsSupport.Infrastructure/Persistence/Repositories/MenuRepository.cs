using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
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

        public MenuRepository(TS_DatabaseContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<MenuResponse> CreateMenu(CreateMenuRequest request)
        {
            var menu = _mapper.Map<Menu>(request);
            menu.ParentId = request.ParentId > 0 ? request.ParentId : null;
            menu.Active = true;

            this._context.Menus.Add(menu);
            await this._context.SaveChangesAsync();

            return this._mapper.Map<MenuResponse>(menu);
        }

        public async Task DeleteMenuById(int id)
        {
            var menu = this._context.Menus.Find(id);
            if (menu != null)
            {
                menu.Active = false;

                this._context.Update(menu);
                await this._context.SaveChangesAsync();
            }
            else
                throw new NotFoundException(ExceptionMessage.NotFound("Menu", $"{id}"));
        }

        public async Task<List<MenuResponse>> GetMenus()
        {
            return this._context.Menus.Where(x => x.Active == true)
                                      .Select(x => this._mapper.Map<MenuResponse>(x))
                                      .AsNoTracking()
                                      .ToList();
        }

        public async Task<MenuResponse> GetMenusById(int id)
        {
            var menu = this._context.Menus.Where(x => x.Active == true)
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
                                                     .ThenInclude(x => x.Users)
                                                     .Where(x => x.Role.Users.Any(x => x.Id == userId) && x.Menu.Active == true)
                                                     .OrderBy(p => p.Id)
                                                     .Select(x => _mapper.Map<MenuResponse>(x.Menu))
                                                     .AsSplitQuery()
                                                     .AsNoTracking()
                                                     .ToListAsync();

            var parentIds = menuByUser.Where(x => x.ParentId != null).Select(x => x.ParentId).Distinct().ToList();

            foreach (var parentId in parentIds)
            {
                var menu = await _context.Menus.Where(x => x.Id == parentId).Select(x => _mapper.Map<MenuResponse>(x)).FirstOrDefaultAsync();
                if (menu != null)
                    menuByUser.Add(menu);

                else
                    throw new NotFoundException(ExceptionMessage.NotFound("Menu Parent", $"{parentId}"));

            }


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
                await this._context.SaveChangesAsync();

                return this._mapper.Map<MenuResponse>(menu);
            }

            throw new NotFoundException(ExceptionMessage.NotFound("Menu", $"{id}"));
        }
    }
}
