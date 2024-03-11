using AutoMapper;
using Microsoft.AspNetCore.Authorization;
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

        public UserRepository(TS_DatabaseContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<UserResponse> CreateUser(CreateUserRequest request)
        {
            var user = _mapper.Map<User>(request);

            //Hash password
            var passwordHashed = HashUtils.HashPassword(request.Password);
            user.Password = passwordHashed.hashedPassword;
            user.Salt = passwordHashed.salt;

            this._context.Users.Add(user);
            await this._context.SaveChangesAsync();

            return this._mapper.Map<UserResponse>(user);
        }

        public async Task DeleteUserById(int id)
        {
            var user = this._context.Users.Find(id);
            if (user != null)
            {
                user.Active = false;

                this._context.Update(user);
                await this._context.SaveChangesAsync();
            }
            else
            {
                throw new NotFoundException(ExceptionMessage.NotFound("User", $"{id}"));
            }
        }

        public async Task<UserResponse> GetUserById(int id)
        {
            var user = this._context.Users.Find(id);
            if (user != null)
            {
                return this._mapper.Map<UserResponse>(user);
            }
            throw new NotFoundException(ExceptionMessage.NotFound("User", $"{id}"));
        }

        public async Task<List<UserResponse>> GetUsers()
        {
            return this._context.Users.Select(x => this._mapper.Map<UserResponse>(x)).ToList();
        }

        public async Task<UserResponse> UpdateUser(int id, UpdateUserRequest request)
        {
            var user = this._context.Users.Find(id);
            if (user != null)
            {
                user.FirstName = request.FirstName;
                user.LastName = request.LastName;
                user.Email = request.Email;
                user.Rol = request.RolId;

                //Hash password
                var passwordHashed = HashUtils.HashPassword(request.Password);
                user.Password = passwordHashed.hashedPassword;
                user.Salt = passwordHashed.salt;

                this._context.Users.Update(user);
                await this._context.SaveChangesAsync();

                return this._mapper.Map<UserResponse>(user);
            }

            throw new NotFoundException(ExceptionMessage.NotFound("User", $"{id}"));
        }
    }
}
