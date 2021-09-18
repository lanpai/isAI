chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "sampleContextMenu",
    title: "Check if isAI()",
    contexts: ["image", "video", "selection"],
  });

  chrome.contextMenus.onClicked.addListener(function (clickData, tab) {
    console.log(clickData);
    console.log(tab);
  });
});
