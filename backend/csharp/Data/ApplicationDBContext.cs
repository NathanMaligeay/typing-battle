using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using csharp.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace csharp.Data
{
    public class ApplicationDBContext : IdentityDbContext<AppUser>
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> dbContextOptions) : base(dbContextOptions)
        {
            
        }
        public DbSet<Game> Games { get; set; }
        
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Game>()
                .HasOne(g => g.AppUser)
                .WithMany(u => u.Games)
                .HasForeignKey(g => g.AppUserId);
        }
    }
}