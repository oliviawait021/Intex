using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks; // Added import for Task

namespace cineNiche.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;

        public AuthController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost("google")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleTokenRequest request)
        {
            try
            {
                var payload = await GoogleJsonWebSignature.ValidateAsync(request.Token);

                var user = await _userManager.FindByEmailAsync(payload.Email);
                if (user == null)
                {
                    user = new IdentityUser
                    {
                        Email = payload.Email,
                        UserName = payload.Email,
                        EmailConfirmed = true
                    };

                    await _userManager.CreateAsync(user);
                }

                await _signInManager.SignInAsync(user, isPersistent: false);
                return Ok(new { message = "Signed in successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = "Invalid token", details = ex.Message });
            }
        }

        [HttpGet("userinfo")]
        public async Task<IActionResult> GetUserInfo()
        {
            var user = HttpContext.User;

            var isAuthenticated = user.Identity?.IsAuthenticated ?? false;
            var userName = user.Identity?.Name ?? "";

            if (!isAuthenticated)
            {
                return Ok(new
                {
                    isAuthenticated = false,
                    isAdmin = false,
                    userName = ""
                });
            }

            var identityUser = await _userManager.FindByNameAsync(userName);
            var roles = await _userManager.GetRolesAsync(identityUser);

            return Ok(new
            {
                isAuthenticated = true,
                isAdmin = roles.Contains("Admin"),
                userName
            });
        }
    }

    public class GoogleTokenRequest
    {
        public string Token { get; set; }
    }
    
}