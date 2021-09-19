chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "sampleContextMenu",
    title: "Check if isAI()",
    contexts: ["image", "video", "selection"],
  });

  chrome.contextMenus.onClicked.addListener(async (clickData, tab) => {
    console.log(clickData);
    console.log(tab);

    // if we are checking image file, we need to turn its source url to a file before passing it to the server
    if (clickData.mediaType === "image") {
      // converting "image source" (url) to "Base64".
      let url = clickData.srcUrl;
      let blob = await (await fetch(url)).blob();
      var data = new FormData();
      data.append("data", blob, "file");
      const response = await (
        await fetch("http://localhost:5000/validate/image", {
          method: "POST",
          body: data,
        })
      ).json();
      console.log(response);
    }
  });
});
