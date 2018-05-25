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

  // Custom event
  socket.emit("newMessage", {
    from: "Mike",
    text: "Hey, what's up?",
    createdAt: 1400
  });

  // Custom event
  socket.on("createMessage", message => {
    console.log("createMessage", message);
  });

  // Built-in event
  socket.on("disconnect", () => {
    console.log("User was disconnected");
  });
});

server.listen(port, () => console.log(`Server is up on ${port}`));
