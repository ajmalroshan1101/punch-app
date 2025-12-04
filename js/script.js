let loggedInUser = null;
let isStarted = false;

// 🔥 Your Google Apps Script Webhook URL
const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbxZw3PRonHJzmH1ag9NG32wfWIIj0CjsvieCWak_aK2DP-pxswRYZphq8TS5n6JwcnxpA/exec";

function login() {
  const email = document.getElementById("email").value.trim();

  // If empty, assign "User"
  loggedInUser = email || "User";

  document.getElementById("userEmail").innerText = loggedInUser;
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");
}

function togglePunch() {
  isStarted = !isStarted;

  const status = isStarted ? "Started" : "Ended";
  const buttonLabel = isStarted ? "End" : "Start";

  document.getElementById("status").innerText = status;
  document.getElementById("actionButton").innerText = buttonLabel;

  const now = new Date();

  document.getElementById("time").innerText = now.toLocaleTimeString();

  // Send to Google Sheet
  sendToWebhook({
    user: loggedInUser,
    status: status,
    timestamp: now.toISOString(),
    readableTime: now.toLocaleString()
  });
}

function sendToWebhook(data) {
  fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  .then(async (res) => {
    const txt = await res.text();
    console.log("Response:", txt);
  })
  .catch(err => console.error("Webhook error:", err));
}
