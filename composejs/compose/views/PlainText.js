import { Modifier } from "../modifier.js"
import { WebComponent } from "../WebComponent.js"
import { MaterialTheme } from "../theme.js"
import { stateOf, State } from "../state.js"
import { onSystemThemeChange, onStateValueChange } from "../ext.js"
import { View } from "./reusable/View.js"

class ComposePlainText extends View {
    constructor({text=null}={}) {
        super()
        
        if (text === null || text === undefined) {
            this.__textState = stateOf("")
        } else if (text instanceof State) {
            this.__textState = text
        } else {
            this.__textState = stateOf(text)
        }
        
        this.apply({
            style: `
            :host > * {
                user-select: inherit;
            }
            `,
            html: ``
        })

        this.__textNode = document.createTextNode(this.__textState.value)
        this.shadowRoot.appendChild(this.__textNode)
        this.__textNode.textContent = this.__textState.appliedValue
    
        onStateValueChange(this, this.__textState, v => {
            this.recompose(v)
        })
    }

    recompose(v) {
        this.__textNode.textContent = v
    }

    connectedCallback() {
        // bind events here

        if (this.hasAttribute('text')) {
            this.__textState.value = this.getAttribute('text');
            this.__textNode.textContent = this.__textState.value;
        }
    }

    static get observedAttributes() { return ['text'] }

    attributeChangedCallback(name, oldValue, newValue) {
        this.__textNode.textContent = this.__textState.value;
    }

    get text() { return this.__textState.value }

    set text(value) { 
        this.__textState.value = value 
    }
}


function PlainText({text=null, modifier=Modifier()}={}, scope) {
    if (!WebComponent.wasRegistered("compose-plain-text")) {
        window.customElements.define('compose-plain-text', ComposePlainText)
    }
    let doc = new ComposePlainText({ text: text })

    onSystemThemeChange(e => {
        if (modifier.value.color === undefined) {
            doc.style.color = MaterialTheme.colors.onSurface
        }
    })

    modifier.$apply(doc)

    if (scope === undefined) {
        console.error("Text must be used with a parent scope");
        return
    }
    scope.children.push(doc)
}

export { PlainText }
