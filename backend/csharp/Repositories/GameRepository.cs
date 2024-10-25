using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using csharp.Data;
using csharp.DTOs.Game;
using csharp.Helpers;
using csharp.Interfaces;
using csharp.Models;
using Microsoft.EntityFrameworkCore;

namespace csharp.Repositories
{
    public class GameRepository : IGameRepository

    {
        private readonly ApplicationDBContext _context;
        public GameRepository(ApplicationDBContext context)
        {
            _context = context;
        }
        public async Task<Game> CreateAsync(Game gameModel)
        {
            await _context.Games.AddAsync(gameModel);
            await _context.SaveChangesAsync();
            return gameModel;
        }

        public async Task<List<Game>> GetAllAsync(string username)
        {
            var games = _context.Games.AsQueryable();

            if (!string.IsNullOrWhiteSpace(username))
            {
                games = games.Where(a => a.AppUser.UserName == username);
            }

            return await games.OrderByDescending(g => g.CreatedOn).ToListAsync();
        }

        public async Task<Game> GetByIdAsync(int id)
        {
            return await _context.Games.FirstOrDefaultAsync(g => g.Id == id);
        }

        public async Task<GameStatsDTO> GetGameStatisticsAsync(string username)
        {
            var gameStats = new GameStatsDTO();

            var result = await _context.Games
                .Where(g => g.AppUser.UserName == username)
                .GroupBy(g => g.AppUser.UserName)
                .Select(g => new
                {
                    Count = g.Count(),
                    TotalWordsTyped = (int?)g.Sum(g => g.WordsTyped),
                    MeanWordsTyped = (decimal?)g.Average(g => g.WordsTyped),
                    MeanAccuracy = (decimal?)g.Average(g => g.Accuracy),
                    MeanScore = (decimal?)g.Average(g => g.Score)
                })
                .FirstOrDefaultAsync();

            if (result != null)
            {
                gameStats.Count = result.Count;
                gameStats.TotalWordsTyped = result.TotalWordsTyped ?? 0;
                gameStats.MeanWordsTyped = result.MeanWordsTyped.HasValue ? Math.Round(result.MeanWordsTyped.Value, 2) : 0;
                gameStats.MeanAccuracy = result.MeanAccuracy.HasValue ? Math.Round(result.MeanAccuracy.Value, 2) : 0;
                gameStats.MeanScore = result.MeanScore.HasValue ? Math.Round(result.MeanScore.Value, 2) : 0;
            }

            return gameStats;
        }
    }
}