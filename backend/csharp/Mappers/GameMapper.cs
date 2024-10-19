using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using csharp.DTOs.Game;
using csharp.Models;

namespace csharp.Mappers
{
    public static class GameMapper
    {
        public static GameDTO ToGameDTO(this Game gameModel)
        {
            return new GameDTO
            {
                Id = gameModel.Id,
                WordsTyped = gameModel.WordsTyped,
                Accuracy = gameModel.Accuracy,
                Score = gameModel.Score,
                CreatedOn = gameModel.CreatedOn,
                AppUserId = gameModel.AppUserId
            };
        }

        public static Game ToGameFromCreate(this CreateGameDTO gameDTO, string appUserId)
        {
            return new Game
            {
                WordsTyped=gameDTO.WordsTyped,
                Accuracy = gameDTO.Accuracy,
                Score = gameDTO.Score,
                AppUserId = appUserId
            };
        }
    }
}