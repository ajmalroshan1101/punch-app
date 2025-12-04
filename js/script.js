let loggedInUser = null;
let isStarted = false;

// Your Google Apps Script Webhook URL
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

  // Send to Google Sheet
  sendToWebhook({
    user: loggedInUser,
    status: status,
    timestamp: now.toISOString(),
    readableTime: now.toLocaleString()
  });
}

function sendToWebhook(data) {
  // Create a clean data object to ensure all fields are present
  const cleanData = {
    user: String(data.user || "Unknown"),
    status: String(data.status || "Unknown"),
    timestamp: String(data.timestamp || new Date().toISOString()),
    readableTime: String(data.readableTime || new Date().toLocaleString())
  };
  
  console.log("=== Sending to Webhook ===");
  console.log("User:", cleanData.user);
  console.log("Status:", cleanData.status);
  console.log("Timestamp:", cleanData.timestamp);
  console.log("Readable Time:", cleanData.readableTime);
  
  const jsonString = JSON.stringify(cleanData);
  console.log("JSON String:", jsonString);
  
  // Use XMLHttpRequest with proper encoding
  const xhr = new XMLHttpRequest();
  xhr.open("POST", WEBHOOK_URL, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200 || xhr.status === 302) {
        console.log("✅ Data sent successfully");
        console.log("Response:", xhr.responseText);
      } else if (xhr.status === 0) {
        console.log("⚠️ Request sent (no-cors - cannot verify)");
      } else {
        console.error("❌ Request failed with status:", xhr.status);
      }
    }
  };
  
  xhr.onerror = function() {
    console.error("❌ Network error occurred");
  };
  
  // Send as form-encoded data (more compatible with Apps Script)
  const params = "data=" + encodeURIComponent(jsonString);
  console.log("Sending params:", params);
  xhr.send(params);
}