using API.DTOs;
using API.Interfaces;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace API.Data
{
    public class BillRepository : IBillRepository
    {
        private readonly DataContext _context;
        private readonly VnPayPaymentConfig _configuration;
        public BillRepository(DataContext context, IOptions<VnPayPaymentConfig> configuration)
        {
            _context = context;
            _configuration = configuration.Value;
        }

        public BillRepository()
        {
        }

        private string ByteToString(byte[] buff)
        {
            string sbinary = "";

            for (int i = 0; i < buff.Length; i++)
            {
                sbinary += buff[i].ToString("X2"); // hex format
            }

            return (sbinary);
        }
        private string HMACSHA512(string raw, string key)
        {
            UTF8Encoding encoding = new UTF8Encoding();
            byte[] keyByte = encoding.GetBytes(key);
            byte[] messageBytes = encoding.GetBytes(raw);
            HMACSHA512 hash = new HMACSHA512(keyByte);
            byte[] hashmessage = hash.ComputeHash(messageBytes);
            return ByteToString(hashmessage).ToLower();
        }
        public async Task<string> payVNPay(CreateVNPayDTO vnpay)
        {
            var config = _configuration.Create;
            var url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";

            var queryStringDictionary = new Dictionary<string, string>();
            queryStringDictionary.Add("vnp_Version", "2.1.0");
            queryStringDictionary.Add("vnp_Command", "pay");
            queryStringDictionary.Add("vnp_TmnCode", "97RESZ9S");
            queryStringDictionary.Add("vnp_Amount", (vnpay.Amount * 100).ToString());
            queryStringDictionary.Add("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss"));
            queryStringDictionary.Add("vnp_CurrCode", "VND");
            queryStringDictionary.Add("vnp_IpAddr", "127.0.0.1");
            queryStringDictionary.Add("vnp_Locale", "vn");
            queryStringDictionary.Add("vnp_OrderInfo", $"Thanh toan don hang tri gia: {vnpay.Amount}");
            queryStringDictionary.Add("vnp_OrderType", "170000");
            queryStringDictionary.Add("vnp_ReturnUrl", vnpay.CallBackUrl);
            queryStringDictionary.Add("vnp_TxnRef", DateTime.Now.ToString("yyyyMMddHHmmss"));

            queryStringDictionary = queryStringDictionary.OrderBy(x => x.Key).ToDictionary(x => x.Key, v => v.Value);

            var listParam = new List<string>();
            foreach (var item in queryStringDictionary)
            {
                if (!string.IsNullOrEmpty(item.Value))
                    listParam.Add($"{item.Key}={WebUtility.UrlEncode(item.Value)}");//UrlPathEncode, UrlEncode 
            }
            var signData = String.Join("&", listParam);
            //signData = HttpUtility.UrlPathEncode(signData);
            var hashData = HMACSHA512(signData, "XQZXBLWXMIHZSSIWHORBYUCWYCMPDQWE");
            var endpoint = $"{url}?{signData}&vnp_SecureHash={hashData}";
            return endpoint;
        }
    }
}
