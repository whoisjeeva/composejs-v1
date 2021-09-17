
function get({
    url, 
    params, 
    headers, 
    blob=false,
    onProgress=null,
    onError=null,
    onSuccess=null,
    onFail=null,
    onAbort=null,
    onStart=null
}) {
    let xhr = new XMLHttpRequest()
    if (params) {
        url += `?${Object.entries(params).map(v => v[0] + "=" + v[1]).join("&")}`
    }
    if (headers) {
        Object.entries(headers).forEach(v => xhr.setRequestHeader(v[0], v[1]))
    }
    if (blob) xhr.responseType = "blob"
    xhr.open("GET", url)
    xhr.onload = () => {
        if (xhr.statusText === "OK" || xhr.status === 200) {
            onSuccess(xhr)
        } else {
            onFail(xhr)
        }
    }
    xhr.onprogress = onProgress
    xhr.onerror = onError
    xhr.onabort = onAbort
    xhr.onloadstart = onStart

    xhr.send()
    return xhr
}

function post({
    url, 
    data, 
    headers, 
    blob=false,
    onProgress=null,
    onError=null,
    onSuccess=null,
    onFail=null,
    onAbort=null,
    onStart=null
}) {
    let xhr = new XMLHttpRequest()
    if (blob) xhr.responseType = "blob"
    xhr.open("POST", url)
    
    xhr.onload = () => {
        if (xhr.statusText === "OK" || xhr.status === 200) {
            onSuccess(xhr)
        } else {
            onFail(xhr)
        }
    }
    xhr.onprogress = onProgress
    xhr.onerror = onError
    xhr.onabort = onAbort
    xhr.onloadstart = onStart

    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    if (headers) {
        Object.entries(headers).forEach(v => xhr.setRequestHeader(v[0], v[1]))
    }
    if (data) {
        xhr.send(Object.entries(data).map(v => v[0] + "=" + v[1]).join("&"))
    } else {
        xhr.send()
    }
    return xhr
}

function head({
    url, 
    headers,
    onProgress=null,
    onError=null,
    onSuccess=null,
    onFail=null,
    onAbort=null,
    onStart=null
}) {
    let xhr = new XMLHttpRequest()
    if (headers) {
        Object.entries(headers).forEach(v => xhr.setRequestHeader(v[0], v[1]))
    }
    xhr.open("HEAD", url)
    xhr.onload = () => {
        if (xhr.statusText === "OK" || xhr.status === 200) {
            onSuccess(xhr)
        } else {
            onFail(xhr)
        }
    }
    xhr.onprogress = onProgress
    xhr.onerror = onError
    xhr.onabort = onAbort
    xhr.onloadstart = onStart
    
    xhr.send()
    return xhr
}


export {get, post, head}

