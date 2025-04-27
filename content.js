console.log("Content script loaded");
let content = document.querySelector("body").innerText;

let Words = content.split(/[ \n]+/);

// chrome.runtime.sendMessage({ action: "update", data: Words.length });

//how to receive a message from popup.js
//only works if it is not the chrome://extensions page or the new-tab page
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  sendResponse({ count: Words.length });
});
