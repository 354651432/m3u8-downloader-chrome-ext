const text1 = document.getElementById("txt1")
const ul = document.getElementById("ul")

let hostUrl = "http://127.0.0.1:2000/m3u8"

window.onload = function () {
    update()
}

function update() {
    chrome.runtime.sendMessage({ type: "getUrls" }, urls => {
        for (const it of urls) {
            const { url, headers } = it
            addLink(url, headers)
        }
    })
}

function addLink(url, headersArr = {}) {
    const idx = url.lastIndexOf("/") + 1
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("title", url)
    link.innerText = url.substr(idx)

    const button = document.createElement("button")
    button.innerText = "download"

    const headers = {}
    headersArr.map(it => headers[it.name] = it.value)

    button.onclick = async function () {
        try {
            const res = await fetch(hostUrl, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ headers, url })
            })
            json = await res.json()
            if (json.code == 0) {
                alert('added to downloadlist')
            } else {
                alert('downloading')
            }
        }
        catch (err) {
            alert('connect error check if server is not running')
        }

    }

    const li = document.createElement("li")
    li.appendChild(link)
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