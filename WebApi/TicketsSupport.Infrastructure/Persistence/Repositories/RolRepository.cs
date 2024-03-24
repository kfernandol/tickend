using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TicketsSupport.ApplicationCore.DTOs;
using TicketsSupport.ApplicationCore.Entities;
using TicketsSupport.ApplicationCore.Exceptions;
using TicketsSupport.ApplicationCore.Interfaces;
using TicketsSupport.ApplicationCore.Utils;
using TicketsSupport.Infrastructure.Persistence.Contexts;

namespace TicketsSupport.Infrastructure.Persistence.Repositories
{
    public class RolRepository : IRolRepository
    {
        private readonly TS_DatabaseContext _context;
        private readonly IMapper _mapper;

        public RolRepository(TS_DatabaseContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<RolResponse> CreateRol(CreateRolRequest request)
        {
            //add rol
            var rol = _mapper.Map<Rol>(request);
            rol.Active = true;

            this._context.Rols.Add(rol);
            await this._context.SaveChangesAsync();

            //add menus
            foreach (var menu in request.Menus)
            {
                var menusXRol = new MenuXrol { MenuId = menu, RoleId = rol.Id };
                this._context.MenuXrols.Add(menusXRol);
            }

            await this._context.SaveChangesAsync();

            return this._mapper.Map<RolResponse>(rol);
        }

        public async Task DeleteRolById(int id)
        {
            //delete rol
            var rol = this._context.Rols.Find(id);
            if (rol != null)
            {
                rol.Active = false;

                this._context.Update(rol);
                await this._context.SaveChangesAsync();
            }
            else
                throw new NotFoundException(ExceptionMessage.NotFound("Rol", $"{id}"));

            //delete menus
            /*var menus = _context.MenuXrols.Where(x => x.RoleId == rol.Id).ToList();
            foreach (var menu in menus)
            {
                _context.MenuXrols.Remove(menu);
            }*/
        }

        public async Task<List<PermissionLevelResponse>> GetPermissionLevels()
        {
            var permissionLevelList = new List<PermissionLevelResponse>();

            // Obtener todos los valores del enum
            var values = Enum.GetValues(typeof(PermissionLevel)).Cast<int>();

            // Iterar sobre cada valor y obtener su nombre
            foreach (var value in values)
            {
                var name = Enum.GetName(typeof(PermissionLevel), value);
                permissionLevelList.Add(new PermissionLevelResponse { id = value, name = name });
            }

            return permissionLevelList;
        }

        public async Task<List<RolResponse>> GetRol()
        {
            var roles = this._context.Rols.Where(x => x.Active == true)
                                      .Select(x => this._mapper.Map<RolResponse>(x))
                                      .ToList();

            foreach (var role in roles)
            {
                role.Menus = _context.MenuXrols.Include(x => x.Menu)
                                                .AsNoTracking()
                                                .Where(x => x.RoleId == role.Id && x.Menu.Active == true)
                                                .Select(z => z.Menu)
                                                .ToList();
            }

            return roles;
        }

        public async Task<RolResponse> GetRolById(int id)
        {
            var rol = this._context.Rols.Where(x => x.Active == true && x.Id == id)
                                        .Select(x => this._mapper.Map<RolResponse>(x))
                                        .FirstOrDefault();

            rol.Menus = _context.MenuXrols.Include(x => x.Menu)
                                          .AsNoTracking()
                                          .Where(x => x.RoleId == rol.Id && x.Menu.Active == true)
                                          .Select(x => x.Menu)
                                          .ToList();
            if (rol != null)
                return this._mapper.Map<RolResponse>(rol);

            throw new NotFoundException(ExceptionMessage.NotFound("Rol", $"{id}"));
        }

        public async Task<RolResponse> UpdateRol(int id, UpdateRolRequest request)
        {
            var rol = this._context.Rols.FirstOrDefault(x => x.Id == id && x.Active == true);
            if (rol != null)
            {
                //Update Rol
                rol.Name = request.Name;
                rol.PermissionLevel = request.PermissionLevel;
                rol.Active = true;

                this._context.Rols.Update(rol);
                await this._context.SaveChangesAsync();

                //Remove menus
                var menusRemoved = _context.MenuXrols.Where(x => x.RoleId == rol.Id).ToList();
                _context.MenuXrols.RemoveRange(menusRemoved);
                await this._context.SaveChangesAsync();

                //add menus
                foreach (var menu in request.Menus)
                {
                    var menusXRol = new MenuXrol { MenuId = menu, RoleId = rol.Id };
                    this._context.MenuXrols.Add(menusXRol);
                }

                await this._context.SaveChangesAsync();

                return this._mapper.Map<RolResponse>(rol);
            }

            throw new NotFoundException(ExceptionMessage.NotFound("Rol", $"{id}"));
        }


    }
}
