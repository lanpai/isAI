chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "sampleContextMenu",
    title: "Check if isAI()",
    contexts: ["image", "video", "selection"],
  });

  chrome.contextMenus.onClicked.addListener(async (clickData) => {
    // console.log(clickData);
    // console.log(tab);

    let response;
    let type;
    if (clickData.mediaType === "image") {
      // converting "image source" (url) to "blob".
      let url = clickData.srcUrl;
      let blob = await (await fetch(url)).blob();
      var data = new FormData();
      data.append("data", blob, "file");
      response = await (
        await fetch("http://localhost:5000/validate/image", {
          method: "POST",
          body: data,
        })
      ).json();
      type = "image";
      console.log(response);
    } else if (clickData.selectionText) {
      var data = new FormData();
      data.append("data", clickData.selectionText);
      response = await (
        await fetch("http://localhost:5000/validate/text", {
          method: "POST",
          body: data,
        })
      ).json();
      type = "text";
      console.log(response);
    }
    // send the response details to content-script.js to render iframe
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        to: "content-script",
        prob: response.prob,
        type,
      });
    });
  });
});
