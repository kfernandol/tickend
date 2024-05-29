using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketsSupport.ApplicationCore.DTOs;
using TicketsSupport.ApplicationCore.Entities;
using TicketsSupport.ApplicationCore.Exceptions;
using TicketsSupport.ApplicationCore.Interfaces;
using TicketsSupport.ApplicationCore.Utils;
using TicketsSupport.Infrastructure.Persistence.Contexts;

namespace TicketsSupport.Infrastructure.Persistence.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly TS_DatabaseContext _context;
        private readonly IMapper _mapper;
        private int UserIdRequest;
        private int OrganizationId;

        public UserRepository(TS_DatabaseContext context, IMapper mapper, IHttpContextAccessor httpContextAccessor)
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

        public async Task<UserResponse> CreateUser(CreateUserRequest request)
        {
            User? user = null;

            //Check username exist
            user = await _context.Users.FirstOrDefaultAsync(x => x.Username == request.Username);
            if (user != null)
                throw new ExistException(ExceptionMessage.Exist("Username"));

            //Check email exist
            user = await _context.Users.FirstOrDefaultAsync(x => x.Email == request.Email);
            if (user != null)
                throw new ExistException(ExceptionMessage.Exist("Email"));

            //Hash password
            var passwordHashed = HashUtils.HashPassword(request.Password);

            //Add new user
            user = _mapper.Map<User>(request);
            user.Password = passwordHashed.hashedPassword;
            user.Salt = passwordHashed.salt;
            user.Active = true;

            this._context.Users.Add(user);
            await this._context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Created);

            //Add rol user
            RolXuser rolXuser = new RolXuser
            {
                UserId = user.Id,
                RolId = request.RolId
            };

            this._context.RolXusers.Add(rolXuser);
            await this._context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Created);

            return this._mapper.Map<UserResponse>(user);
        }

        public async Task DeleteUserById(int id)
        {
            var user = this._context.Users.Find(id);
            if (user != null)
            {
                user.Active = false;

                this._context.Update(user);
                await this._context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Delete);
            }
            else
                throw new NotFoundException(ExceptionMessage.NotFound("User", $"{id}"));
        }

        public async Task<UserResponse> GetUserById(int id)
        {
            var user = await _context.Users.Include(x => x.RolXusers)
                                          .ThenInclude(x => x.Rol)
                                          .FirstOrDefaultAsync(x => x.Id == id &&
                                                               x.RolXusers.Any(x => x.Rol.OrganizationId == OrganizationId) &&
                                                               x.Active == true);

            if (user != null)
            {
                var response = _mapper.Map<UserResponse>(user);
                //Set rol id
                var rol = user.RolXusers.FirstOrDefault(x => x.Rol.OrganizationId == OrganizationId);
                if (rol != null && rol.RolId != null)
                    response.RolId = (int)rol.RolId;

                return response;
            }

            throw new NotFoundException(ExceptionMessage.NotFound("User", $"{id}"));
        }

        public async Task<List<UserResponse>> GetUsers()
        {
            var users = _context.Users.Include(x => x.RolXusers)
                                      .ThenInclude(x => x.Rol)
                                      .Where(x => x.Active == true)
                                      .ToList();

            var response = users.Select(x => _mapper.Map<UserResponse>(x)).ToList();

            //Add RolId
            response.ForEach(x =>
            {
                var user = users.FirstOrDefault(user => x.Id == user.Id);
                if (user != null)
                {
                    var rolXuser = user.RolXusers.FirstOrDefault(rolXuser => rolXuser.Rol.OrganizationId == OrganizationId);
                    if (rolXuser != null && rolXuser.RolId != null)
                    {
                        x.RolId = (int)rolXuser.RolId;
                    }
                }
            });

            return response;
        }

        public async Task<UserResponse> UpdateUser(int id, UpdateUserRequest request)
        {
            var user = this._context.Users.Include(x => x.RolXusers)
                                          .ThenInclude(x => x.Rol)
                                          .FirstOrDefault(x => x.Id == id && x.Active == true);
            if (user != null)
            {
                /*user.Username = request.Username;
                user.FirstName = request.FirstName;
                user.LastName = request.LastName;
                user.Email = request.Email;
                user.Phone = request.Phone;
                user.Direction = request.Direction;
                user.Active = true;*/

                var rolUser = user.RolXusers.FirstOrDefault(x => x.Rol.OrganizationId == OrganizationId);

                if (rolUser != null)
                    rolUser.RolId = request.RolId;

                /* if (!string.IsNullOrWhiteSpace(request.Password))
                 {
                     //Hash password
                     var passwordHashed = HashUtils.HashPassword(request.Password);
                     user.Password = passwordHashed.hashedPassword;
                     user.Salt = passwordHashed.salt;
                 }*/


                this._context.Users.Update(user);
                await this._context.SaveChangesAsync(UserIdRequest, OrganizationId, InterceptorActions.Modified);

                return this._mapper.Map<UserResponse>(user);
            }

            throw new NotFoundException(ExceptionMessage.NotFound("User", $"{id}"));
        }
    }
}
