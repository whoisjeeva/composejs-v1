import { Modifier } from "../modifier.js"
import { WebComponent } from "../WebComponent.js"
import { MaterialTheme } from "../theme.js"
import { stateOf, State } from "../state.js"
import { onStateValueChange } from "../ext.js"
import { Scope } from "../scope.js"
import { View } from "./reusable/View.js"

class ComposeText extends View {
    constructor({text }) {
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
            :host {
                display: inline-flex;
            }
            :host > * {
                user-select: inherit;
            }
            `,
            html: `
            <div id="compose-text-view">${this.__textState.value}</div>
            `
        })
        this.__textView = this.shadowRoot.querySelector('#compose-text-view')
        this.__textView.textContent = this.__textState.appliedValue
        
        onStateValueChange(this, this.__textState, v => {
            this.recompose(v)
        })
    }

    recompose(v) {
        let scope = new Scope(this.__textView, scope => {
            scope.addChild(document.createTextNode(v))
        })
        scope.recompose()
    }

    connectedCallback() {
        // bind events here

        if (this.hasAttribute('text')) {
            this.__textState.value = this.getAttribute('text');
            this.__textView.textContent = this.__textState.value;
        }
    }

    static get observedAttributes() {
        return ['text'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.__textView.textContent = this.__textState.value;
    }

    get text() {
        return this.__textState.value;
    }

    set text(value) {
        this.__textState.value = value;
    }

    disconnectedCallback() {
        // this.incrementBtn.removeEventListener('click', this.increment);
    }
}


function Text({text="", modifier=Modifier()}={}, scope) {
    if (!WebComponent.wasRegistered("compose-text")) {
        window.customElements.define('compose-text', ComposeText)
    }

    let doc = new ComposeText({ text })
    // onSystemThemeChange(e => {
    //     if (modifier.value.color === undefined) {
    //         doc.style.color = MaterialTheme.colors.onSurface
    //     }
    // })

    Modifier().style(MaterialTheme.typography.body1).$apply(doc)
    modifier.$apply(doc)
    
    if (scope === undefined) {
        console.error("Text must be used with a parent scope");
        return
    }
    scope.addChild(doc)
}

export { Text }