using Azure.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Web;
using TicketsSupport.ApplicationCore.Configuration;
using TicketsSupport.ApplicationCore.DTOs;
using TicketsSupport.ApplicationCore.Entities;
using TicketsSupport.ApplicationCore.Exceptions;
using TicketsSupport.ApplicationCore.Interfaces;
using TicketsSupport.ApplicationCore.Utils;
using TicketsSupport.Infrastructure.Persistence.Contexts;
using TicketsSupport.Infrastructure.Services.Email;

namespace TicketsSupport.Infrastructure.Persistence.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private readonly HttpClient _httpClient;
        private readonly TS_DatabaseContext _context;
        private readonly ConfigJWT _configJWT;
        private readonly WebApp _webAppConfig;
        private readonly IEmailSender _emailSender;
        public AuthRepository(HttpClient httpClient, TS_DatabaseContext context, IOptions<ConfigJWT> configJWT, IOptions<WebApp> webAppConfig, IEmailSender emailSender)
        {
            _context = context;
            _configJWT = configJWT.Value;
            _emailSender = emailSender;
            _webAppConfig = webAppConfig.Value;
            _httpClient = httpClient;
        }

        public async Task<AuthResponse> AuthUserAsync(AuthRequest request)
        {

            var user = _context.Users.Include(x => x.RolNavigation)
                                     .AsNoTracking()
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
                await _context.SaveChangesAsync(user.Id, InterceptorActions.Modified);

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

            bool refreshTokenIsExpired = user.RefreshTokenExpirationTime.HasValue && DateTime.Now >= user.RefreshTokenExpirationTime.Value;

            if (refreshTokenIsExpired)
            {
                user.RefreshToken = "";
                user.RefreshTokenExpirationTime = null;

                _context.Update(user);
                await _context.SaveChangesAsync(user.Id, InterceptorActions.Modified);

                throw new InvalidException(ExceptionMessage.Invalid("RefreshToken"));
            }


            var tokenHash = user.RefreshToken.Split(".");
            var ValidateRefreshToken = HashUtils.VerifyPassword(RefreshToken, tokenHash[0], tokenHash[1]);

            if (!ValidateRefreshToken)
            {
                user.RefreshToken = "";
                user.RefreshTokenExpirationTime = null;
                _context.Update(user);
                await _context.SaveChangesAsync(user.Id, InterceptorActions.Modified);

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
            await _context.SaveChangesAsync(user.Id, InterceptorActions.Modified);

            return AuthResponse;

        }

        public async Task<bool> ResetPassword(ResetPasswordRequest request)
        {
            try
            {
                var HashReset = TokenUtils.GenerateRandomHash();
                var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == request.Email);

                if (user != null)
                {
                    UserRestorePassword restorePassword = new UserRestorePassword();

                    restorePassword.UserId = user.Id;
                    restorePassword.Hash = HashReset;
                    restorePassword.CreateDate = DateTime.Now;
                    restorePassword.ExpirationDate = DateTime.Now.AddDays(1);

                    _context.Add(restorePassword);
                    await _context.SaveChangesAsync(user.Id, InterceptorActions.Modified);

                    var resetPasswordLink = $"{_webAppConfig.Url}/ChangePassword/{HttpUtility.UrlEncode(HashReset)}";

                    Dictionary<string, string> EmailData = new Dictionary<string, string>
                    {
                        {"FullName", $"{user.FirstName} {user.LastName}"},
                        {"ResetLink", resetPasswordLink},
                    };

                    await _emailSender.SendEmail(request.Email, string.Empty, EmailTemplate.ResetPassword, EmailData);
                }

                return true;
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error reset password");
                return false;
            }
        }

        public async Task<bool> ChangePassword(ChangePasswordRequest request)
        {
            try
            {
                var restorePassword = await _context.UserRestorePasswords.Include(x => x.User)
                                                                         .FirstOrDefaultAsync(x => x.Hash == request.Hash && x.Used == false);

                if (restorePassword == null)
                    throw new NotFoundException(ExceptionMessage.Invalid("Restore Password"));

                if (DateTime.Now >= restorePassword.ExpirationDate)
                    throw new InvalidException(ExceptionMessage.Invalid("Token reset expired"));



                //Change password
                var passwordHashed = HashUtils.HashPassword(request.Password);
                restorePassword.User.Password = passwordHashed.hashedPassword;
                restorePassword.User.Salt = passwordHashed.salt;

                //Mark Hash used
                restorePassword.Used = true;

                _context.Update(restorePassword);

                Dictionary<string, string> EmailData = new Dictionary<string, string>
                    {
                        {"FullName", $"{restorePassword.User.FirstName} {restorePassword.User.LastName}"},
                        {"Subject", ResourcesUtils.GetEmailSimpleMessage("SubjectPasswordChanged")},
                        {"Message", ResourcesUtils.GetEmailSimpleMessage("MessagePasswordChanged")},
                    };

                await _emailSender.SendEmail(restorePassword.User.Email, string.Empty, EmailTemplate.SimpleMessage, EmailData);
                await _context.SaveChangesAsync(restorePassword.User.Id, InterceptorActions.Modified);

                return true;
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error change password");
                return false;
            }
        }

        public async Task<AuthResponse> AuthUserGoogleAsync(AuthGoogleRequest request)
        {
            GoogleOAuthResponse? GoogleOAuthResponse = null;
            User? user = null;
            try
            {
                var requestUserData = new HttpRequestMessage(HttpMethod.Get, "https://www.googleapis.com/oauth2/v3/userinfo");
                requestUserData.Headers.Authorization = new AuthenticationHeaderValue(request.token_type, request.access_token);

                var response = await _httpClient.SendAsync(requestUserData);
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync();
                GoogleOAuthResponse = JsonSerializer.Deserialize<GoogleOAuthResponse>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            }
            catch (Exception ex)
            {
                throw new InvalidException("GoogleOAuth Error");
            }

            if (GoogleOAuthResponse == null)
                throw new InvalidException("GoogleOAuth Error");


            user = await _context.Users.Include(x => x.RolNavigation)
                                           .FirstOrDefaultAsync(x => x.Email == GoogleOAuthResponse.Email && x.Active == true);

            if (user == null) //Register user
            {
                var imageBytes = await _httpClient.GetByteArrayAsync(GoogleOAuthResponse.Picture);
                var base64Image = Convert.ToBase64String(imageBytes);
                var imageFormat = DetectUtils.DetectImageFormat(imageBytes);

                user = new User
                {
                    Username = GeneratorsRandom.Username(GoogleOAuthResponse.Given_name, GoogleOAuthResponse.Family_name, GoogleOAuthResponse.Email),
                    FirstName = GoogleOAuthResponse.Given_name,
                    LastName = GoogleOAuthResponse.Family_name,
                    Email = GoogleOAuthResponse.Email,
                    Password = string.Empty,
                    Salt = string.Empty,
                    Photo = $"data:image/{imageFormat};base64,{base64Image}",
                    Active = true
                };
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }

            //Validate user and return token
            if (user != null)
            {
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
                await _context.SaveChangesAsync(user.Id, InterceptorActions.Modified);

                return AuthResponse;
            }
            else
            {
                throw new NotFoundException(ExceptionMessage.NotFound("User"));
            }
        }

        private class GoogleOAuthResponse
        {
            public string Sub { get; set; }
            public string Name { get; set; }
            public string Given_name { get; set; }
            public string Family_name { get; set; }
            public string Picture { get; set; }
            public string Email { get; set; }
            public bool Email_verified { get; set; }
            public string Locale { get; set; }
        }
    }
}
