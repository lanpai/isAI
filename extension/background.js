chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "sampleContextMenu",
    title: "Check if isAI()",
    contexts: ["image", "video", "selection"],
  });

  chrome.contextMenus.onClicked.addListener(function (clickData, tab) {
    console.log(clickData);
    console.log(tab);

    // if we are checking image file, we need to turn its source url to a file before passing it to the server
    if (clickData.mediaType === "image") {
      // converting "image source" (url) to "Base64".
      let url = clickData.srcUrl;
      fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
          var data = new RawFormData();
          data.append("data", blob, "file");
          data.getOutputDeferred().then(function (formData) {
            var xml = new XMLHttpRequest();
            xml.setRequestHeader(
              "Content-Type",
              "multipart/form-data; boundary=" + data.getBoundary()
            );
            xml.setRequestHeader("Content-Length", formData.length);
            xml.open("POST", "localhost:5000/validate/image");
            xml.send(formData);
          });
        });
    }
  });
});
