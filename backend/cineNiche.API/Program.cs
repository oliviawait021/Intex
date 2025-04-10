using System.Collections.Generic;
using System.Collections.Immutable;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using cineNiche.API.Services;
using cineNiche.API.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;

var builder = WebApplication.CreateBuilder(args);

// // HTTPS with your custom cert
// builder.WebHost.ConfigureKestrel(serverOptions =>
// {
//     serverOptions.ListenLocalhost(5000, listenOptions =>
//     {
//         listenOptions.UseHttps(); // Uses your trusted dev cert
//     });
// });

DotNetEnv.Env.Load("backend.env"); // or just .Env.Load() if it's in the root

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database Context
builder.Services.AddDbContext<MoviesContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("MovieConnection")));
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("IdentityConnection")));

// Add authorization
builder.Services.AddAuthorization();

// Add authentication for google
builder.Services.AddAuthentication(options =>
    {
        options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
    })
    .AddGoogle(options =>
    {
        var clientId = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID");
        var clientSecret = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_SECRET");

        if (string.IsNullOrWhiteSpace(clientId))
            throw new InvalidOperationException("Missing GOOGLE_CLIENT_ID environment variable.");
        if (string.IsNullOrWhiteSpace(clientSecret))
            throw new InvalidOperationException("Missing GOOGLE_CLIENT_SECRET environment variable.");

        options.ClientId = clientId;
        options.ClientSecret = clientSecret;
        options.Events.OnCreatingTicket = async context =>
        {
            var email = context.Principal.FindFirstValue(ClaimTypes.Email);

            var userManager = context.HttpContext.RequestServices.GetRequiredService<UserManager<IdentityUser>>();
            var signInManager = context.HttpContext.RequestServices.GetRequiredService<SignInManager<IdentityUser>>();

            var user = await userManager.FindByEmailAsync(email);

            if (user == null)
            {
                user = new IdentityUser
                {
                    UserName = email,
                    Email = email,
                    EmailConfirmed = true
                };

                await userManager.CreateAsync(user);
            }

            await signInManager.SignInAsync(user, isPersistent: false);
        };
    });

//Add user and role identity, includes password credentials
builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
    {
        options.Password.RequireDigit = false;
        options.Password.RequireLowercase = false;
        options.Password.RequireUppercase = false;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequiredLength = 15;
        options.Password.RequiredUniqueChars = 0;
    })
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.Configure<IdentityOptions>(options =>
{
    options.ClaimsIdentity.UserIdClaimType = ClaimTypes.NameIdentifier;
    options.ClaimsIdentity.UserNameClaimType = ClaimTypes.Email; // Ensure email is stored in claims
});

builder.Services.AddScoped<IUserClaimsPrincipalFactory<IdentityUser>, CustomUserClaimsPrincipalFactory>();

// Cors Settings
builder.Services.AddCors(options =>
    options.AddPolicy("AllowReactAppBlah",
    policy =>
    {
        policy.WithOrigins("https://localhost:3000", "http://localhost:3000", "https://purple-moss-0726eb41e.6.azurestaticapps.net")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    }));

// Email identity skeleton
builder.Services.AddSingleton<IEmailSender<IdentityUser>, NoOpEmailSender<IdentityUser>>();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.None; // Updated for cross-origin support
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // Ensure cookies are secure
    options.Cookie.Name = ".AspNetCore.Identity.Application";
    options.LoginPath = "/login";
    
    options.Events = new CookieAuthenticationEvents
    {
        OnRedirectToLogin = context =>
        {
            context.Response.StatusCode = 401;
            return context.Response.WriteAsync("{\"error\": \"Login required.\"}");
        },
        OnRedirectToAccessDenied = context =>
        {
            context.Response.StatusCode = 403;
            return context.Response.WriteAsync("{\"error\": \"Access denied.\"}");
        }
    };
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactAppBlah");

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.MapIdentityApi<IdentityUser>();

// Logout post
app.MapPost("/logout", async (HttpContext context, SignInManager<IdentityUser> signInManager) =>
{
    await signInManager.SignOutAsync();

    // Ensure authentication cookie is removed
    context.Response.Cookies.Delete(".AspNetCore.Identity.Application", new CookieOptions
    {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.None, // Updated for cross-origin support
        Path = "/",
    });

    return Results.Ok(new { message = "Logout successful" });
}).RequireAuthorization();

// Ping Auth api endpoint
app.MapGet("/pingauth", async (ClaimsPrincipal user, UserManager<IdentityUser> userManager) =>
{
    try
    {
        Console.WriteLine("🔔 /pingauth called");

        if (!user.Identity?.IsAuthenticated ?? false)
        {
            Console.WriteLine("⚠️ User is not authenticated.");
            return Results.Unauthorized();
        }

        var email = user.FindFirstValue(ClaimTypes.Email) ?? "unknown@example.com";
        Console.WriteLine($"📧 Email from claims: {email}");

        var identityUser = await userManager.FindByEmailAsync(email);

        if (identityUser == null)
        {
            Console.WriteLine("❌ No user found with that email.");
            return Results.BadRequest(new { error = "User not found for email: " + email });
        }

        var roles = await userManager.GetRolesAsync(identityUser);
        var isAdmin = roles.Contains("Admin");

        Console.WriteLine("✅ User and roles successfully retrieved.");

        return Results.Json(new
        {
            email = email,
            roles = roles,
            isAdmin = isAdmin,
            isAuthenticated = true
        });
    }
    catch (Exception ex)
    {
        Console.WriteLine("🔥 PingAuth error:");
        Console.WriteLine(ex.ToString());

        return Results.Problem($"PingAuth error: {ex.Message}\n{ex.StackTrace}");
    }
}).RequireAuthorization().RequireCors("AllowReactAppBlah");

// google login endpoint
app.MapGet("/login-google", async context =>
{
    await context.ChallengeAsync(GoogleDefaults.AuthenticationScheme, new AuthenticationProperties
    {
        RedirectUri = "https://purple-moss-0726eb41e.6.azurestaticapps.net/movies" // Updated for production
    });
});

app.Run();
