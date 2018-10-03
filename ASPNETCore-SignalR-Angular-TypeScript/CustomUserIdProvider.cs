using ASPNETCore_SignalR_Angular_TypeScript.Models;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

namespace ASPNETCore_SignalR_Angular_TypeScript
{
    public class CustomUserIdProvider
    {
        private ConcurrentDictionary<string, Users> _onlineUser { get; set; } = new ConcurrentDictionary<string, Users>();

        public bool AddUpdate(string name, string connectionId)
        {
            var userAlreadyExists = _onlineUser.ContainsKey(name);

            var userInfo = new Users
            {
                userName = name,
                connectionId = connectionId
            };

            _onlineUser.AddOrUpdate(name, userInfo, (key, value) => userInfo);

            return userAlreadyExists;
        }

        public void Remove(string name)
        {
            Users userInfo;
            _onlineUser.TryRemove(name, out userInfo);
        }

        public IEnumerable<Users> GetAllUsersExceptThis(string connectionId)
        {
            return _onlineUser.Values.Where(item => item.connectionId != connectionId);
        }

        public Users GetUser(string username)
        {
            Users user;
            _onlineUser.TryGetValue(username, out user);
            return user;
        }
    }
}