using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TicketsSupport.ApplicationCore.Interfaces;
using TicketsSupport.Infrastructure.Persistence.Contexts;
using TicketsSupport.Infrastructure.Persistence.Repositories;

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
            services.AddScoped<IAuthRepository, AuthRepository>();

            return services;
        }
    }
}
