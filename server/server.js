// Built in Node.js modules
const path = require("path");
const http = require("http");

// Third party libraries
const express = require("express");
const socketIO = require("socket.io");

// Local requirements
const {
  generateMessage,
  generateLocationMessage
} = require("./utils/message.js");
const { isRealString } = require("./utils/validation.js");
const { Users } = require("./utils/users.js");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

app.use(express.static(publicPath));

// Register an event listener with built-in or custom events
io.on("connection", socket => {
  // The "socket" argument represents the individual socket...
  // not all the users connected to the server

  socket.on("join", (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback("Name and room name are required");
    }
    // user request to join a room
    socket.join(params.room);
    // make sure user is not already in another room via removeUser()
    users.removeUser(socket.id);
    // add user to room
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit("updateUserList", users.getUserList(params.room));
    socket.emit(
      "newMessage",
      generateMessage("Admin", `Welcome to the ${params.room} room!`)
    );

    // broadcast emits event to every connection Except emitter
    socket.broadcast
      .to(params.room)
      .emit(
        "newMessage",
        generateMessage("Admin", `${params.name} has joined.`)
      );
    callback();
  });

  // Custom events
  // After client emits (from the console in this example)...
  // socket.emit("createMessage", {from: "Tom", text: "I am the Walrus"});
  // ...to the server, the server then emits the message plus
  // a createdAt timestamp to all connections in realtime!!!
  socket.on("createMessage", (message, callback) => {
    console.log("createMessage", message);

    io.emit("newMessage", generateMessage(message.from, message.text));
    callback();
  });

  socket.on("createLocationMessage", coords => {
    io.emit(
      "newLocationMessage",
      generateLocationMessage("Admin", coords.latitude, coords.longitude)
    );
  });

  // Built-in event
  socket.on("disconnect", () => {
    let user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("updateUserList", users.getUserList(user.room));
      io.to(user.room).emit("newMessage", generateMessage("Admin", `${user.name} has left the building.`));
    }
  });
});

server.listen(port, () => console.log(`Server is up on ${port}`));
