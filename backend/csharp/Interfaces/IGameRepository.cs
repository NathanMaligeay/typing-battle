using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using csharp.DTOs.Game;
using csharp.Helpers;
using csharp.Models;

namespace csharp.Interfaces
{
    public interface IGameRepository
    {
        Task<Game> CreateAsync(Game gameModel);
        Task<List<Game>> GetAllAsync(string username);
        Task<Game> GetByIdAsync(int id);
        Task<GameStatsDTO> GetGameStatisticsAsync(string username);
        Task<List<LeaderboardGameDTO>> GetLeaderboard();
    }
}