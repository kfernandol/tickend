using TicketsSupport.ApplicationCore.DTOs;

namespace TicketsSupport.ApplicationCore.Interfaces
{
    public interface IAuthRepository
    {
        Task<AuthResponse> AuthUserAsync(AuthRequest request);
        Task<AuthResponse> AuthUserGoogleAsync(AuthGoogleRequest request);
        Task<bool> AuthRegisterUserAsync(AuthRegisterUserRequest request);
        Task<AuthResponse> AuthRegisterConfirmationAsync(string HashConfirmation);
        Task<AuthResponse> AuthRefreshToken(RefreshTokenRequest request);
        Task<bool> ResetPassword(ResetPasswordRequest request);
        Task<bool> ChangePassword(ChangePasswordRequest request);
    }
}
