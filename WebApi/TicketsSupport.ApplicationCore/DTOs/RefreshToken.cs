﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketsSupport.ApplicationCore.DTOs
{
    public class RefreshTokenRequest
    {
        public string RefreshToken { get; set; }
        public string Username { get; set; }
    }
}
