using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using TicketsSupport.ApplicationCore.Configuration;
using TicketsSupport.ApplicationCore.Entities;

namespace TicketsSupport.ApplicationCore.Utils
{
    public class TokenUtils
    {

        /// <summary>
        /// Generate JWT Token
        /// </summary>
        /// <param name="user">User data with RolNavegation and Peermission Level Include</param>
        /// <param name="configJWT">Config JWT in Appsetting</param>
        /// <returns></returns>
        public static string GenerateToken(User user, ConfigJWT configJWT)
        {
            var key = Encoding.ASCII.GetBytes(configJWT.Key);

            var TokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("id", $"{user.Id}"),
                    new Claim(JwtRegisteredClaimNames.Sub, user.Username),
                    new Claim(JwtRegisteredClaimNames.Name, $"{user.FirstName} {user.LastName}"),
                    new Claim(JwtRegisteredClaimNames.Email, user.Email),
                    new Claim("PermissionLevel", user.RolNavigation.PermissionLevel.ToString()),
                }),
                Expires = DateTime.UtcNow.AddMinutes(configJWT.ExpirationMin),
                Issuer = configJWT.Issuer,
                Audience = configJWT.Audience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha512Signature),
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(TokenDescriptor);
            var jwtToken = tokenHandler.WriteToken(token);
            return jwtToken;
        }


        public static (string RefreshToken, string RefreshTokenHash) GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);

            var RefreshToken = Convert.ToBase64String(randomNumber);
            var RefreshTokenHash = HashUtils.HashPassword(RefreshToken);
            var RefreshTokenHashFinal = $"{RefreshTokenHash.hashedPassword}.{RefreshTokenHash.salt}";

            return (RefreshToken, RefreshTokenHashFinal);
        }

        public static string GenerateRandomHash()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);

            var RandomBase64String = Convert.ToBase64String(randomNumber);
            var HashRandomBase64String = HashUtils.HashPassword(RandomBase64String);

            return HashRandomBase64String.hashedPassword;
        }
    }
}
