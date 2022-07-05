import Echo from "laravel-echo";

window.Pusher = require("pusher-js");

window.Echo = new Echo({
  broadcaster: "pusher",
  key: "acebf74871e940f8a2a2",
  cluster: "ap1",
  forceTLS: true,
});

export default window.Echo;
