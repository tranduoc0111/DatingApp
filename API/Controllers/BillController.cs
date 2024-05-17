using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper.Configuration;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace API.Controllers
{
    public class BillController : BaseApiController
    {
        private readonly IUnitOfWork _uow;
        private readonly DataContext _dataContext;

        public BillController(IUnitOfWork uow, DataContext dataContext)
        {
            _uow = uow;
            _dataContext = dataContext;
        }
        [HttpPost("createVnPay")]
        public async Task<string> payVNPay(CreateVNPayDTO vnpay)
        {
            var result = await _uow.BillRepository.payVNPay(vnpay);
            return result;
        }

        [HttpPost("create-userbill")]
        public async Task<ActionResult> CreateUserBill(int userId, [FromQuery] BillsDTo input)
        {
            try
            {
                var user = await _dataContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
                if (user == null)
                {
                    return BadRequest("User not found");
                }

                var bill = await _dataContext.Bill.FirstOrDefaultAsync(b => b.Money == input.Money);
                if (bill == null)
                {
                    return BadRequest("Payment plan does not exist");
                }
                var userBill = new UserBill
                {
                    UserId = userId,
                    BillId = bill.Id,
                    Money = input.Money
                };
                _dataContext.Bills.Add(userBill);
                await _dataContext.SaveChangesAsync();
                return Ok("UserBill created successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
