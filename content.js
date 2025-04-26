console.log("Content script loaded");
let content = document.querySelector("body").innerText;

let Words = content.split(/[ \n]+/);

// chrome.runtime.sendMessage({ action: "update", data: Words.length });
