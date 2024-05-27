let openUrls = [];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Get extension configuration
    if (request.action === 'getConfig') {
        chrome.storage.local.get(['blockImages', 'blockVideos', 'reduceQuality'], (result) => {
            sendResponse(result);
        });
        return true;
    }
});

chrome.storage.local.get(['blockImages', 'blockVideos', 'reduceQuality'], (result) => {
    handleContentChanges(result.blockImages, result.blockVideos, result.reduceQuality);

    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                handleContentChanges(result.blockImages, result.blockVideos, result.reduceQuality);
            }
        }
    });

    observer.observe(document.body, { subtree: true, childList: true });
});

function handleContentChanges(blockImages, blockVideos, reduceQuality) {
    const images = document.querySelectorAll('img');

    images.forEach((img) => {
        if (blockImages) {
            img.style.display = 'none';
        } else {
            img.style.display = '';
            if (reduceQuality) {
                img.style.transform = 'scale(0.5)';
            } else {
                img.style.transform = '';
            }
        }
    });

    const videos = document.querySelectorAll('video');
    videos.forEach((video) => {
        if (blockVideos) {
            video.pause();
            video.src = '';
            video.load();
        }
    });
}
