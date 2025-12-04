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

  const payload = {
    user: loggedInUser,
    status: status,
    timestamp: now.toISOString(),
    readableTime: now.toLocaleString()
  };
  
  // Log to see what we're sending
  console.log("=== Sending Payload ===");
  console.log("User:", payload.user);
  console.log("Status:", payload.status);
  console.log("Timestamp:", payload.timestamp);
  console.log("Readable Time:", payload.readableTime);
  console.log("Full payload:", JSON.stringify(payload));

  sendToWebhook(payload);
}

// function sendToWebhook(data) {
//   console.log("sendToWebhook called");
//   console.log("Data object:", data);
//   console.log("JSON string:", JSON.stringify(data));
  
//   // Method 1: Try sendBeacon first
//   if (navigator.sendBeacon) {
//     const blob = new Blob([JSON.stringify(data)], { type: 'text/plain' });
//     const sent = navigator.sendBeacon(WEBHOOK_URL, blob);
    
//     if (sent) {
//       console.log("✅ Sent via sendBeacon");
//       console.log("Blob content:", JSON.stringify(data));
//       return;
//     }
//   }
  
//   // Method 2: Try XMLHttpRequest
//   try {
//     const xhr = new XMLHttpRequest();
//     xhr.open("POST", WEBHOOK_URL, true);
//     xhr.setRequestHeader("Content-Type", "text/plain");
    
//     const jsonString = JSON.stringify(data);
//     console.log("XHR sending:", jsonString);
    
//     xhr.send(jsonString);
//     console.log("✅ Sent via XHR");
//     return;
//   } catch (xhrErr) {
//     console.error("XHR failed:", xhrErr);
//   }
  
//   // Method 3: Fallback to fetch
//   fetch(WEBHOOK_URL, {
//     method: "POST",
//     headers: { "Content-Type": "text/plain" },
//     body: JSON.stringify(data),
//     mode: "no-cors",
//     keepalive: true
//   })
//   .then(() => console.log("✅ Sent via fetch"))
//   .catch(err => console.error("❌ All methods failed:", err));
// }
function sendToWebhook(data) {
  console.log("=== sendToWebhook Debug ===");
  console.log("Full data object:", data);
  console.log("Data.user:", data.user);
  console.log("Data.status:", data.status);
  console.log("Data.timestamp:", data.timestamp);
  console.log("Data.readableTime:", data.readableTime);
  
  const jsonString = JSON.stringify(data);
  console.log("JSON string to send:", jsonString);
  
  // ONLY USE XMLHttpRequest (most reliable for Teams)
  try {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", WEBHOOK_URL, true);
    xhr.setRequestHeader("Content-Type", "text/plain");
    
    xhr.onload = function() {
      console.log("✅ XHR Success - Status:", xhr.status);
    };
    
    xhr.onerror = function() {
      console.error("❌ XHR Error");
    };
    
    console.log("Sending via XHR:", jsonString);
    xhr.send(jsonString);
    
  } catch (err) {
    console.error("❌ XHR Exception:", err);
  }
}