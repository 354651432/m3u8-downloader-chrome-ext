const text1 = document.getElementById("txt1")
const ul = document.getElementById("ul")

let hostUrl = "http://127.0.0.1:2022/m3u8"

window.onload = function () {
    update()
}

function update() {
    // console.log("before send message")
    chrome.runtime.sendMessage(null, { type: "getUrls" }, {}, urls => {
        // console.log("got message", urls)
        for (const it of urls) {
            const { url, headers, title, pageUrl } = it
            addLink(url, headers, title, pageUrl)
        }
    })
}

function addLink(url, headersArr, title, pageUrl) {
    const idx = url.lastIndexOf("/") + 1
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("title", url)
    link.innerText = title + "_" + url.substr(idx)

    const button = document.createElement("button")
    button.classList = "btn btn-outline-primary btn-sm float-right"
    button.innerText = "download"
    button.onclick = async function () {
        try {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 1500)
            const res = await fetch(hostUrl, {
                signal: controller.signal,
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ headers, url, title })
            })
            json = await res.json()
            if (json.code == 0) {
                alert('added to downloadlist')
            } else {
                alert('downloading')
            }
        }
        catch (err) {
            if (err instanceof DOMException) {
                alert('timeout maybe downloading')
                return
            }
            alert('connect error check if server is not running')
        }

    }

    const buttonSrc = document.createElement("button")
    buttonSrc.classList = "btn btn-outline-primary btn-sm float-right ml-2"
    buttonSrc.innerText = "src"
    buttonSrc.onclick = function () {
        if (pageUrl != "#") {
            window.open(pageUrl)
        }
    }

    const headers = {}
    headersArr.map(it => headers[it.name] = it.value)



    const li = document.createElement("li")
    li.classList = "list-group-item pb-0 pt-2 px-0"
    li.appendChild(link)
    li.appendChild(buttonSrc)
    li.appendChild(button)

    ul.appendChild(li)
}

document.getElementById("btn-update").onclick = function () {
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild)
    }

    update()
}

document.getElementById("btn-clear").onclick = function () {
    chrome.runtime.sendMessage({ type: "reset" })

    while (ul.firstChild) {
        ul.removeChild(ul.firstChild)
    }
}