// Built in Node.js modules
const path = require("path");
const http = require("http");

// Third party libraries
const express = require("express");
const socketIO = require("socket.io");

const {
  generateMessage,
  generateLocationMessage
} = require("./utils/message.js");
const { isRealString } = require("./utils/validation.js");

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

  socket.emit(
    "newMessage",
    generateMessage("Admin", "Welcome to the chat app!")
  );

  // broadcast emits event to every connection Except emitter
  socket.broadcast.emit(
    "newMessage",
    generateMessage("Admin", "New user joined chat.")
  );

  socket.on("join", (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      callback("Name and room name are required");
    }
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
    console.log("User was disconnected");
  });
});

server.listen(port, () => console.log(`Server is up on ${port}`));
