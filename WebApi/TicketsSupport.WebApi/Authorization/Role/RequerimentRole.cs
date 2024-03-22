using Microsoft.AspNetCore.Authorization;

namespace TicketsSupport.ApplicationCore.Authorization.Role
{
    public class RequerimentRole : IAuthorizationRequirement
    {
        public string Role { get;set; }
        public RequerimentRole(string role) => Role = role;
    }
}
