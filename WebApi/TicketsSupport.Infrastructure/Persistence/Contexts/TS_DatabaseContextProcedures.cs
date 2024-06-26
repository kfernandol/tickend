﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading;
using System.Threading.Tasks;
using TicketsSupport.ApplicationCore.Entities;

namespace TicketsSupport.Infrastructure.Persistence.Contexts
{
    public partial class TS_DatabaseContext
    {
        private ITS_DatabaseContextProcedures _procedures;

        public virtual ITS_DatabaseContextProcedures Procedures
        {
            get
            {
                if (_procedures is null) _procedures = new TS_DatabaseContextProcedures(this);
                return _procedures;
            }
            set
            {
                _procedures = value;
            }
        }

        public ITS_DatabaseContextProcedures GetProcedures()
        {
            return Procedures;
        }
    }

    public partial class TS_DatabaseContextProcedures : ITS_DatabaseContextProcedures
    {
        private readonly TS_DatabaseContext _context;

        public TS_DatabaseContextProcedures(TS_DatabaseContext context)
        {
            _context = context;
        }
    }
}
