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
    [Route("api/v{version:apiVersion}/menus/")]
    public class MenuController : Controller
    {
        private readonly IMenuRepository _menuRepository;

        public MenuController(IMenuRepository menuRepository)
        {
            _menuRepository = menuRepository;
        }

        /// <summary>
        /// Get all menus
        /// </summary>
        /// <returns></returns>
        [HttpGet, MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(List<MenuResponse>))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> GetMenus()
        {
            var menus = await this._menuRepository.GetMenus();
            return Ok(menus);
        }

        /// <summary>
        /// Get menu by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}"), MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(MenuResponse))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> GetMenusById(int id)
        {
            var menu = await _menuRepository.GetMenusById(id);
            return Ok(menu);
        }


        /// <summary>
        /// Get menu by user
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        [HttpGet("byuser/{userId}"), MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(MenuResponse))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> GetMenusByUser(int userId)
        {
            var menu = await _menuRepository.GetMenusByUser(userId);
            return Ok(menu);
        }

        /// <summary>
        /// Create new menu
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [AuthorizeRole(PermissionLevel.Administrator)]
        [AuthorizeMenu("Menus")]
        [HttpPost, MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(BasicResponse))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> CreateMenu(CreateMenuRequest request)
        {
            await _menuRepository.CreateMenu(request);
            return Ok(new BasicResponse { Success = true, Message = string.Format(ResourcesUtils.GetResponseMessage("ElementAdded"), ResourcesUtils.GetResponseMessage("Menu")) });
        }

        /// <summary>
        /// Update menu
        /// </summary>
        /// <param name="id"></param>
        /// <param name="request"></param>
        /// <returns></returns>
        [AuthorizeRole(PermissionLevel.Administrator)]
        [AuthorizeMenu("Menus")]
        [HttpPut("{id}"), MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(BasicResponse))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> UpdateMenu(int id, UpdateMenuRequest request)
        {
            await _menuRepository.UpdateMenu(id, request);
            return Ok(new BasicResponse { Success = true, Message = string.Format(ResourcesUtils.GetResponseMessage("ElementUpdated"), ResourcesUtils.GetResponseMessage("Menu")) });
        }

        /// <summary>
        /// Delete menus
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [AuthorizeRole(PermissionLevel.Administrator)]
        [AuthorizeMenu("Menus")]
        [HttpDelete("{id}"), MapToApiVersion(1.0)]
        [SwaggerResponse((int)HttpStatusCode.OK, Type = typeof(BasicResponse))]
        [SwaggerResponse((int)HttpStatusCode.BadRequest, Type = typeof(ErrorResponse))]
        [SwaggerResponse((int)HttpStatusCode.InternalServerError, Type = typeof(ErrorResponse))]
        public async Task<IActionResult> DeleteMenuById(int id)
        {
            await _menuRepository.DeleteMenuById(id);
            return Ok(new BasicResponse { Success = true, Message = string.Format(ResourcesUtils.GetResponseMessage("ElementDeleted"), ResourcesUtils.GetResponseMessage("Menu")) });
        }

    }
}
