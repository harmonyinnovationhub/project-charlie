const express = require('express');
const cors = require('cors');
const http = require("http");
const socketio  = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new socketio.Server();
io.attach(server);

// URL routing
app.get('/api/customers', cors(), (req, res) => {
  const customers = [
    {id: 1, firstName: 'John', lastName: 'Doe'},
    {id: 2, firstName: 'Brad', lastName: 'Traversy'},
    {id: 3, firstName: 'Mary', lastName: 'Swanson'},
  ];

  res.json(customers);
});

// Socket IO connection
io.on("connection", (socket) => {

    socket.emit("me", socket.id)

    socket.on("disconnect", () => {
      socket.broadcast.emit("callEnded")
    })

    socket.on("callUser", (data) => {
      io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
    })

    socket.on("answerCall", (data) => {
      io.to(data.to).emit("callAccepted", data.signal)
    })

});




const port = 5000;

server.listen(port, () => `Server running on port ${port}`);
