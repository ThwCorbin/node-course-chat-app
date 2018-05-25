// Built in Node.js modules
const path = require("path");
const http = require("http");

// Third party libraries
const express = require("express");
const socketIO = require("socket.io");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

// Register an event listener with built-in or custom events
io.on("connection", socket => {
  // The "socket" argument represents the individual socket...
  // not all the users connected to the server
  console.log("New user connected");

  socket.emit("newMessage", {
    from: "Admin",
    text: "Welcome to the chat app!",
    createdAt: new Date().getTime()
  });

  socket.broadcast.emit("newMessage", {
    from: "Admin",
    text: "New user joined chat.",
    createdAt: new Date().getTime()
  });

  // Custom events
  // After a user/connection emits (from the console in this example)...
  // socket.emit("createMessage", {from: "Tom", text: "I am the Walrus"});
  // ...to the server, the server then emits the message plus
  // a createdAt timestamp to all connections in realtime!!!
  socket.on("createMessage", message => {
    console.log("createMessage", message);

    io.emit("newMessage", {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });

    // broadcast emits event to every connection Except emitter
    // socket.broadcast.emit("newMessage", {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
  });

  // Built-in event
  socket.on("disconnect", () => {
    console.log("User was disconnected");
  });
});

server.listen(port, () => console.log(`Server is up on ${port}`));
