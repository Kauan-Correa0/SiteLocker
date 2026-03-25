chrome.runtime.onMessage.addListener((msg, sender) => {
    if (msg.action === "bloquear") {
        chrome.scripting.executeScript({
            target: { tabId: sender.tab.id },
            files: ['components/overlay/overlay.js']
        });
    }
});