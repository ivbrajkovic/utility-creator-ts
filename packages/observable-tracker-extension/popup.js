document.addEventListener("DOMContentLoaded", () => {
  const stateDiv = document.getElementById("state");
  const state = {};

  function renderUpdates({ key, newValue }) {
    state[key] = newValue;
    stateDiv.innerHTML = `<div>${JSON.stringify(state, null, 2)}</div>`;
  }

  // Fetch the initial updates from the background script or storage.
  chrome.storage.local.get(["updates"], (result) => {
    const updates = result.updates || [];
    renderUpdates(updates);
  });

  // Listen for real-time updates
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "OBSERVABLE_UPDATE") {
      renderUpdates(message.payload);
    }
  });
});
