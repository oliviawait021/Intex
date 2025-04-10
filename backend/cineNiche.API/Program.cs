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
Console.WriteLine("🌱 Environment variables loaded from backend.env");

// Add services to the container.

builder.Services.AddControllers();
Console.WriteLine("🔧 Controllers added");

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
Console.WriteLine("📘 Swagger setup added");

// Database Context
builder.Services.AddDbContext<MoviesContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("MovieConnection")));
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("IdentityConnection")));
Console.WriteLine("🗄️ Database contexts configured");

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
        options.ClientId = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID");
        options.ClientSecret = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_SECRET");
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
Console.WriteLine("🔐 Authentication configured");

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
Console.WriteLine("🆔 Identity services configured");

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
Console.WriteLine("🌐 CORS policy configured");

// Email identity skeleton
builder.Services.AddSingleton<IEmailSender<IdentityUser>, NoOpEmailSender<IdentityUser>>();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Strict; // Important for cross-site cookies
    options.Cookie.Name = ".AspNetCore.Identity.Application";
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.LoginPath = "/login";
    
    options.Events = new CookieAuthenticationEvents
    {
        OnRedirectToLogin = context =>
        {
            context.Response.StatusCode = 401;
            context.Response.ContentType = "application/json";
            return context.Response.WriteAsync("{\"error\": \"You must be logged in to access this resource.\"}");
        },
        OnRedirectToAccessDenied = context =>
        {
            context.Response.StatusCode = 403;
            context.Response.ContentType = "application/json";
            return context.Response.WriteAsync("{\"error\": \"Access denied. Admins only.\"}");
        }
    };
});
Console.WriteLine("🍪 Application cookie configured");

var app = builder.Build();
Console.WriteLine("🚀 App built and ready to configure middleware");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    Console.WriteLine("🛠️ Development environment detected — enabling Swagger UI");
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactAppBlah");
Console.WriteLine("🧰 CORS middleware activated");

app.UseHttpsRedirection();
Console.WriteLine("🔐 HTTPS redirection enabled");

app.UseAuthentication();
Console.WriteLine("👤 Authentication middleware enabled");

app.UseAuthorization();
Console.WriteLine("🔒 Authorization middleware enabled");

app.MapControllers();
Console.WriteLine("📡 Controller routes mapped");

app.MapIdentityApi<IdentityUser>();
Console.WriteLine("👥 Identity API endpoints mapped");

// Logout post
app.MapPost("/logout", async (HttpContext context, SignInManager<IdentityUser> signInManager) =>
{
    await signInManager.SignOutAsync();

    // Ensure authentication cookie is removed
    context.Response.Cookies.Delete(".AspNetCore.Identity.Application", new CookieOptions
    {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.Strict,
        Path = "/",
        Domain = "localhost" // 👈 IMPORTANT: matches the cookie domain
    });

    return Results.Ok(new { message = "Logout successful" });
}).RequireAuthorization();

// Ping Aut api enpoint
app.MapGet("/pingauth", async (ClaimsPrincipal user, UserManager<IdentityUser> userManager) =>
{
    if (!user.Identity?.IsAuthenticated ?? false)
    {
        return Results.Unauthorized();
    }

    var email = user.FindFirstValue(ClaimTypes.Email) ?? "unknown@example.com";
    var identityUser = await userManager.FindByEmailAsync(email);
    var roles = identityUser != null ? await userManager.GetRolesAsync(identityUser) : new List<string>();
    var isAdmin = user.IsInRole("Admin");

    Console.WriteLine("🔐 IsInRole(Admin): " + isAdmin);
    Console.WriteLine("👤 User.Identity.Name: " + user.Identity?.Name);

    return Results.Json(new
    {
        email = email,
        roles = roles,
        isAdmin = isAdmin,
        isAuthenticated = user.Identity?.IsAuthenticated ?? false
    });
}).RequireAuthorization().RequireCors("AllowReactAppBlah");

// google login and logout endpoints
app.MapGet("/login-google", async context =>
{
    await context.ChallengeAsync(GoogleDefaults.AuthenticationScheme, new AuthenticationProperties
    {
        RedirectUri = "http://localhost:3000/movies"
    });
});

app.MapGet("/logout", async context =>
{
    await context.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    context.Response.Cookies.Delete(".AspNetCore.Identity.Application", new CookieOptions
    {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.None,
        Path = "/",
    });
    context.Response.Redirect("/");
}).RequireCors("AllowReactAppBlah");

app.Run();
Console.WriteLine("🚦 App is now running");
