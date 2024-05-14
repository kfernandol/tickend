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

        public UserRepository(TS_DatabaseContext context, IMapper mapper, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _mapper = mapper;

            //Get UserId
            string? userIdTxt = httpContextAccessor.HttpContext?.User.Claims.FirstOrDefault(x => x.Type == "id")?.Value;
            int.TryParse(userIdTxt, out UserIdRequest);
        }

        public async Task<UserResponse> CreateUser(CreateUserRequest request)
        {
            var user = _mapper.Map<User>(request);
            user.Rol = request.RolId;
            user.Active = true;

            //Hash password
            var passwordHashed = HashUtils.HashPassword(request.Password);
            user.Password = passwordHashed.hashedPassword;
            user.Salt = passwordHashed.salt;

            this._context.Users.Add(user);
            await this._context.SaveChangesAsync(UserIdRequest, InterceptorActions.Created);

            return this._mapper.Map<UserResponse>(user);
        }

        public async Task DeleteUserById(int id)
        {
            var user = this._context.Users.Find(id);
            if (user != null)
            {
                user.Active = false;

                this._context.Update(user);
                await this._context.SaveChangesAsync(UserIdRequest, InterceptorActions.Delete);
            }
            else
                throw new NotFoundException(ExceptionMessage.NotFound("User", $"{id}"));
        }

        public async Task<UserResponse> GetUserById(int id)
        {
            var user = this._context.Users.Include(x => x.RolNavigation)
                                          .Where(x => x.Active == true)
                                          .FirstOrDefault(x => x.Id == id);

            if (user != null)
                return this._mapper.Map<UserResponse>(user);

            throw new NotFoundException(ExceptionMessage.NotFound("User", $"{id}"));
        }

        public async Task<List<UserResponse>> GetUsers()
        {
            return this._context.Users.Include(x => x.RolNavigation)
                                      .Where(x => x.Active == true)
                                      .Select(x => this._mapper.Map<UserResponse>(x))
                                      .ToList();
        }

        public async Task<UserResponse> UpdateUser(int id, UpdateUserRequest request)
        {
            var user = this._context.Users.FirstOrDefault(x => x.Id == id && x.Active == true);
            if (user != null)
            {
                user.Username = request.Username;
                user.FirstName = request.FirstName;
                user.LastName = request.LastName;
                user.Email = request.Email;
                user.Rol = request.RolId;
                user.Active = true;

                if (!string.IsNullOrWhiteSpace(request.Password))
                {
                    //Hash password
                    var passwordHashed = HashUtils.HashPassword(request.Password);
                    user.Password = passwordHashed.hashedPassword;
                    user.Salt = passwordHashed.salt;
                }


                this._context.Users.Update(user);
                await this._context.SaveChangesAsync(UserIdRequest, InterceptorActions.Modified);

                return this._mapper.Map<UserResponse>(user);
            }

            throw new NotFoundException(ExceptionMessage.NotFound("User", $"{id}"));
        }
    }
}
