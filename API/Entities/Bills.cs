using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class Bills 
    {
        [Key]
        public int Id { get; set; }
        public double Money { get; set; }

    }
}
