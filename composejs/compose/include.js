function Include(path) {
    return new Promise((resolve, reject) => {
        if (path.endsWith(".js")) {
            let script = document.createElement("script")
            script.onload = resolve
            script.onerror = reject
            script.src = path
            document.head.appendChild(script)
        } else if (path.endsWith(".css")) {
            let style = document.createElement("style")
            style.onload = resolve
            style.onerror = reject
            style.href = path
            document.head.appendChild(style)
        }
    })
}

export { Include }
