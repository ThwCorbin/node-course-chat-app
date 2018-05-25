const socket = io();

// Regular functions instead of arrows for
// compatibility issues with browsers/phones
socket.on("connect", function() {
  console.log("Connected to server");

  // emit inside connect so it waits for connection
  socket.emit("createMessage", {
    from: "Jack",
    text: "Hey, this is the dude."
  });
});

socket.on("disconnect", function() {
  console.log("Disconnected from server");
});

socket.on("newMessage", function(message) {
  console.log("newMessage", message);
});
