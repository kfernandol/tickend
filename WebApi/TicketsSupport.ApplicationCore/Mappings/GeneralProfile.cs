using AutoMapper;
using TicketsSupport.ApplicationCore.DTOs;
using TicketsSupport.ApplicationCore.Entities;

namespace TicketsSupport.ApplicationCore.Mappings
{
    public class GeneralProfile : Profile
    {
        public GeneralProfile()
        {
            //User
            CreateMap<CreateUserRequest, User>();
            CreateMap<User, UserResponse>()
                .ForMember(dest => dest.RolId, opt => opt.MapFrom(src => src.Rol));

            //Rol
            CreateMap<CreateRolRequest, Rol>();
            CreateMap<Rol, RolResponse>();

            //Menu
            CreateMap<CreateMenuRequest, Menu>();
            CreateMap<Menu, MenuResponse>();

            //Ticket Priority
            CreateMap<CreateTicketPriorityRequest, TicketPriority>();
            CreateMap<TicketPriority, TicketPriorityResponse>();

            //Ticket Status
            CreateMap<CreateTicketStatusRequest, TicketStatus>();
            CreateMap<TicketStatus, TicketStatusResponse>();

            //Ticket Type
            CreateMap<CreateTicketTypeRequest, TicketType>();
            CreateMap<TicketType, TicketTypeResponse>();
        }
    }
}
