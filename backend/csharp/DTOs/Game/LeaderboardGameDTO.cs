namespace csharp.DTOs.Game
{
    public class LeaderboardGameDTO
    {
        public int Id { get; set; }
        
        public required string Username { get; set; }
        public int Score { get; set; }
        public int WordsTyped { get; set; }
        public double Accuracy { get; set; }
        public DateTime CreatedOn { get; set; }

    }
}
