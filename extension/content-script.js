function initFrame(frame) {
  frame.seamless = true;
  frame.width = '500px';
  frame.height = '200px';
  frame.id = 'isAI-modal';

  frame.style.position = 'fixed';
  frame.style.zIndex = '1000000';
  frame.style.top = '10px';
  frame.style.right = '10px';
  frame.style.borderRadius = '5px';
  frame.style.borderStyle = 'none';
  frame.style.boxShadow = 'rgba(0,0,0,0.25) 0 4px 8px';
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.to === 'content-script') {
    isNew = false;
    let frame = document.getElementById('isAI-modal')

    if (!frame) {
      isNew = true;
      frame = document.createElement('iframe');
      initFrame(frame);
    }

    frame.src = chrome.runtime.getURL(
        `/stats.html?prob=${request.prob}&url=${request.pageUrl}&type=${request.type}`)

    if (isNew)
      document.body.prepend(frame);
  }
  if (request.to === 'loading') {
    isNew = false;
    let frame = document.getElementById('isAI-modal')

    if (!frame) {
      isNew = true;
      frame = document.createElement('iframe');
      initFrame(frame);
    }

    frame.src = chrome.runtime.getURL(
        '/loading.html')

    if (isNew)
      document.body.prepend(frame);
  }
});
