using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;

namespace TicketsSupport.WebApi.Authorization.Menu
{
    public class AuthorizationPolicyProviderMenu : IAuthorizationPolicyProvider
    {
        //Atributes
        const string POLICY_PREFIX = "Menu";
        public DefaultAuthorizationPolicyProvider FallbackPolicyProvider { get; }

        //Constructor
        public AuthorizationPolicyProviderMenu(IOptions<AuthorizationOptions> options)
        {
            FallbackPolicyProvider = new DefaultAuthorizationPolicyProvider(options);
        }

        public Task<AuthorizationPolicy> GetDefaultPolicyAsync() => FallbackPolicyProvider.GetDefaultPolicyAsync();

        public Task<AuthorizationPolicy?> GetFallbackPolicyAsync() => FallbackPolicyProvider.GetFallbackPolicyAsync();

        public Task<AuthorizationPolicy?> GetPolicyAsync(string policyName)
        {
            if (policyName.StartsWith(POLICY_PREFIX, StringComparison.OrdinalIgnoreCase))
            {
                var menu = policyName.Substring(POLICY_PREFIX.Length);
                var policy = new AuthorizationPolicyBuilder(
                                                    JwtBearerDefaults.AuthenticationScheme);
                policy.AddRequirements(new RequerimentMenu(menu));
                return Task.FromResult<AuthorizationPolicy?>(policy.Build());
            }

            return Task.FromResult<AuthorizationPolicy?>(null);
        }
    }
}
