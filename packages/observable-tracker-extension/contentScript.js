window.addEventListener(
  "message",
  (event) => {
    if (event.source !== window) return;

    if (event.data.type && event.data.type === "OBSERVABLE_UPDATE") {
      console.log(event.data);
      chrome.runtime.sendMessage(event.data);
    }
  },
  false,
);
