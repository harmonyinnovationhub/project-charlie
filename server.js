const express = require('express');
const cors = require('cors');
const http = require("http");
const socketio  = require("socket.io");
const PORT = 5000;
const path = require('path');

const app = express();
const httpServer = http.createServer(app);

// Here, we create a Socket.IO server and attach it to a Node.js express HTTP server.
const io = new socketio.Server();
io.attach(httpServer);
 
 
// On the server-side, we register a middleware which checks the username and allows the connection:
io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  console.log(socket.handshake.auth);
  next();
});



// Socket IO connection
io.on("connection", (socket) => {
  const users = [];

  // Upon connection, we send all existing users to the client:
    for (let [id, socket] of io.of("/").sockets) {
      users.push({
        userID: id,
        username: socket.username,
      });
    }
    socket.emit("users", users);
 
    // notify existing users 
    // This will emit to all connected clients, except the socket itself.
    socket.broadcast.emit("user connected", {
      userID: socket.id,
      username: socket.username,
    });


    // CHAT MESSAGING
    // forward the private message to the right recipient
    socket.on("private message", ({ content, to }) => {
      socket.to(to).emit("private message", {
        content,
        from: socket.id,
      });
    });





    // VIDEO MESSAGING
    socket.on("callUser", (data) => {
      io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
    })

    socket.on("answerCall", (data) => {
      io.to(data.to).emit("callAccepted", data.signal)
    }) 


    // notify users upon disconnection
    socket.on("disconnect", () => {
      socket.broadcast.emit("user disconnected", socket.id);
      socket.broadcast.emit("callEnded")

    });
 
  
});
 
// --> Enables deployment of application to heroku platform
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
// Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}


console.log("Server Listening at port " + PORT);
 
httpServer.listen(process.env.PORT || 5000)
