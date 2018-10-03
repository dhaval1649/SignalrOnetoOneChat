using ASPNETCore_SignalR_Angular_TypeScript.Models;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ASPNETCore_SignalR_Angular_TypeScript.Hubs
{
    public class ChatHub : Hub
    {
        private CustomUserIdProvider customUserIdProvider;
        public ChatHub(CustomUserIdProvider customUserIdProvider)
        {
            this.customUserIdProvider = customUserIdProvider;
        }
        static List<Users> loggedInUsers = new List<Users>();
        public async Task Login(string name)
        {
            //if (loggedInUsers.Where(x => x.userName == name).Count() < 1)
            //{
            //    var user = new Users { userName = name, connectionId = Context.ConnectionId, IsOnline = true };

            //    loggedInUsers.Add(user);
            //}
            //List<Users> otherUsers = new List<Users>();
            //otherUsers = loggedInUsers.Where(x => x.connectionId != loggedInUsers.FirstOrDefault(y => y.userName == name).connectionId).ToList();
            // await Clients.All.SendAsync("allusers", loggedInUsers);


            if (!customUserIdProvider.AddUpdate(name, Context.ConnectionId))
            {
                // new user
                var list = customUserIdProvider.GetAllUsersExceptThis(Context.ConnectionId).ToList();
                await Clients.AllExcept(new List<string> { Context.ConnectionId }).SendAsync(
                    "NewOnlineUser",
                    customUserIdProvider.GetUser(name)
                    );
            }
            else
            {
                // existing user joined again

            }

            //await Clients.Client(Context.ConnectionId).SendAsync(
            //    "Joined",
            //    customUserIdProvider.GetUser(name)
            //    );

            await Clients.All.SendAsync(
                "OnlineUsers",
                customUserIdProvider.GetAllUsersExceptThis(Context.ConnectionId)
            );
        }
        public async Task SendMessage(ChatMessage message, string targetUserName)
        {
            var userInfoSender = customUserIdProvider.GetUser(message.user);
            var userInfoReciever = customUserIdProvider.GetUser(targetUserName);
            await Clients.Client(userInfoReciever.connectionId).SendAsync("ReceiveMessage", message, userInfoSender);
            await Clients.Client(userInfoReciever.connectionId).SendAsync("NewMessage", message, userInfoSender);
            await Clients.Client(userInfoSender.connectionId).SendAsync("ReceiveMessage", message, userInfoReciever);
            //await Clients.Client(targetConnId).SendAsync("ReceiveMessage", message);

            // await Clients.All.SendAsync("ReceiveMessage", message, targetConnId);
        }
        public void Connect(string userName)
        {
            var id = Context.ConnectionId;

            if (loggedInUsers.Count(x => x.connectionId == id) == 0)
            {
                loggedInUsers.Add(new Users { connectionId = id, userName = userName, IsOnline = true });
                Clients.Caller.SendAsync(id, userName, loggedInUsers);
                Clients.AllExcept(id).SendAsync(id, userName);
            }
        }
        public IEnumerable<Users> GetAllUsers(string name)
        {
            if (name != null && name != "")
            {
                customUserIdProvider.AddUpdate(name, Context.ConnectionId);
            }
            return customUserIdProvider.GetAllUsersExceptThis(Context.ConnectionId);
        }
    }
}
