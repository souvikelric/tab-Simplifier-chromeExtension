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

  selectedBtn.addEventListener("click", () => handleSelected(currentTabs));
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

function handleSelected(alltabs) {
  // sending a message to content.js
  // chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
  //   chrome.tabs.sendMessage(tabs[0].id, "This is a message", getRes);
  // });

  //removing all selected tabs
  console.log(alltabs);
  const tabTitles = document.querySelectorAll(".tabTitle");
  let tabTitlesToRemove = Array.from(tabTitles)
    .filter((tab) => tab.classList.value.includes("magenta"))
    .map((tab) => tab.textContent);

  const resultDiv = document.querySelector(".result");
  resultDiv.innerHTML = "";
  let TabsToClose = alltabs
    .filter((tab) => tabTitlesToRemove.includes(tab.title))
    .map((tab) => tab.id);
  chrome.tabs.remove(TabsToClose);
  let tabsToKeep = Array.from(tabTitles).filter(
    (tab) => !tab.classList.value.includes("magenta")
  );
  console.log(tabsToKeep);
  tabsToKeep.forEach((tab) => {
    const div = document.createElement("div");
    div.textContent = tab.innerText;
    div.classList.add("tabTitle");
    resultDiv.appendChild(div);
  });
}

function getRes(res) {
  const wordDiv = document.querySelector(".wordCount");
  wordDiv.textContent = `${res.count} ${res.totalCount}`;
  // const selected = document.querySelectorAll(".magenta");
}
