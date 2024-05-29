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
        public async Task<IActionResult> AuthUserAsync(AuthRequest request)
        {
            var authResponse = await _authRepository.AuthUserAsync(request);
            return Ok(authResponse);
        }

        /// <summary>
        /// Login or Register with GoogleOAuth and return Token
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [Route("token/google")]
        [HttpPost, MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(AuthResponse))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> AuthUserGoogleAsync(AuthGoogleRequest request)
        {
            var authResponse = await _authRepository.AuthUserGoogleAsync(request);
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
        public async Task<IActionResult> AuthRefreshToken(RefreshTokenRequest request)
        {
            var authResponse = await _authRepository.AuthRefreshToken(request);
            return Ok(authResponse);
        }

        /// <summary>
        /// Register new User
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [Route("register")]
        [HttpPost, MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(AuthResponse))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> AuthRegisterUserAsync(AuthRegisterUserRequest request)
        {
            var authResponse = await _authRepository.AuthRegisterUserAsync(request);
            return Ok(authResponse);
        }

        /// <summary>
        /// Confirm new User and return token
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [Route("confirm")]
        [HttpPost, MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(AuthResponse))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> AuthRegisterConfirmationAsync([FromBody] string HashConfirmation)
        {
            var authResponse = await _authRepository.AuthRegisterConfirmationAsync(HashConfirmation);
            return Ok(authResponse);
        }

        /// <summary>
        /// User request reset password
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [Route("reset-password")]
        [HttpPut, MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(BasicResponse))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> ResetPassword(ResetPasswordRequest request)
        {
            var resetResponse = await _authRepository.ResetPassword(request);

            if (resetResponse)
                return Ok(new BasicResponse { Success = true, Message = "Reset completed" });

            else
                return Ok(new BasicResponse { Success = false, Message = "Error" });

        }

        /// <summary>
        /// Change passwword user
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [Route("change-password")]
        [HttpPut, MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(BasicResponse))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> ChangePassword(ChangePasswordRequest request)
        {
            var resetResponse = await _authRepository.ChangePassword(request);

            if (resetResponse)
                return Ok(new BasicResponse { Success = true, Message = "Change password completed" });

            else
                return Ok(new BasicResponse { Success = false, Message = "Error" });

        }

    }
}
