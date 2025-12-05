let loggedInUser = null;
let isStarted = false;

const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbxHbyCVGNqsdnkesunFweoT9fAnXej6DMiSQETU8wWxxsh7-RAHGUjdU6RBjwlFq-ZA1w/exec";

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
  console.log("=== Sending Data ===", data);
  
  // Use Image beacon - works everywhere including Teams desktop
  const params = new URLSearchParams({
    user: data.user,
    status: data.status,
    timestamp: data.timestamp,
    readableTime: data.readableTime
  });
  
  const img = new Image();
  img.src = WEBHOOK_URL + "?" + params.toString();
  
  img.onload = function() {
    console.log("✅ Data sent successfully");
  };
  
  img.onerror = function() {
    console.log("⚠️ Request completed (may have succeeded despite error)");
  };
  
  console.log("Request URL:", img.src);
}