document.addEventListener("DOMContentLoaded", async () => {
  const resultDiv = document.querySelector(".result");
  const currentTabs = await getAndUpdateAllTabs(resultDiv);
  const button = document.querySelector(".all");
  const selectedBtn = document.querySelector(".selected");
  button.addEventListener(
    "click",
    async () => await removeAllButCurrent(currentTabs, resultDiv)
  );
  const tabTitles = document.querySelectorAll(".tabTitle");
  tabTitles.forEach((div) => {
    div.addEventListener("click", (e) => toggleTabClick(e));
  });

  selectedBtn.addEventListener("click", handleSelected);
});

async function removeAllButCurrent(tabs, res) {
  chrome.tabs.query({ active: true, currentWindow: true }, (activeTabs) => {
    const activeTabID = activeTabs[0].id;
    const TabsToClose = tabs
      .filter((tab) => tab.id !== activeTabID)
      .map((tab) => tab.id);
    chrome.tabs.remove(TabsToClose);
    res.textContent = "";
    const div = document.createElement("div");
    div.textContent = activeTabs[0].title;
    div.classList.add("tabTitle");
    document.body.appendChild(div);
  });
}

async function getAndUpdateAllTabs(resDiv) {
  return new Promise((resolve) => {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      tabs.forEach((tab) => {
        const div = document.createElement("div");
        div.textContent = tab.title;
        div.classList.add("tabTitle");
        resDiv.appendChild(div);
      });
      resolve(tabs);
    });
  });
}

function toggleTabClick(e) {
  e.target.classList.toggle("magenta");
}

function handleSelected() {
  // sending a message to content.js
  chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, "This is a message", getRes);
  });
}

function getRes(res) {
  const wordDiv = document.querySelector(".wordCount");
  wordDiv.textContent = `${res.count} ${res.totalCount}`;
}
