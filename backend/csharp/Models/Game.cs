using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace csharp.Models
{
    [Table("Games")]
    public class Game
    {
        public int Id { get; set; }
        public int WordsTyped { get; set; } = 0;
        public double Accuracy { get; set; } = 0;
        public int Score { get; set; } = 0;
        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
        public string AppUserId { get; set;}
        public AppUser AppUser { get; set; }
    }
}