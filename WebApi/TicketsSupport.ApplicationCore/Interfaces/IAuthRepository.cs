﻿using TicketsSupport.ApplicationCore.DTOs;

namespace TicketsSupport.ApplicationCore.Interfaces
{
    public interface IAuthRepository
    {
        Task<AuthResponse> AuthUserAsync(AuthRequest request);
        Task<AuthResponse> AuthRefreshToken(string RefreshToken, string Username);
        Task<bool> ResetPassword(ResetPasswordRequest request);
        Task<bool> ChangePassword(ChangePasswordRequest request);
    }
}
