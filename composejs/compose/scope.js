class Scope {

    constructor(element, composer) {
        this.element = element.shadowRoot || element
        this.composer = composer || null
        this.children = []
        this.data = null
    }

    modify(modifier) {
        modifier.$apply(this.element)
        return this
    }

    addChild(child) {
        this.children.push(child)
        return this
    }

    async composeAsync(composer) {
        this.children = []
        let comp = composer || this.composer
        await comp(this)
        for (let i = 0; i < this.children.length; i++) {
            this.element.appendChild(this.children[i])
        }
        return this
    }

    compose(composer, style) {
        if (style) {
            let st = document.createElement("style")
            st.textContent = style.textContent
            this.element.appendChild(st)
        }
        
        this.children = []
        let comp = composer || this.composer
        if (comp.constructor.name === "AsyncFunction") {
            this.composeAsync(comp)
            return this
        }
        comp(this)        
        for (let i = 0; i < this.children.length; i++) {
            this.element.appendChild(this.children[i])
        }
        return this
    }

    recompose(composer) {
        let style = this.element.querySelector("style")
        this.element.innerHTML = ''
        this.compose(composer, style)
        return this
    }
}


export { Scope }
