﻿using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using TicketsSupport.ApplicationCore.Authorization.Menu;
using TicketsSupport.ApplicationCore.Authorization.Role;
using TicketsSupport.ApplicationCore.Commons;
using TicketsSupport.ApplicationCore.DTOs;
using TicketsSupport.ApplicationCore.Interfaces;
using TicketsSupport.ApplicationCore.Utils;
using TicketsSupport.Infrastructure.Persistence.Repositories;

namespace TicketsSupport.WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/roles/")]
    public class RolController : Controller
    {
        private readonly IRolRepository _rolRepository;

        public RolController(IRolRepository rolRepository)
        {
            _rolRepository = rolRepository;
        }

        /// <summary>
        /// Get all roles
        /// </summary>
        /// <returns></returns>
        [AuthorizeMenu("Roles")]
        [HttpGet, MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(RolResponse))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> GetRoles()
        {
            var users = await this._rolRepository.GetRol();
            return Ok(users);
        }

        /// <summary>
        /// Get rol by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [AuthorizeMenu("Roles")]
        [HttpGet("{id}"), MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(RolResponse))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> GetRolById(int id)
        {
            var user = await _rolRepository.GetRolById(id);
            return Ok(user);
        }

        /// <summary>
        /// Create new rol
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [AuthorizeMenu("Roles")]
        [HttpPost, MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(BasicResponse))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> Create(CreateRolRequest request)
        {
            await _rolRepository.CreateRol(request);
            return Ok(new BasicResponse { Success = true, Message = ResourcesUtils.GetResponseMessage("NewRolAdded") });
        }

        /// <summary>
        /// Update roles
        /// </summary>
        /// <param name="id"></param>
        /// <param name="request"></param>
        /// <returns></returns>
        [AuthorizeMenu("Roles")]
        [HttpPut("{id}"), MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(BasicResponse))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> Update(int id, UpdateRolRequest request)
        {
            await _rolRepository.UpdateRol(id, request);
            return Ok(new BasicResponse { Success = true, Message = ResourcesUtils.GetResponseMessage("RolUpdated") });
        }

        /// <summary>
        /// Delete roles
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [AuthorizeMenu("Roles")]
        [AuthorizeRole(PermissionLevel.Administrator)]
        [HttpDelete("{id}"), MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(BasicResponse))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> Delete(int id)
        {
            await _rolRepository.DeleteRolById(id);
            return Ok(new BasicResponse { Success = true, Message = ResourcesUtils.GetResponseMessage("RolDeleted") });
        }

        /// <summary>
        /// Get all permission levels
        /// </summary>
        /// <returns></returns>
        [AuthorizeMenu("Roles")]
        [HttpGet("PermissionLevels"), MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(PermissionLevelResponse))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> GetPermissionLevels()
        {
            var permissionLevels = await this._rolRepository.GetPermissionLevels();
            return Ok(permissionLevels);
        }

    }
}
