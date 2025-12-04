let loggedInUser = null;
let isStarted = false;

const WEBHOOK_URL = "https://your-webhook-url-here.com"; // CHANGE THIS

function login() {
  const email = document.getElementById("email").value.trim();

  // If empty, assign a default guest name
  loggedInUser = email || "User";

  document.getElementById("userEmail").innerText = loggedInUser;

  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");
}


function togglePunch() {
  isStarted = !isStarted;

  const status = isStarted ? "Started" : "Ended";
  const buttonText = isStarted ? "End" : "Start";

  document.getElementById("status").innerText = status;
  document.getElementById("actionButton").innerText = buttonText;

  const now = new Date();
  document.getElementById("time").innerText = now.toLocaleTimeString();

  sendToWebhook({
    user: loggedInUser,
    status: status,
    timestamp: now.toISOString()
  });
}

function sendToWebhook(data) {
  fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  .then(res => console.log("Webhook sent", res))
  .catch(err => console.error("Webhook error", err));
}
