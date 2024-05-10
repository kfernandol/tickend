namespace TicketsSupport.ApplicationCore.Models
{
    public class ChartData
    {
        public string? Name { get; set; }
        public List<string?> Labels { get; set; }
        public List<int> Data { get; set; }
    }
}
