using Microsoft.AspNetCore.Authorization;

namespace TicketsSupport.WebApi.Authorization.Menu
{
    public class RequerimentMenu : IAuthorizationRequirement
    {
        public string Menu { get;set; }
        public RequerimentMenu(string menu) => Menu = menu;
    }
}
