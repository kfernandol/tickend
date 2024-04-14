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
                .ForMember(dest => dest.RolId, opt => opt.MapFrom(src => src.Rol))
                .ForMember(dest => dest.Photo, opt => opt.MapFrom(src => Convert.ToBase64String(src.Photo ?? new byte[0])))
                .ForMember(dest => dest.LevelPermission, opt => opt.MapFrom(src => (src.RolNavigation ?? new Rol()).PermissionLevel));

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

            //Projects
            CreateMap<CreateProjectRequest, Project>()
                .ForMember(dest => dest.Photo, opt => opt.Ignore());
            CreateMap<Project, ProjectResponse>()
                .ForMember(dest => dest.Photo, opt => opt.MapFrom(src => Convert.ToBase64String(src.Photo ?? new byte[0])))
                .ForMember(dest => dest.TicketStatus, opt => opt.MapFrom(src => src.ProjectXticketStatuses.Select(x => x.TicketStatusId)))
                .ForMember(dest => dest.TicketPriorities, opt => opt.MapFrom(src => src.ProjectXticketPriorities.Select(x => x.TicketPriorityId)))
                .ForMember(dest => dest.TicketTypes, opt => opt.MapFrom(src => src.ProjectXticketTypes.Select(x => x.TicketTypeId)))
                .ForMember(dest => dest.Clients, opt => opt.MapFrom(src => src.ProjectXclients.Select(x => x.ClientId)))
                .ForMember(dest => dest.Developers, opt => opt.MapFrom(src => src.ProjectXdevelopers.Select(x => x.DeveloperId)));
        }
    }
}
