using Microsoft.AspNetCore.Authorization;
using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketsSupport.ApplicationCore.Authorization.Role
{
    public class AuthorizeRoleAttribute : AuthorizeAttribute, IAuthorizationRequirement, IAuthorizationRequirementData
    {
        public AuthorizeRoleAttribute(PermissionLevel permissionLevel) => PermissionLevel = permissionLevel;
        public PermissionLevel PermissionLevel { get; }
        public IEnumerable<IAuthorizationRequirement> GetRequirements()
        {
            yield return this;
        }
    }
}
