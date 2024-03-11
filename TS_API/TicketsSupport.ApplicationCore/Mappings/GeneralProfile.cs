using AutoMapper;
using TicketsSupport.ApplicationCore.DTOs;
using TicketsSupport.ApplicationCore.Entities;

namespace TicketsSupport.ApplicationCore.Mappings
{
    public class GeneralProfile : Profile
    {
        public GeneralProfile() {
            //User
            CreateMap<CreateUserRequest, User>();
            CreateMap<User, UserResponse>();
        }
    }
}
