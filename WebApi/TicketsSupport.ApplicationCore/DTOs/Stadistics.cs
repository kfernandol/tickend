namespace TicketsSupport.ApplicationCore.DTOs
{
    public class TicketsByProjectResponse
    {
        public ProjectResponse Project { get; set; }
        public int Total { get; set; }
        public int Open { get; set; }
        public int Closed { get; set; }
        public int Pending { get; set; }
    }

}
