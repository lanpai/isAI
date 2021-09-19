chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.to === "content-script") {
    // render the iframe with details from background.js
    console.log("received probability", request.prob);
    console.log("data type: ", request.type);
    console.log("page url: ", request.pageUrl);
  }
});
