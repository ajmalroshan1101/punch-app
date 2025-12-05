let loggedInUser = null;
let userName = null;
let isStarted = false;

const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbxHbyCVGNqsdnkesunFweoT9fAnXej6DMiSQETU8wWxxsh7-RAHGUjdU6RBjwlFq-ZA1w/exec";

// Auto-initialize when page loads
async function initializeApp() {
  try {
    // Initialize Microsoft Teams SDK
    await microsoftTeams.app.initialize();
    console.log("✅ Teams SDK initialized");
    
    // Get user context from Teams
    const context = await microsoftTeams.app.getContext();
    
    // Get user email and name
    loggedInUser = context.user?.userPrincipalName || context.user?.loginHint || "unknown@user.com";
    userName = context.user?.displayName || loggedInUser;
    
    console.log("User Email:", loggedInUser);
    console.log("User Name:", userName);
    
    // Update UI with user name
    document.getElementById("userEmail").innerText = userName;
    
  } catch (error) {
    console.error("❌ Teams initialization error:", error);
    
    // Fallback if not in Teams or error occurred
    loggedInUser = "unknown@user.com";
    userName = "Guest User";
    document.getElementById("userEmail").innerText = userName;
  }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initializeApp);

function togglePunch() {
  isStarted = !isStarted;

  const status = isStarted ? "Started" : "Ended";
  const buttonLabel = isStarted ? "End" : "Start";

  document.getElementById("status").innerText = status;
  document.getElementById("actionButton").innerText = buttonLabel;

  const now = new Date();
  document.getElementById("time").innerText = now.toLocaleTimeString();

  // Send data to Google Sheet
  sendToWebhook({
    user: loggedInUser,
    userName: userName,
    status: status,
    timestamp: now.toISOString(),
    readableTime: now.toLocaleString()
  });
}

function sendToWebhook(data) {
  console.log("=== Sending Data ===", data);
  
  // Use Image beacon method (works in Teams desktop)
  const params = new URLSearchParams({
    user: data.user,
    userName: data.userName,
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
    console.log("⚠️ Request completed (may have succeeded)");
  };
  
  console.log("Request URL:", img.src);
}