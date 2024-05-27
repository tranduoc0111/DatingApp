using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    public class AdminController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly DataContext _dataContext;

        public AdminController(UserManager<AppUser> userManager, DataContext dataContext)
        {
            _userManager = userManager;
            _dataContext = dataContext;
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("users-with-roles")]
        public async Task<ActionResult> GetUserWithRoles()
        {
            var users = await _userManager.Users
                .Include(r => r.UserRoles)
                .ThenInclude(r => r.Role)
                .OrderBy(u => u.UserName)
                .Select(u => new
                {
                    u.Id,
                    Username = u.UserName,
                    Roles = u.UserRoles.Select(r => r.Role.Name).ToList()
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpPost("edit-roles/{username}")]
        public async Task<ActionResult> EditRoles(string username, [FromQuery] string roles)
        {
            if (string.IsNullOrEmpty(roles)) return BadRequest("You must select at least one role");

            var selectedRoles = roles.Split(",").ToArray();

            var user = await _userManager.FindByNameAsync(username);

            if (user == null) return NotFound();

            var userRoles = await _userManager.GetRolesAsync(user);

            var result = await _userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));

            if (!result.Succeeded) return BadRequest("Failed to add to roles");

            result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));

            if (!result.Succeeded) return BadRequest("Failed to remove from roles");

            return Ok(await _userManager.GetRolesAsync(user));
        }

        [HttpPost("update-role")]
        public async Task<ActionResult> UpdateRole(BillsDTo input)
        {
            try
            {
                var user = await _dataContext.Users.FirstOrDefaultAsync(u => u.UserName == input.Username);

                var userBill = await _dataContext.Bills.FirstOrDefaultAsync(b => b.UserId == user.Id && b.BillId == input.Id);
                if (userBill == null)
                {
                    return BadRequest("UserBill not found for the specified userId and billId");
                }

                var userRoles = await _dataContext.UserRoles
                    .Where(ur => ur.UserId == user.Id)
                    .ToListAsync();

                if (userBill.BillId == 1)
                {
                    foreach (var userRole in userRoles)
                    {
                        if (userRole.RoleId == 4)
                        {
                            _dataContext.UserRoles.Remove(userRole);
                            var newUserRole = new AppUserRole
                            {
                                UserId = user.Id,
                                RoleId = 1
                            };
                            _dataContext.UserRoles.Add(newUserRole);
                        }
                        else if(userRole.RoleId == 3 && userRole.RoleId != 4)
                        {
                            var newUserRole = new AppUserRole
                            {
                                UserId = user.Id,
                                RoleId = 1
                            };
                            _dataContext.UserRoles.Add(newUserRole);
                        }
                        else
                        {
                            return BadRequest("Failed to add to roles");
                        }
                    }
                }
                else if (userBill.BillId == 2)
                {
                    foreach (var userRole in userRoles)
                    {
                        if (userRole.RoleId == 4)
                        {
                            _dataContext.UserRoles.Remove(userRole);
                            var newUserRole = new AppUserRole
                            {
                                UserId = user.Id,
                                RoleId = 3
                            };
                            _dataContext.UserRoles.Add(newUserRole);
                        }
                        else if (userRole.RoleId == 1 && userRole.RoleId != 4)
                        {
                            var newUserRole = new AppUserRole
                            {
                                UserId = user.Id,
                                RoleId = 3
                            };
                            _dataContext.UserRoles.Add(newUserRole);
                        }
                        else
                        {
                            return BadRequest("Failed to add to roles");
                        }
                    }
                }

                await _dataContext.SaveChangesAsync();

                return Ok();
            }
            catch (DbUpdateException ex)
            {
                // Xử lý ngoại lệ khi lưu thay đổi vào cơ sở dữ liệu
                return StatusCode(500, $"Failed to update user roles: {ex.Message}");
            }
            catch (Exception ex)
            {
                // Xử lý các ngoại lệ khác
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


    [Authorize(Policy = "ModeratePhotoRole")]
        [HttpGet("photos-to-moderate")]
        public ActionResult GetPhotosForModeration()
        {
            return Ok("Admins or moderators can see this");
        }
    }
}
