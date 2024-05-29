namespace TicketsSupport.ApplicationCore.DTOs
{
    public class CreateOrganizationRequest
    {
        public string Name { get; set; } = null!;
        public string? Photo { get; set; }
        public string? Address { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
    }

    public class UpdateOrganizationRequest : CreateOrganizationRequest
    {
        public int Id { get; set; }
    }

    public class OrganizationResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Photo { get; set; }
        public string? Address { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public DateTime CreateDate { get; set; }
    }
}
