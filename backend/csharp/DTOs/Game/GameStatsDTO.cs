using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace csharp.DTOs.Game
{
    public class GameStatsDTO
    {
        public int Count { get; set; }
        public int TotalWordsTyped { get; set; }
        public decimal MeanWordsTyped { get; set; }
        public decimal MeanAccuracy { get; set; }
        public decimal MeanScore { get; set; }
    }
}