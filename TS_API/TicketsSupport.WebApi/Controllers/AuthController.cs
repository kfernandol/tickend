using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TicketsSupport.ApplicationCore.Commons;
using TicketsSupport.ApplicationCore.DTOs;
using TicketsSupport.ApplicationCore.Interfaces;

namespace TicketsSupport.Server.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _authRepository;
        public AuthController(IAuthRepository authRepository)
        {
            _authRepository = authRepository;
        }


        /// <summary>
        /// Generate Token Authentication
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [Route("token")]
        [HttpPost, MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(AuthResponse))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> Auth(AuthRequest request)
        {
            var authResponse = await _authRepository.AuthUserAsync(request);
            return Ok(authResponse);
        }

        /// <summary>
        /// Generate new token with refresh token
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [Route("refresh-token")]
        [HttpPost, MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(AuthResponse))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> RefreshToken(RefreshTokenRequest request)
        {
            var authResponse = await _authRepository.AuthRefreshToken(request.RefreshToken, request.Username);
            return Ok(authResponse);
        }

    }
}
