// server.js

const express = require('express');
const SocketServer = require('ws').Server;
const uuidv1 = require('uuid/v1');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
  // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${PORT}`));

// Create the WebSockets server
const wss = new SocketServer({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.


wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
    console.log(data);
  });
}

wss.on('connection', (ws) => {
  console.log('Client connected');
  const numOfUser = {
    length: wss.clients.size,
    type: "userCount"
  }
  wss.broadcast(JSON.stringify(numOfUser));
  ws.on('message', function incoming(messageStr) {
    const messageObj = JSON.parse(messageStr);
    switch (messageObj.type) {
      case "postMessage":
        messageObj.type = "incomingMessage"
        break;
      case "postNotification":
        messageObj.type = "incomingNotification"
        break;
      default:
        throw new Error("Unknown event type", messageObj.type)
    }
    messageObj.data.id = uuidv1();
    const messageObjSend = JSON.stringify(messageObj);
    wss.broadcast(messageObjSend);
  });
  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected');
    numOfUser.length = wss.clients.size
    wss.broadcast(JSON.stringify(numOfUser));
  })
});