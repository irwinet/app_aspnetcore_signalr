using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SignalRChat.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task SendMessageToMe(string user, string message)
        {
            Console.WriteLine($"{Context.ConnectionId}-Caller-{message}");
            await Clients.Caller.SendAsync("ReceiveMessageToMe", user, message);
        }

        public async Task SendMessageToUser(string user, string targetConnectionId, string message)
        {
            Console.WriteLine($"{Context.ConnectionId}-{targetConnectionId}-{message}");
            //await Clients.User(...)
            await Clients.Client(targetConnectionId).SendAsync("ReceiveMessageToUser", user, targetConnectionId, message);
        }
    }
}
