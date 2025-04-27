console.log("Content script loaded");
let content = document.querySelector("body").innerText;
let allContent = document.documentElement.innerText;

let words = content.split(/[ \n]+/);
let allWords = allContent.split(/[ \n]+/);

//how to receive a message from popup.js
//only works if it is not the chrome://extensions page or the new-tab page
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  sendResponse({ count: words.length, totalCount: allWords.length });
});
