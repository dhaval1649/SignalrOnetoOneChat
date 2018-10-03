using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ASPNETCore_SignalR_Angular_TypeScript.Models
{
    public class Users
    {
        public string connectionId { get; set; }
        public string userName { get; set; }
        public bool IsOnline { get; set; }
        public List<ChatMessage> userMessages { get; set; }
    }
}
