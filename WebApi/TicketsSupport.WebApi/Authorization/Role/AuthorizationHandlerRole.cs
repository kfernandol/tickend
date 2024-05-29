using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Globalization;
using System.Security.Claims;
using TicketsSupport.Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;
using TicketsSupport.ApplicationCore.Exceptions;
using TicketsSupport.ApplicationCore.Utils;

namespace TicketsSupport.ApplicationCore.Authorization.Role
{
    public class AuthorizationHandlerRole : AuthorizationHandler<AuthorizeRoleAttribute>
    {
        private readonly TS_DatabaseContext _context;
        public AuthorizationHandlerRole(TS_DatabaseContext context)
        {
            _context = context;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, AuthorizeRoleAttribute requirement)
        {
            var UserAuthenticated = context?.User?.Identity?.IsAuthenticated;
            if (UserAuthenticated == null || UserAuthenticated == false)
                throw new NoAuthenticatedException(ExceptionMessage.NotAuthenticated());

            #region Get UserId
            var UserId = context.User.Claims.FirstOrDefault(x => x.Type == "id")?.Value;

            if (UserId == null)
                throw new NotFoundException(ExceptionMessage.NotFound($"UserId in token"));
            #endregion

            #region GetOrganizacionId
            //Get OrganizationId
            string? organizationIdTxt = context.User.Claims.FirstOrDefault(x => x.Type == "organization")?.Value;
            int.TryParse(organizationIdTxt, out int OrganizationId);
            #endregion

            #region Get User Database
            var User = _context.Users.Include(x => x.RolXusers)
                                     .ThenInclude(x => x.Rol)
                                     .FirstOrDefault(x => x.Id == int.Parse(UserId) && x.Active == true && x.RolXusers.FirstOrDefault(x => x.Rol.OrganizationId == OrganizationId).Rol.Active == true);
            if (User == null)
                throw new NotFoundException(ExceptionMessage.NotFound("User", UserId));
            #endregion

            var userWithRole = User.RolXusers.FirstOrDefault(x => x.Rol.OrganizationId == OrganizationId)?.Rol?.PermissionLevel == requirement.PermissionLevel;

            if (userWithRole == true)
                context.Succeed(requirement);
            else
                context.Fail();

            return Task.CompletedTask;
        }
    }
}
