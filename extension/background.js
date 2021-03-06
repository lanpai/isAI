chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "imageContextMenu",
    title: "Check isAI(Image)",
    contexts: ["image"],
  });
  chrome.contextMenus.create({
    id: "videoContextMenu",
    title: "Check isAI(Video)",
    contexts: ["video"],
  });
  chrome.contextMenus.create({
    id: "selectionContextMenu",
    title: "Check isAI(Text)",
    contexts: ["selection"],
  });
});

  chrome.contextMenus.onClicked.addListener((clickData) => {
    console.log("clicked");
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { to: "loading" });
    });

    async function run() {
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
          type = "Image";
        } else if (clickData.selectionText) {
          var data = new FormData();
          data.append("data", clickData.selectionText);
          response = await (
            await fetch("http://localhost:5000/validate/text", {
              method: "POST",
              body: data,
            })
          ).json();
          type = "Text";
          console.log(response);
        }
        else if (clickData.mediaType === "video") {
          console.log(clickData);
        }
        
        // send the response details to content-script.js to render iframe
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {
            to: "content-script",
            prob: response.prob,
            type,
            pageUrl: clickData.pageUrl,
          });
        });
    }
    run();
  });
//});

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.to === 'add') {
      fetch('https://isAI.piyo.cafe/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: request.url, prob: request.prob })
      });
    }
    else if (request.to === 'getAverage') {
      fetch('https://isAI.piyo.cafe/getAverage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: request.url })
      }).then(res => res.json())
        .then(res => sendResponse(res));
      return true;
    }
  });
