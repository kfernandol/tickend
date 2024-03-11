using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketsSupport.ApplicationCore.DTOs
{
    public class CreateUserRequest
    {
        [MaxLength(150)]
        public string FirstName { get; set; }

        [MaxLength(150)]
        public string LastName { get; set; }

        [MaxLength(50)]
        [Required]
        public string Username { get; set; }

        [MaxLength(200)]
        public string Email { get; set; }

        [MaxLength(50)]
        [Required]
        public string Password { get; set; }

        public int RolId { get; set; }

        public bool Active { get; set; }
    }

    public class UpdateUserRequest : CreateUserRequest
    {
        [Required]
        public int Id { get; set; }
    }

    public class UserResponse
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public int RolId { get; set; }
        public bool Active { get; set; }
    }
}
