using AutoMapper;
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
            var rol = _mapper.Map<Rol>(request);
            rol.Active = true;

            this._context.Rols.Add(rol);
            await this._context.SaveChangesAsync();

            return this._mapper.Map<RolResponse>(rol);
        }

        public async Task DeleteRolById(int id)
        {
            var rol = this._context.Rols.Find(id);
            if (rol != null)
            {
                rol.Active = false;

                this._context.Update(rol);
                await this._context.SaveChangesAsync();
            }
            else
                throw new NotFoundException(ExceptionMessage.NotFound("Rol", $"{id}"));
        }

        public async Task<List<RolResponse>> GetRol()
        {
            return this._context.Rols.Where(x => x.Active == true)
                                      .Select(x => this._mapper.Map<RolResponse>(x))
                                      .ToList();
        }

        public async Task<RolResponse> GetRolById(int id)
        {
            var rol = this._context.Rols.Where(x => x.Active == true).FirstOrDefault(x => x.Id == id);

            if (rol != null)
                return this._mapper.Map<RolResponse>(rol);

            throw new NotFoundException(ExceptionMessage.NotFound("Rol", $"{id}"));
        }

        public async Task<RolResponse> UpdateRol(int id, UpdateRolRequest request)
        {
            var rol = this._context.Rols.FirstOrDefault(x => x.Id == id && x.Active == true);
            if (rol != null)
            {
                rol.Name = request.Name;
                rol.PermissionLevel = request.PermissionLevel;
                rol.Active = true;

                this._context.Rols.Update(rol);
                await this._context.SaveChangesAsync();

                return this._mapper.Map<RolResponse>(rol);
            }

            throw new NotFoundException(ExceptionMessage.NotFound("Rol", $"{id}"));
        }
    }
}
