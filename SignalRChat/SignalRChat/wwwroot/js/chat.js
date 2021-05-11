"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

//Disable send button until connection is established
document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (user, message) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var encodedMsg = user + " says " + msg;
    var li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);
});

connection.on("ReceiveMessageToMe", function (user, message) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var encodedMsg = user + " says " + msg;
    var li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);
});

connection.on("ReceiveMessageToUser", function (user, targetConnectionId, message) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var encodedMsg = user + " says " + msg + ' by '+ targetConnectionId;
    var li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);
});

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;
    var opt = document.getElementById("typeSelect");
    var optValue = Number(opt.value);
    var optText = opt.options[opt.selectedIndex].text;

    switch (optValue) {
        case 0:
            connection.invoke("SendMessageToMe", user, message).catch(function (err) {
                return console.error(err.toString());
            });
            break;
        case 1:
            connection.invoke("SendMessageToUser", user, optText, message).catch(function (err) {
                return console.error(err.toString());
            });
            break;
        case 2:
            connection.invoke("SendMessage", user, message).catch(function (err) {
                return console.error(err.toString());
            });
            break;
        default:
            console.log('Option Invalid');
            break;
    }    

    event.preventDefault();
});