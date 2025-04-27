document.addEventListener("DOMContentLoaded", async () => {
  const resultDiv = document.querySelector(".result");
  const currentTabs = await getAndUpdateAllTabs(resultDiv);
  console.log(currentTabs);
  const confirmButton = document.querySelector(".confirm");

  confirmButton.addEventListener("click", handleDeletion);
  async function handleDeletion() {
    const selectedValue = document.querySelector("#delete-Options");
    let val = selectedValue.value;
    console.log(val);
    if (val === "Remove except current") {
      await removeAllButCurrent(currentTabs, resultDiv);
    } else if (val === "Remove Selected") {
      handleSelected(currentTabs);
    } else if (val === "Remove except selected") {
      handleSelected(currentTabs, true);
    }
  }
  const tabTitles = document.querySelectorAll(".tabTitle");
  tabTitles.forEach((div) => {
    div.addEventListener("click", (e) => toggleTabClick(e));
  });
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
        div.id = tab.id;
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

function handleSelected(alltabs, rev = false) {
  // sending a message to content.js
  // chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
  //   chrome.tabs.sendMessage(tabs[0].id, "This is a message", getRes);
  // });

  //removing all selected tabs
  const tabTitles = document.querySelectorAll(".tabTitle");
  let tabTitlesToRemove = Array.from(tabTitles)
    .filter((tab) =>
      rev === false
        ? tab.classList.value.includes("magenta")
        : !tab.classList.value.includes("magenta")
    )
    .map((tab) => Number(tab.id));
  console.log(tabTitlesToRemove);
  const resultDiv = document.querySelector(".result");
  resultDiv.innerHTML = "";
  // let TabsToClose = alltabs
  //   .filter((tab) => tabTitlesToRemove.includes(tab.title))
  //   .map((tab) => tab.id);
  chrome.tabs.remove(tabTitlesToRemove);
  let tabsToKeep = Array.from(tabTitles).filter((tab) =>
    rev === false
      ? !tab.classList.value.includes("magenta")
      : tab.classList.value.includes("magenta")
  );
  tabsToKeep.forEach((tab) => {
    const div = document.createElement("div");
    div.id = tab.id;
    div.textContent = tab.innerText;
    div.classList.add("tabTitle");
    div.addEventListener("click", (e) => toggleTabClick(e));
    resultDiv.appendChild(div);
  });
}

function getRes(res) {
  const wordDiv = document.querySelector(".wordCount");
  wordDiv.textContent = `${res.count} ${res.totalCount}`;
  // const selected = document.querySelectorAll(".magenta");
}
