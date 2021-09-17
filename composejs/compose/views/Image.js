import { View } from "./reusable/View.js"
import { stateOf$1 } from "../state.js"
import { Modifier } from "../modifier.js"
import { WebComponent } from "../WebComponent.js"
import { css, onStateValueChange } from "../ext.js"


class ComposeImage extends View {
    constructor({ src, placeholder=null, onLoad=null }) {
        super()

        this.src = stateOf$1(src)
        this.placeholder = stateOf$1(placeholder)

        this.onLoad = e => {
            onLoad && onLoad(e)
            this.imageElement.classList.remove("placeholder")
            if (!this.style.height) {
                this.style.height = e.target.height + "px"
            }
            if (placeholder === null) {
                this.imageElement.style.visibility = "visible"
            }
        }

        this.apply({
            style: `
            :host {
                object-fit: cover;
                object-position: center;
                width: 100%;
            }
            .placeholder {
                filter: blur(10px);
            }
            img {
                transition: all 0.3s ease;
                position: absolute;
                top: 0;
                left: 0;
                width: inherit;
                height: inherit;
                max-width: inherit;
                max-height: inherit;
                object-fit: inherit;
                object-position: inherit;
            }
            `,
            html: `
            <img src="${this.placeholder.value || ''}" class="${this.placeholder.value ? 'placeholder' : ''}"/>
            `
        })

        this.imageElement = this.shadowRoot.querySelector('img')
        if (placeholder === null) {
            this.imageElement.style.visibility = "hidden"
        }
        setTimeout(() => {
            this.imageElement.src = this.parseImageData(this.src.appliedValue)
        }, 50)

        onStateValueChange(this, this.src, v => {
            this.recompose(v)
        })
    }

    parseImageData(src) {
        if (src instanceof Blob) {
            return URL.createObjectURL(src)
        } else {
            return src
        }
    }

    recompose(v) {
        this.imageElement.src = this.parseImageData(v)
    }

    connectedCallback() {
        this.imageElement.addEventListener("load", this.onLoad)
    }

    disconnectedCallback() {
        this.imageElement.removeEventListener("load", this.onLoad)
    }
}


function Image({ src, placeholder=null, onLoad=null, modifier=Modifier() }, scope) {
    if (!WebComponent.wasRegistered("compose-image")) {
        window.customElements.define('compose-image', ComposeImage)
    }
    const doc = new ComposeImage({ src, placeholder, onLoad })
    modifier.$apply(doc)

    if (scope === undefined) {
        console.error("Image must be used with a parent scope");
        return
    }
    scope.addChild(doc)
}

export { Image }
