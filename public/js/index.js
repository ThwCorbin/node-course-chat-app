const socket = io();

// Regular functions instead of arrows for
// compatibility issues with browsers/phones

let newMessageHeight = 0;
function scrollToBottom() {
  let messages = document.getElementById("messages");
  let newMessage = messages.lastElementChild;
  let { clientHeight } = messages;
  let { scrollTop } = messages;
  let { scrollHeight } = messages;
  let previousMessageHeight = newMessageHeight;
  newMessageHeight = parseInt(
    window.getComputedStyle(newMessage).getPropertyValue("height")
  );

  if (
    clientHeight + scrollTop + newMessageHeight + previousMessageHeight >=
    scrollHeight
  ) {
    messages.scrollTo(0, scrollHeight);
  }
}

socket.on("connect", function() {
  console.log("Connected to server");
});

socket.on("disconnect", function() {
  console.log("Disconnected from server");
});

socket.on("newMessage", function(message) {
  let formattedTime = moment(message.createdAt).format("h:mm a");
  let template = document.querySelector("#message-template").textContent;
  let html = Mustache.render(template, {
    from: message.from,
    createdAt: formattedTime,
    text: message.text
  });
  let messages = document.getElementById("messages");
  messages.innerHTML += html;
  // Above line replaces this by using templates
  // messages.innerHTML += `<li>${message.from} ${formattedTime}: ${message.text}</li>`;
  scrollToBottom();
});

socket.on("newLocationMessage", function(message) {
  let formattedTime = moment(message.createdAt).format("h:mm a");
  let template = document.querySelector("#location-message-template")
    .textContent;
  let html = Mustache.render(template, {
    from: message.from,
    createdAt: formattedTime,
    url: message.url
  });
  let messages = document.getElementById("messages");
  messages.innerHTML += html;
  // Above line replaces this by using templates
  // messages.innerHTML += `<li>${message.from} ${formattedTime}:
  // <a target="_blank" href="${message.url}">My current location</a></li>`;
  scrollToBottom();
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
    function() {
      console.log("What not working?");
      formInput.value = "";
    }
  );
}

let locationButton = document.querySelector("#send-location");

locationButton.addEventListener("click", function() {
  if (!navigator.geolocation) {
    return alert("Geolocation not supported by your browser.");
  }

  locationButton.disabled = true;
  locationButton.textContent = "Sending...";

  navigator.geolocation.getCurrentPosition(
    function(position) {
      locationButton.disabled = false;
      locationButton.textContent = "Send location";

      socket.emit("createLocationMessage", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },
    function() {
      locationButton.disabled = false;
      locationButton.textContent = "Send location";
      alert("Unable to fetch location.");
    }
  );
});
