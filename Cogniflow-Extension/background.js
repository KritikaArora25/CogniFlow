// background.js

let activeTime = 0;        // Time user is active (in seconds)
let idleTime = 0;          // Time user is idle
let tabSwitches = 0;       // Count of tab switches
let lastActiveTabId = null;
let interval;

// Function to get JWT token from content script
const getToken = () =>
  new Promise((resolve) => {
    chrome.storage.local.get(["token"], (result) => {
      resolve(result.token);
    });
  });

// Track tab switches
chrome.tabs.onActivated.addListener(() => {
  tabSwitches++;
});

// Track window focus
chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId !== chrome.windows.WINDOW_ID_NONE) {
    // User came back
  }
});

// Track idle time using Chrome Idle API
chrome.idle.setDetectionInterval(15); // 15 seconds
chrome.idle.onStateChanged.addListener((state) => {
  if (state === "idle" || state === "locked") {
    // User is idle
  }
});

// Start tracking every second
const startTracking = () => {
  interval = setInterval(() => {
    chrome.idle.queryState(15, (state) => {
      if (state === "active") {
        activeTime++;
      } else {
        idleTime++;
      }
    });
  }, 1000);
};

startTracking();

// Function to submit score to backend
const submitScore = async () => {
  const token = await getToken();
  if (!token) return; // User not logged in yet

  const payload = {
    activityTime,
    idleTime,
    tabSwitches,
  };

  try {
    const res = await fetch("http://localhost:5000/api/scores/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log("✅ Score submitted:", data);

    // Reset counters after submission
    activeTime = 0;
    idleTime = 0;
    tabSwitches = 0;
  } catch (err) {
    console.error("❌ Error submitting score:", err.message);
  }
};

// Auto-submit score every 60 seconds
setInterval(submitScore, 60000);
