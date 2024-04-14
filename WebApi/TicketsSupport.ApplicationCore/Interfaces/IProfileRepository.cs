using TicketsSupport.ApplicationCore.DTOs;

namespace TicketsSupport.ApplicationCore.Interfaces
{
    public interface IProfileRepository
    {
        Task<bool> UpdateProfile(int id, UpdateProfileRequest request);
    }
}
