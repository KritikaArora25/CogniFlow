// This script runs on your website pages

// Intercept fetch requests to catch login response
(function() {
  const originalFetch = window.fetch;
  window.fetch = async function(...args) {
    const response = await originalFetch.apply(this, args);

    try {
      const clone = response.clone();
      const data = await clone.json();

      // Check if the response contains a token
      if (data.token) {
        chrome.storage.local.set({ token: data.token }, () => {
          console.log("✅ JWT token saved to extension storage");
        });
      }
    } catch (err) {
      // ignore non-JSON responses
    }

    return response;
  };
})();
