using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketsSupport.ApplicationCore.DTOs;

namespace TicketsSupport.ApplicationCore.Interfaces
{
    public interface IUserRepository
    {
        Task<List<UserResponse>> GetUsers();
        Task<UserResponse> GetUserById(int id);
        Task DeleteUserById(int id);
        Task<UserResponse> CreateUser(CreateUserRequest request);
        Task<UserResponse> UpdateUser(int id, UpdateUserRequest request);
    }
}
