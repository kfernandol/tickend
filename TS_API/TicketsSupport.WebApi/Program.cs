using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using TicketsSupport.Infrastructure;
using TicketsSupport.ApplicationCore;
using System.Text;
using Asp.Versioning;
using Microsoft.OpenApi.Models;
using TicketsSupport.ApplicationCore.Configuration;
using Microsoft.AspNetCore.Authorization;
using TicketsSupport.ApplicationCore.Authorization.Menu;
using Serilog;
using Microsoft.AspNetCore.Identity;
using TicketsSupport.ApplicationCore.Authorization.Role;
using System.Reflection;
using Microsoft.AspNetCore.Diagnostics;
using System.Text.Json;
using TicketsSupport.ApplicationCore.Commons;
using TicketsSupport.ApplicationCore.Exceptions;
using System.Globalization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    //Add CamelCase
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    //options.SwaggerDoc("v2", new OpenApiInfo { Title = "Tickets Support", Version = "2.0" });
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "Tickets Support", Version = "1.0" });
    options.EnableAnnotations();

    //Add XmlComments
    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));

    //Add Security Definition
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter a valid token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });

    //Add Security Requeriment
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            new string[]{}
        }
    });
});

//Add Authentication JWT
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(o =>
{
    o.TokenValidationParameters = new TokenValidationParameters
    {
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ClockSkew = TimeSpan.Zero
    };
});

//Add Authorization
builder.Services.AddAuthorization();
builder.Services.AddScoped<IAuthorizationHandler, AuthorizationHandlerMenu>();
builder.Services.AddScoped<IAuthorizationHandler, AuthorizationHandlerRole>();

//Add Dependencies
builder.Services.AddApplicationCore();
builder.Services.AddInfrastructure(builder.Configuration);

//Add Configurations
builder.Services.Configure<ConfigJWT>(builder.Configuration.GetSection("JWT"));

//Add Versioning
builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ApiVersionReader = new UrlSegmentApiVersionReader();
})
.AddApiExplorer(options =>
{
    options.GroupNameFormat = "'v'VVV";
    options.SubstituteApiVersionInUrl = true;
})
.EnableApiVersionBinding();

//Add serilog
builder.Host.UseSerilog((hostingContext, loggerConfiguration) =>
{
    loggerConfiguration.ReadFrom.Configuration(hostingContext.Configuration);
});

//Add Corns
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "AllowAny",
        builder =>
        {
            builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
        });
});

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        foreach (var description in app.DescribeApiVersions())
        {
            options.SwaggerEndpoint(
                url: $"/swagger/{description.GroupName}/swagger.json",
                name: description.GroupName);
        }
    });
}

//Exceptions show
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        var errorFeature = context.Features.Get<IExceptionHandlerFeature>();
        if (errorFeature != null)
        {
            var exception = errorFeature.Error;
            int statusCode;
            string message;
            string details;

            if (exception is BasicApiException basicApiException)
            {
                // Manejar BasicApiException
                statusCode = basicApiException.ErrorCode;
                message = basicApiException.Message;
                details = basicApiException.Details;
            }
            else
            {
                // Manejar otras excepciones
                statusCode = 500; // Internal Server Error
                message = "Internal Server Error";
                details = exception.Message;
            }

            context.Response.StatusCode = statusCode;
            context.Response.ContentType = "application/json";

            var result = JsonSerializer.Serialize(new ErrorResponse
            {
                Code = statusCode,
                Message = message,
                Details = details
            });

            await context.Response.WriteAsync(result);
        }
    });
});

//Add Localitation
var supportedCultures = new[]
{
    new CultureInfo("es"),
    new CultureInfo("en"),
};

var localitation = new RequestLocalizationOptions()
{
    ApplyCurrentCultureToResponseHeaders = true,
    SupportedCultures = supportedCultures,
    SupportedUICultures = supportedCultures,
}
.SetDefaultCulture("es");

app.UseRequestLocalization(localitation);

app.UseHttpsRedirection();

//Add Authentication and Authorization
app.UseAuthentication();
app.UseAuthorization();

//Add corns
app.UseCors("AllowAny");

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
