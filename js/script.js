let loggedInUser = null;
let isStarted = false;

const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbxZw3PRonHJzmH1ag9NG32wfWIIj0CjsvieCWak_aK2DP-pxswRYZphq8TS5n6JwcnxpA/exec";

function login() {
  const email = document.getElementById("email").value.trim();
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

  sendToWebhook({
    user: loggedInUser,
    status: status,
    timestamp: now.toISOString(),
    readableTime: now.toLocaleString()
  });
}

function sendToWebhook(data) {
  console.log("Sending data:", data);
  
  // Method 1: Try sendBeacon first (best for Teams desktop)
  if (navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(data)], { type: 'text/plain' });
    const sent = navigator.sendBeacon(WEBHOOK_URL, blob);
    
    if (sent) {
      console.log("✅ Sent via sendBeacon");
      return;
    }
  }
  
  // Method 2: Try XMLHttpRequest
  try {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", WEBHOOK_URL, true);
    xhr.setRequestHeader("Content-Type", "text/plain");
    xhr.send(JSON.stringify(data));
    console.log("✅ Sent via XHR");
    return;
  } catch (xhrErr) {
    console.error("XHR failed:", xhrErr);
  }
  
  // Method 3: Fallback to fetch
  fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(data),
    mode: "no-cors",
    keepalive: true
  })
  .then(() => console.log("✅ Sent via fetch"))
  .catch(err => console.error("❌ All methods failed:", err));
}