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

namespace TicketsSupport.ApplicationCore.Authorization.Menu
{
    public class AuthorizationHandlerMenu : AuthorizationHandler<AuthorizeMenuAttribute>
    {
        private readonly TS_DatabaseContext _context;
        public AuthorizationHandlerMenu(TS_DatabaseContext context)
        {
            _context = context;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, AuthorizeMenuAttribute requirement)
        {
            var UserAuthenticated = context?.User?.Identity?.IsAuthenticated;
            if (UserAuthenticated == null || UserAuthenticated == false)
                throw new NoAuthenticatedException(ExceptionMessage.NotAuthenticated());

            #region Get UserId
            var UserId = context.User.Claims.FirstOrDefault(x => x.Type == "id")?.Value;

            if (UserId == null)
                throw new NotFoundException(ExceptionMessage.NotFound("UserId in token"));
            #endregion

            #region Get User Database
            var User = _context.Users.Include(x => x.RolNavigation)
                                      .ThenInclude(x => x.MenuXrols)
                                      .ThenInclude(x => x.Menu)
                                      .FirstOrDefault(x => x.Id == int.Parse(UserId) && x.Active == true && x.RolNavigation.Active == true);
            if (User == null)
                throw new NotFoundException(ExceptionMessage.NotFound($"User", UserId));
            #endregion

            #region Get User Menus
            var userMenus = User.RolNavigation.MenuXrols.Where(x => x.Menu.Active == true)
                                                          .ToList();

            if (userMenus == null)
                throw new NoAssignedException(ExceptionMessage.NoAssigned("User", "menus"));
            #endregion

            var userContainMenu = userMenus.FirstOrDefault(x => x.Menu.Name == requirement.Menu);

            if (userContainMenu != null)
                context.Succeed(requirement);
            else
                context.Fail();

            return Task.CompletedTask;
        }
    }
}
