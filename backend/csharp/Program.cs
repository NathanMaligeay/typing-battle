using csharp.Data;
using csharp.Interfaces;
using csharp.Models;
using csharp.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.HttpOverrides;
using Npgsql.EntityFrameworkCore.PostgreSQL;


var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddEnvironmentVariables();

//var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL");
//var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
//Console.WriteLine(connectionString);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
Console.WriteLine(connectionString);

builder.Services.AddDbContext<ApplicationDBContext>(options => {
    options.UseNpgsql(connectionString)
    .EnableDetailedErrors()
    .EnableSensitiveDataLogging();
});

builder.Services.AddIdentity<AppUser, IdentityRole>(options => {
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 12;
})
.AddEntityFrameworkStores<ApplicationDBContext>();

builder.Services.AddScoped<IGameRepository, GameRepository>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowVercel", policy =>
    {
        policy.WithOrigins("https://typing-battle-eight.vercel.app",
            "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

var app = builder.Build();

//Console.WriteLine(Environment.GetEnvironmentVariable("DATABASE_URL"));
//Console.WriteLine(builder.Configuration.GetValue<string>("DATABASE_URL"));

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

app.UseCors("AllowVercel");

app.UseAuthorization();

app.MapControllers();

app.Run();
