using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace csharp.DTOs.Game
{
    public class GameDTO
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public int WordsTyped { get; set; }
        [Required]
        public double Accuracy { get; set; }
        [Required]
        public int Score { get; set; }
        [Required]
        public DateTime CreatedOn { get; set; } = DateTime.Now;
        public string AppUserId {get; set;}
    }
}