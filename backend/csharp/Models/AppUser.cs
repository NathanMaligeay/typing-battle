using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace csharp.Models
{
    public class AppUser : IdentityUser
    {
        public List<Game> Games { get; set; } = new List<Game>();
    }
}