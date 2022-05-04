let urls = []

chrome.runtime.onInstalled.addListener(async () => {
    console.log("ext installed")
    chrome.storage.local.get("urls", ({ urls: argUrls }) => {
        // console.log("urls:", argUrls)
        if (argUrls) {
            urls = argUrls
        }
    })
})

function resetUrls() {
    urls = []
    chrome.storage.local.set({ urls }, () => {
        // console.log("starage set ", urls)
    })
}

function pushUrls(urlObj) {
    for (const obj in urls) {
        if (obj.url == urlObj.url) {
            return;
        }
    }

    urls.push(urlObj)
    chrome.storage.local.set({ urls }, () => {
        // console.log("starage set ", urls)
    })
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("on message ", request)
    if (request.type == "getUrls") {
        sendResponse(urls)
    }

    if (request.type == "reset") {
        resetUrls([])
    }
})

chrome.webRequest.onBeforeSendHeaders.addListener(({ requestHeaders: headers, url }) => {
    // console.log(headers, url)
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        pushUrls({
            headers,
            url,
            title: tabs[0] ? tabs[0].title : "untitled",
            pageUrl: tabs[0] ? tabs[0].url : "#"
        })
    })

}, { urls: ["https://*/*.m3u8*"] }, ["requestHeaders", "extraHeaders"])