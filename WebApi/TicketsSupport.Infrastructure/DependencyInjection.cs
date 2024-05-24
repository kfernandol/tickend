using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TicketsSupport.ApplicationCore.Interfaces;
using TicketsSupport.Infrastructure.Persistence.Contexts;
using TicketsSupport.Infrastructure.Persistence.Interceptors;
using TicketsSupport.Infrastructure.Persistence.Repositories;
using TicketsSupport.Infrastructure.Services.Email;

namespace TicketsSupport.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            //Dependencies infrastructures
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IProfileRepository, ProfileRepository>();
            services.AddScoped<IAuthRepository, AuthRepository>();
            services.AddScoped<IRolRepository, RolRepository>();
            services.AddScoped<IMenuRepository, MenuRepository>();
            services.AddScoped<IProjectRepository, ProjectRepository>();
            services.AddScoped<ITicketRepository, TicketRepository>();
            services.AddScoped<ITicketPriorityRepository, TicketPriorityRepository>();
            services.AddScoped<ITicketStatusRepository, TicketStatusRepository>();
            services.AddScoped<ITicketTypeRepository, TicketTypeRepository>();
            services.AddScoped<IStadisticsRepository, StadisticsRepository>();
            services.AddScoped<IAuditLogRepository, AuditLogRepository>();
            services.AddScoped<IEmailSender, EmailSender>();
            services.AddHttpClient();

            //Add DatabaseContext
            var defaultConnectionString = configuration.GetConnectionString("DefaultConnection");
            services.AddDbContext<TS_DatabaseContext>((sp, options) =>
            {
                options.UseSqlServer(defaultConnectionString);
            });

            return services;
        }
    }
}
