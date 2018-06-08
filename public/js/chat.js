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

function parseString(searchString) {
  let queryObject = {};
  searchString.replace(new RegExp("([^?=&]+)(=([^&#]*))?", "g"), function(
    $0,
    $1,
    $2,
    $3
  ) {
    queryObject[$1] = decodeURIComponent($3.replace(/\+/g, "%20"));
  });
  return queryObject;
}

// "([^?=&]+)(=([^&#]*))?", "g"),
// MDN RegExp docs...and question mark from www.regular-expressions.info
// (x) Matches x and remembers the match. Called capturing groups.
// [xyz] Negated character set matches anything not in the brackets.
// x+ Matches the preceding item x 1 or more times. Equivalent to {1,}.
// x* Matches the preceding item x 0 or more times.
// (x)(y)? Question mark makes the preceding token optional. Called a quantifier.
// g Global match flag; finds all matches (does not stop after first match)

socket.on("connect", function() {
  let params = parseString(window.location.search);

  socket.emit("join", params, function(err) {
    if (err) {
      alert(err);
      window.location.href = "/";
    } else {
      console.log("No error");
    }
  });
});

socket.on("disconnect", function() {
  console.log("Disconnected from server");
});

socket.on("updateUserList", function(users) {
  let people = document.querySelector("#usersOl");
  // clear the users listed in People sidebar
  people.innerHTML = "";

  users.forEach(function(user) {
    people.innerHTML += `<li>${user}</li>`;
  });
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
