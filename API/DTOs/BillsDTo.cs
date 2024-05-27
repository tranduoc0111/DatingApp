using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class BillsDTo
    {
        public int Id { get; set; }
        public double Amount { get; set; }
        public string Username { get; set; }
    }
}
