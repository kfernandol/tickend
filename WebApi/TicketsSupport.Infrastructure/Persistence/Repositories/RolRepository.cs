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
    public class RolRepository : IRolRepository
    {
        private readonly TS_DatabaseContext _context;
        private readonly IMapper _mapper;
        private int UserIdRequest;
        private int OrganizationId;

        public RolRepository(TS_DatabaseContext context, IMapper mapper, IHttpContextAccessor httpContextAccessor)
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

        public async Task<RolResponse> CreateRol(CreateRolRequest request)
        {
            //add rol
            var rol = _mapper.Map<Rol>(request);
            rol.OrganizationId = OrganizationId;
            rol.Active = true;

            this._context.Rols.Add(rol);
            await this._context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Created);

            //add menus
            foreach (var menu in request.Menus)
            {
                var menusXRol = new MenuXrol { MenuId = menu, RoleId = rol.Id };
                this._context.MenuXrols.Add(menusXRol);
            }

            await this._context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Created);

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
                await this._context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Delete);
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
            var roles = this._context.Rols.Where(x => x.OrganizationId == OrganizationId && x.Active == true)
                                          .Select(x => this._mapper.Map<RolResponse>(x))
                                          .AsNoTracking()
                                          .ToList();

            foreach (var role in roles)
            {
                role.Menus = _context.MenuXrols.Include(x => x.Menu)
                                               .AsNoTracking()
                                               .Where(x => x.RoleId == role.Id && x.Menu.Active == true)
                                               .Select(z => _mapper.Map<MenuResponse>(z.Menu))
                                               .ToList();
            }

            return roles;
        }

        public async Task<RolResponse> GetRolById(int id)
        {
            var rol = this._context.Rols.Where(x => x.OrganizationId == OrganizationId && x.Active == true && x.Id == id)
                                        .Select(x => this._mapper.Map<RolResponse>(x))
                                        .AsNoTracking()
                                        .FirstOrDefault();

            rol.Menus = _context.MenuXrols.Include(x => x.Menu)
                                          .AsNoTracking()
                                          .Where(x => x.RoleId == rol.Id && x.Menu.Active == true)
                                          .Select(x => _mapper.Map<MenuResponse>(x.Menu))
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
                rol.Description = request.Description;
                rol.PermissionLevel = request.PermissionLevel;
                rol.Active = true;

                this._context.Rols.Update(rol);
                await this._context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Modified);

                //Remove menus
                var menusRemoved = _context.MenuXrols.Where(x => x.RoleId == rol.Id).ToList();
                _context.MenuXrols.RemoveRange(menusRemoved);
                await this._context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Delete);

                //add menus
                foreach (var menu in request.Menus)
                {
                    var menusXRol = new MenuXrol { MenuId = menu, RoleId = rol.Id };
                    this._context.MenuXrols.Add(menusXRol);
                }

                await this._context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Modified);

                return this._mapper.Map<RolResponse>(rol);
            }

            throw new NotFoundException(ExceptionMessage.NotFound("Rol", $"{id}"));
        }


    }
}
