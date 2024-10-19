using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using csharp.DTOs;
using csharp.DTOs.Account;
using csharp.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace csharp.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO loginDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.UserName == loginDTO.Username.ToLower());

            if (user == null) return Unauthorized("Username not found or password incorrect");

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDTO.Password, false);

            if (!result.Succeeded) return Unauthorized("Username not found or password incorrect");

            return Ok(
                new NewUserDTO
                {
                    Username = user.UserName,
                }
            );
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO registerDTO)
        {
            try {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                var appUser = new AppUser 
                {
                    UserName = registerDTO.Username,
                };

                var createdUser = await _userManager.CreateAsync(appUser, registerDTO.Password);

                if (createdUser.Succeeded) 
                {
                    return Ok(
                        new NewUserDTO
                        {
                            Username = appUser.UserName,
                        }
                    );
                } else return StatusCode(500, createdUser.Errors);
            } catch (Exception e) 
            {
                return StatusCode(500, e);
            }
        }
        [HttpDelete("{username}")]
        public async Task<IActionResult> Delete([FromRoute] string username)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var appUser = await _userManager.FindByNameAsync(username);

            if (appUser == null) return NotFound("User not found");

            var existingUser = await _userManager.DeleteAsync(appUser);
            
            if (existingUser == null) return NotFound("Cannot delete user");

            return NoContent();
        } 
    }
}