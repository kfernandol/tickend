﻿using AutoMapper;
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
            CreateMap<User, UserResponse>();

            //Rol
            CreateMap<CreateRolRequest, Rol>();
            CreateMap<Rol, RolResponse>()
                .ForMember(dest => dest.PermissionLevelId, opt => opt.MapFrom(src => src.PermissionLevel));

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
            CreateMap<CreateProjectRequest, Project>();
            CreateMap<Project, ProjectResponse>()
                .ForMember(dest => dest.TicketStatus, opt => opt.MapFrom(src => src.ProjectXticketStatuses.Select(x => x.TicketStatusId)))
                .ForMember(dest => dest.TicketPriorities, opt => opt.MapFrom(src => src.ProjectXticketPriorities.Select(x => x.TicketPriorityId)))
                .ForMember(dest => dest.TicketTypes, opt => opt.MapFrom(src => src.ProjectXticketTypes.Select(x => x.TicketTypeId)))
                .ForMember(dest => dest.Clients, opt => opt.MapFrom(src => src.ProjectXclients.Select(x => x.ClientId)))
                .ForMember(dest => dest.Developers, opt => opt.MapFrom(src => src.ProjectXdevelopers.Select(x => x.DeveloperId)));

            //Tickets
            CreateMap<CreateTicketRequest, Ticket>();
            CreateMap<Ticket, TicketResponse>();

            //AuditLog
            CreateMap<AuditLogDetail, AuditLogDetailResponse>();
            CreateMap<AuditLog, AuditLogResponse>()
                .ForMember(dest => dest.auditLogDetailResponses, opt => opt.MapFrom(opt => opt.AuditLogDetails));

            //Organization
            CreateMap<CreateOrganizationRequest, Organization>();
            CreateMap<Organization, OrganizationResponse>();

        }
    }
}
