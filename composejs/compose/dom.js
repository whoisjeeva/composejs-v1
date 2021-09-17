class DOM extends Array {
    constructor(selector, root) {
        super()

        if (selector === undefined || selector === null) return
        if (root === undefined || root === null) {
            root = document
        } else if (root.shadowRoot) {
            root = root.shadowRoot
        }
        if (typeof selector === "string") {
            this.push.apply(this, root.querySelectorAll(selector))
        } else if (selector instanceof Array) {
            this.push.apply(this, selector)
        } else {
            this.push(selector)
        }
    }

    get shadowRoot() { return this[0].shadowRoot }

    find(selector) {
        return new DOM(selector, this[0].shadowRoot || this[0])
    }

    forEach(callback) {
        for (let i = 0; i < this.length; i++) {
            callback(this[i], i)
        }
        return this
    }

    css(style, value) {
        this.forEach(element => {
            if (value === undefined || value === null) {
                Object.keys(style).forEach(key => {
                    element.style[key] = style[key]
                })
            } else {
                element.style[style] = value
            }
        })
        return this
    }

    attr(attr, value) {
        if (value === undefined || value === null) {
            return this[0].getAttribute(attr)
        } else {
            this.forEach(element => {
                element.setAttribute(attr, value)
            })
            return this
        }
    }

    append(el) {
        this.forEach(element => {
            if (el.length) {
                el.forEach(e => {
                    element.appendChild(e)
                })
            } else {
                element.appendChild(el)
            }
        })
        return this
    }

    get text() {
        return this[0].textContent
    }

    set text(text) {
        this.forEach(element => {
            element.textContent = text
        })
        return this
    }
}

function $(selector, root) {
    return new DOM(selector, root)
}


export { $ }

