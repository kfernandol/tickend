using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TicketsSupport.ApplicationCore.Configuration;
using TicketsSupport.ApplicationCore.DTOs;
using TicketsSupport.ApplicationCore.Entities;
using TicketsSupport.ApplicationCore.Exceptions;
using TicketsSupport.ApplicationCore.Interfaces;
using TicketsSupport.ApplicationCore.Utils;
using TicketsSupport.Infrastructure.Persistence.Contexts;

namespace TicketsSupport.Infrastructure.Persistence.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private readonly TS_DatabaseContext _context;
        private readonly ConfigJWT _configJWT;
        public AuthRepository(TS_DatabaseContext context, IOptions<ConfigJWT> configJWT)
        {
            _context = context;
            _configJWT = configJWT.Value;
        }

        public async Task<AuthResponse> AuthUserAsync(AuthRequest request)
        {

            var user = _context.Users.Include(x => x.RolNavigation)
                                     .FirstOrDefault(x => x.Username == request.Username && x.Active == true);
            if (user != null)
            {

                //Validate password
                var passwordValid = HashUtils.VerifyPassword(request.Password, user.Password, user.Salt);

                //Password Invalid
                if (!passwordValid)
                    throw new InvalidException(ExceptionMessage.Invalid("Password"));

                //Validate Rol and Permission Level
                if (user.RolNavigation == null)
                    throw new NoAssignedException(ExceptionMessage.NoAssigned("User", "Menu"));


                var token = TokenUtils.GenerateToken(user, _configJWT);
                var RefreshToken = TokenUtils.GenerateRefreshToken();

                var AuthResponse = new AuthResponse
                {
                    Token = token,
                    ExpirationMin = _configJWT.ExpirationMin,
                    TokenType = _configJWT.TokenType,
                    RefreshToken = RefreshToken.RefreshToken,
                };

                //Save refreshToken in DB
                user.RefreshToken = RefreshToken.RefreshTokenHash;
                user.RefreshTokenExpirationTime = DateTime.Now.AddMinutes(_configJWT.ExpirationRefreshTokenMin);
                _context.Update(user);
                await _context.SaveChangesAsync();

                return AuthResponse;
            }
            else
            {
                throw new NotFoundException(ExceptionMessage.NotFound("User", request.Username));
            }


        }

        public async Task<AuthResponse> AuthRefreshToken(string RefreshToken, string Username)
        {
            var user = await _context.Users.Include(x => x.RolNavigation)
                                            .FirstOrDefaultAsync(x => x.Username == Username);

            if (user == null)
                throw new NotFoundException(ExceptionMessage.NotFound("User", Username));

            var tokenIsExpired = (DateTime.Now - (user.RefreshTokenExpirationTime ?? DateTime.Now)).Minutes >= 0;

            if (tokenIsExpired)
            {
                user.RefreshToken = "";
                user.RefreshTokenExpirationTime = null;

                _context.Update(user);
                await _context.SaveChangesAsync();

                throw new InvalidException(ExceptionMessage.Invalid("RefreshToken"));
            }


            var tokenHash = user.RefreshToken.Split(".");
            var ValidateRefreshToken = HashUtils.VerifyPassword(RefreshToken, tokenHash[0], tokenHash[1]);

            if (!ValidateRefreshToken)
            {
                user.RefreshToken = "";
                _context.Update(user);
                await _context.SaveChangesAsync();

                throw new InvalidException(ExceptionMessage.Invalid("RefreshToken"));
            }

            //Generate new token
            var newToken = TokenUtils.GenerateToken(user, _configJWT);
            var newRefreshToken = TokenUtils.GenerateRefreshToken();

            var AuthResponse = new AuthResponse
            {
                Token = newToken,
                ExpirationMin = _configJWT.ExpirationMin,
                TokenType = _configJWT.TokenType,
                RefreshToken = newRefreshToken.RefreshToken
            };

            //Save new Refresh token in Db
            user.RefreshToken = newRefreshToken.RefreshTokenHash;
            user.RefreshTokenExpirationTime = DateTime.Now.AddMinutes(_configJWT.ExpirationRefreshTokenMin);
            _context.Update(user);
            await _context.SaveChangesAsync();

            return AuthResponse;

        }
    }
}
