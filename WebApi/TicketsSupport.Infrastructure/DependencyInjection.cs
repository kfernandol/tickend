using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TicketsSupport.ApplicationCore.Interfaces;
using TicketsSupport.Infrastructure.Persistence.Contexts;
using TicketsSupport.Infrastructure.Persistence.Repositories;
using TicketsSupport.Infrastructure.Services.Email;

namespace TicketsSupport.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            //Add DatabaseContext
            var defaultConnectionString = configuration.GetConnectionString("DefaultConnection");
            services.AddDbContext<TS_DatabaseContext>(options =>
            {
                options.UseSqlServer(defaultConnectionString);
            });

            //Dependencies infrastructures
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IProfileRepository, ProfileRepository>();
            services.AddScoped<IAuthRepository, AuthRepository>();
            services.AddScoped<IRolRepository, RolRepository>();
            services.AddScoped<IMenuRepository, MenuRepository>();
            services.AddScoped<IProjectRepository, ProjectRepository>();
            services.AddScoped<ITicketPriorityRepository, TicketPriorityRepository>();
            services.AddScoped<ITicketStatusRepository, TicketStatusRepository>();
            services.AddScoped<ITicketTypeRepository, TicketTypeRepository>();
            services.AddScoped<IEmailSender, EmailSender>();

            return services;
        }
    }
}
