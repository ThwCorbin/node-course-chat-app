const socket = io();

// Regular functions instead of arrows for
// compatibility issues with browsers/phones
socket.on("connect", function() {
  console.log("Connected to server");
});

socket.on("disconnect", function() {
  console.log("Disconnected from server");
});

socket.on("newMessage", function(message) {
  console.log("newMessage", message);
  let messages = document.getElementById("messages");
  messages.innerHTML += `<li>${message.from}: ${message.text}</li>`;
});

socket.on("newLocationMessage", function(message) {
  let messages = document.getElementById("messages");
  messages.innerHTML += `<li>${message.from}: <a target="_blank" href="${message.url}">My current location</a></li>`;
});

let formInput = document.querySelector("#message");
document.querySelector("#message-form").addEventListener("submit", sendMessage);

function sendMessage(e) {
  e.preventDefault();
  let messageText = formInput.value;

  socket.emit(
    "createMessage",
    {
      from: "User",
      text: messageText
    },
    function() {}
  );
}

let locationButton = document.querySelector("#send-location");

locationButton.addEventListener("click", function() {
  if (!navigator.geolocation) {
    return alert("Geolocation not supported by your browser.");
  }
  navigator.geolocation.getCurrentPosition(
    function(position) {
      socket.emit("createLocationMessage", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },
    function() {
      alert("Unable to fetch location.");
    }
  );
});
