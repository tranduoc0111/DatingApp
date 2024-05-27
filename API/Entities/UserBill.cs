using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class UserBill
    {
        public int Id { get; set; }
        public double Amount { get; set; }
        public int UserId { get; set; }
        public AppUser User { get; set; }
        public int BillId { get; set; }
        public Bills Bill { get; set; }
    }
}
