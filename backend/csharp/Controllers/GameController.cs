using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using csharp.Data;
using csharp.DTOs.Game;
using csharp.Helpers;
using csharp.Interfaces;
using csharp.Mappers;
using csharp.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace csharp.Controllers
{
    [Route("api/game")]
    [ApiController]
    public class GameController : ControllerBase
    {
        private readonly IGameRepository _gameRepository;
        private readonly UserManager<AppUser> _userManager;
        public GameController(IGameRepository gameRepository, UserManager<AppUser> userManager)
        {
            _gameRepository = gameRepository;
            _userManager = userManager;
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var game = await _gameRepository.GetByIdAsync(id);

            if (game == null) return NotFound();

            return Ok(game.ToGameDTO());
        }

        [HttpPost("{username}")]
        public async Task<IActionResult> Create([FromRoute] string username, CreateGameDTO gameDTO)
        {

            Console.WriteLine($"Username: {username}");
            Console.WriteLine($"Game Data: {JsonConvert.SerializeObject(gameDTO)}");

            if (!ModelState.IsValid) return BadRequest(ModelState);

            var appUser = await _userManager.FindByNameAsync(username);

            var gameModel = gameDTO.ToGameFromCreate(username);
            gameModel.AppUserId = appUser.Id;
            await _gameRepository.CreateAsync(gameModel);
            return CreatedAtAction(nameof(GetById), new { id = gameModel.Id }, gameModel.ToGameDTO());
        }

        [HttpGet("username")]
        public async Task<IActionResult> GetAll([FromQuery] string username)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                if (string.IsNullOrWhiteSpace(username)) return BadRequest("Username is required");

                var games = await _gameRepository.GetAllAsync(username);
                var gamesDto = games.Select(g => g.ToGameDTO());

                return Ok(gamesDto.ToList());
            } catch (Exception e)
            {
                return StatusCode(500, $"Internal server error: {e.Message}");
            }
        }
        [HttpGet("username/stats/")]
        public async Task<IActionResult> GetUserStats([FromQuery] string username)
        {
            if (string.IsNullOrWhiteSpace(username)) return BadRequest("Username is required");

            try
            {
                var stats = await _gameRepository.GetGameStatisticsAsync(username);
                return Ok(stats);
            } catch (Exception e)
            {
                return StatusCode(500, $"Internal server error: {e.Message}");
            }
        }
        [HttpGet]
        public async Task<IActionResult> GetLeaderboard()
        {
            try
            {
                var leaderboard = await _gameRepository.GetLeaderboard();
                return Ok(leaderboard);
            }
            catch (Exception e)
            {
                return StatusCode(500, $"Internal server error: {e.Message}");
            }
        }
    }
}