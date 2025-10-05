// popup.js

const focusScoreEl = document.getElementById("focusScore");
const activeTimeEl = document.getElementById("activeTime");
const idleTimeEl = document.getElementById("idleTime");
const tabSwitchesEl = document.getElementById("tabSwitches");
const responseEl = document.getElementById("response");

const refreshBtn = document.getElementById("refreshBtn");
const manualSubmitBtn = document.getElementById("manualSubmitBtn");

const API_BASE = "http://localhost:5000/api/scores";

async function getToken() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["token"], (result) => resolve(result.token));
  });
}

// Fetch analytics from backend
async function fetchAnalytics() {
  const token = await getToken();
  if (!token) {
    responseEl.textContent = "⚠ User not logged in!";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/analytics`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    focusScoreEl.textContent = data.focusScore || "--";
    activeTimeEl.textContent = data.activityTime || "--";
    idleTimeEl.textContent = data.idleTime || "--";
    tabSwitchesEl.textContent = data.tabSwitches || "--";

    responseEl.textContent = "✅ Analytics fetched successfully!";
  } catch (err) {
    responseEl.textContent = "❌ Error fetching analytics: " + err.message;
  }
}

// Manual submit
manualSubmitBtn.addEventListener("click", async () => {
  const token = await getToken();
  if (!token) {
    responseEl.textContent = "⚠ User not logged in!";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/submit`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ activityTime: 0, tabSwitches: 0 }), // default, background tracks actual
    });
    const data = await res.json();
    responseEl.textContent = "✅ Score submitted manually!";
    fetchAnalytics(); // Refresh after submit
  } catch (err) {
    responseEl.textContent = "❌ Error submitting score: " + err.message;
  }
});

refreshBtn.addEventListener("click", fetchAnalytics);

// Auto-fetch when popup opens
fetchAnalytics();
