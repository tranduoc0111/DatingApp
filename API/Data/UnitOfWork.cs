using API.DTOs;
using API.Interfaces;
using AutoMapper;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly VnPayPaymentConfig _configuration;
        public UnitOfWork(DataContext context, IMapper mapper, IOptions<VnPayPaymentConfig> configuration)
        {
            _context = context;
            _mapper = mapper;
            _configuration = configuration.Value;

        }

        public IUserRepository UserRepository => new UserRepository(_context, _mapper);

        public object userRepository => throw new NotImplementedException();

        public IMessageRepository MessageRepository => new MessageRepository(_context, _mapper);

        public ILikesRepository LikesRepository => new LikesRepository(_context);
        public IBillRepository BillRepository => new BillRepository(_context, Options.Create(_configuration));
        public async Task<bool> Complete()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public bool HasChanges()
        {
            return _context.ChangeTracker.HasChanges();
        }
    }
}
