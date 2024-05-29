using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using TicketsSupport.ApplicationCore.Configuration;
using TicketsSupport.ApplicationCore.DTOs;
using TicketsSupport.ApplicationCore.Entities;
using TicketsSupport.ApplicationCore.Exceptions;
using TicketsSupport.ApplicationCore.Interfaces;
using TicketsSupport.ApplicationCore.Utils;
using TicketsSupport.Infrastructure.Persistence.Contexts;

namespace TicketsSupport.Infrastructure.Persistence.Repositories
{
    public class ProfileRepository : IProfileRepository
    {
        private readonly TS_DatabaseContext _context;
        private readonly ConfigJWT _configJWT;
        private int UserIdRequest;
        private int? OrganizationId = null;

        public ProfileRepository(TS_DatabaseContext context, IOptions<ConfigJWT> configJWT, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _configJWT = configJWT.Value;

            //Get UserId
            string? userIdTxt = httpContextAccessor.HttpContext?.User.Claims.FirstOrDefault(x => x.Type == "id")?.Value;
            int.TryParse(userIdTxt, out UserIdRequest);
            //Get OrganizationId
            string? organizationIdTxt = httpContextAccessor.HttpContext?.User.Claims.FirstOrDefault(x => x.Type == "organization")?.Value;
            if (!string.IsNullOrWhiteSpace(organizationIdTxt))
                OrganizationId = int.Parse(organizationIdTxt);
        }

        public async Task<bool> UpdateProfile(int id, UpdateProfileRequest request)
        {
            var user = this._context.Users.FirstOrDefault(x => x.Id == id && x.Active == true);
            if (user != null)
            {
                if (!string.IsNullOrWhiteSpace(request.FirstName))
                    user.FirstName = request.FirstName;
                if (!string.IsNullOrWhiteSpace(request.LastName))
                    user.LastName = request.LastName;
                if (!string.IsNullOrWhiteSpace(request.Email))
                    user.Email = request.Email;
                if (!string.IsNullOrWhiteSpace(request.Photo))
                    user.Photo = request.Photo;
                if (!string.IsNullOrWhiteSpace(request.Direction))
                    user.Direction = request.Direction;
                if (!string.IsNullOrWhiteSpace(request.Phone))
                    user.Phone = request.Phone;

                if (!string.IsNullOrWhiteSpace(request.Password))
                {
                    //Hash password
                    var passwordHashed = HashUtils.HashPassword(request.Password);
                    user.Password = passwordHashed.hashedPassword;
                    user.Salt = passwordHashed.salt;
                }

                user.Active = true;

                _context.Users.Update(user);
                await _context.SaveChangesAsync();

                return true;
            }

            throw new NotFoundException(ExceptionMessage.NotFound("User", $"{id}"));
        }
    }
}
