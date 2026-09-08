
async function getWebPage() {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func: ()=> {
            var allowCopyAndPaste = function (e) { e.stopImmediatePropagation(); return true; };
            document.addEventListener("copy", allowCopyAndPaste, true);
            document.addEventListener("paste", allowCopyAndPaste, true);
            document.addEventListener("onpaste", allowCopyAndPaste, true);
        }
    });
}

getWebPage();