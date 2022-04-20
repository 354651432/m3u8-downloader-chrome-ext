let urls = []

chrome.runtime.onInstalled.addListener(async () => { })

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type == "getUrls") {
        sendResponse(urls)
    }

    if (request.type == "reset") {
        urls = []
    }
})

chrome.webRequest.onBeforeSendHeaders.addListener(({ requestHeaders: headers, url }) => {
    urls.push({ headers, url })
}, { urls: ["https://*/*.m3u8"] }, ["requestHeaders", "extraHeaders"])