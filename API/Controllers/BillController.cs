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
        public async Task<ActionResult> CreateUserBill(BillsDTo input)
        {
            try
            {
                var user = await _dataContext.Users.FirstOrDefaultAsync(u => u.UserName == input.Username);
                if (user == null)
                {
                    return BadRequest("User not found");
                }

                var bill = await _dataContext.Bill.FirstOrDefaultAsync(b => b.Amount == input.Amount);
                if (bill == null)
                {
                    return BadRequest("Payment plan does not exist");
                }

                var userbills = await _dataContext.Bills.FirstOrDefaultAsync(ub => ub.UserId == user.Id && ub.BillId == bill.Id);
                if (userbills != null)
                {
                    return BadRequest("UserBill exist");

                }
                var userBill = new UserBill
                {
                    UserId = user.Id,
                    BillId = bill.Id,
                    Amount = input.Amount
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

        [HttpGet]
        public async Task<ActionResult> GetUserBill(BillsDTo input)
        {
            var user = await _dataContext.Users.FirstOrDefaultAsync(u => u.UserName == input.Username);
            var bill = await _dataContext.Bill.FirstOrDefaultAsync(b => b.Amount == input.Amount);

            var userbills = await _dataContext.Bills.FirstOrDefaultAsync(ub => ub.UserId == user.Id && ub.BillId == bill.Id);

            var userBill = new UserBill
            {
                Id = userbills.Id,
                UserId = userbills.UserId,
                BillId = userbills.BillId,
                Amount = userbills.Amount
            };

            return Ok(userBill);
        }

        [HttpGet("get-bills")]

        public async Task<ActionResult> GetAllBills()
        {
            try
            {
                var result = await (from bill in _dataContext.Bill
                                    select bill).ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}
