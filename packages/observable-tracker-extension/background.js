console.log("Background script loaded.", chrome.action, chrome.browserAction);

if (chrome.action && chrome.action.onClicked) {
  chrome.action.onClicked.addListener((tab) => {
    chrome.windows.create({
      url: chrome.runtime.getURL("popup.html"),
      type: "popup",
      width: 400,
      height: 600,
    });
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "OBSERVABLE_UPDATE") {
    console.log(
      `Received change for key: ${message.key} with value: ${message.newValue}`,
    );
    // You can store the change or send it elsewhere as needed.
  }
});
