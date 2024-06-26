﻿using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Localization;
using System.Reflection;
using TicketsSupport.ApplicationCore.Strategies.EmailTemplate;

namespace TicketsSupport.ApplicationCore
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplicationCore(this IServiceCollection services)
        {
            services.AddAutoMapper(Assembly.GetExecutingAssembly());

            services.AddTransient<EmailBtnLinkTemplateStrategy>();
            services.AddTransient<TicketCreatedTemplateStrategy>();
            services.AddTransient<SimpleMessageTemplateStrategy>();
            services.AddScoped<EmailTemplateContext>();

            return services;
        }
    }
}
