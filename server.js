const express = require('express');
const cors = require('cors');
const http = require("http");
const socketio  = require("socket.io");
const port = 5000;
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new socketio.Server();
io.attach(server);
 
// Setting middleware
io.use((socket, next) => {
  const name = socket.handshake.auth.name;
  const userID = socket.handshake.auth.userID;
  if (!name) {
    return next(new Error("invalid username"));
  }
  socket.name = name;
  socket.userID = userID;
  console.log(socket.userID);
  next();
}); 



// Socket IO connection
io.on("connection", (socket) => {

  // socket.emit("your id", socket.id);

  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      socketID: id,
      name: socket.name,
      userID: socket.userID,
    });
  }
  socket.emit("getId", users);

  // notify existing users
  socket.broadcast.emit("user connected", {
    socketID: socket.id,
    name: socket.name,
    userID: socket.userID
  });



  // Handle chat message
  socket.on("send message", body => {
      io.emit("message", body)
  })
  



    // socket.emit("me", socket.id)

    // socket.on("disconnect", () => {
    //   socket.broadcast.emit("callEnded")
    // })

    // socket.on("callUser", (data) => {
    //   io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
    // })

    // socket.on("answerCall", (data) => {
    //   io.to(data.to).emit("callAccepted", data.signal)
    // })
 
});

// --> Add this
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
// Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}



server.listen(process.env.PORT || 5000)
