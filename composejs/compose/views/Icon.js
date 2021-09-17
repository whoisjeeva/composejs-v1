import { View } from './reusable/View.js'
import { Modifier } from "../modifier.js"
import { WebComponent } from "../WebComponent.js"
import { MaterialTheme } from "../theme.js"
import { onSystemThemeChange, onStateValueChange } from "../ext.js"
import { stateOf, State } from "../state.js"
import { Scope } from "../scope.js"

class ComposeIcon extends View {
    constructor({icon, scope}) {
        super()
        
        if (icon === null || icon === undefined) {
            this.__iconState = stateOf("")
        } else if (icon instanceof State) {
            this.__iconState = icon
        } else {
            this.__iconState = stateOf(icon)
        }

        this.apply({
            style: `
            .material-icons {
                font-family: 'Material Icons';
                font-weight: normal;
                font-style: normal;
                font-size: 24px;
                line-height: 1;
                letter-spacing: normal;
                text-transform: none;
                display: inline-block;
                white-space: nowrap;
                word-wrap: normal;
                direction: ltr;
                -webkit-font-feature-settings: 'liga';
                -webkit-font-smoothing: antialiased;
            }
            :host {
                align-items: center;
                justify-content: center;
                font-size: 1.5em;
                overflow: hidden;
                width: 24px;
                height: 24px;
            }
            .material-icons {
                font-size: inherit;
                font-style: normal;
                width: 100%;
                height: 100%;
            }
            #compose-icon {
                display: flex;
                align-items: center;
                justify-content: center;
            }
            `,
            html: `
            <div id="compose-icon" class='material-icons'></div>
            `
        })

        this.__iconView = this.shadowRoot.querySelector('.material-icons')
        this.__iconView.textContent = this.__iconState.appliedValue
        onStateValueChange(this, this.__iconState, v => {
            this.recompose(v)
        })
    }

    recompose(v) {
        let scope = new Scope(this.__iconView, scope => {
            scope.addChild(document.createTextNode(v))
        })
        scope.recompose()
    }

    connectedCallback() {
        // bind events here

        if (this.hasAttribute('icon')) {
            this.__iconState.value = this.getAttribute('icon');
            this.__iconView.textContent = this.__iconState.value;
        }
    }

    static get observedAttributes() {
        return ['icon'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.__iconView.textContent = this.__iconState.value;
    }

    get icon() {
        return this.__iconState.value;
    }

    set icon(value) {
        this.__iconState.value = value;
    }
}




function Icon({icon=null, modifier=Modifier()}={}, scope) {
    if (!WebComponent.wasRegistered("compose-icon")) {
        window.customElements.define('compose-icon', ComposeIcon)
    }
    let doc = new ComposeIcon({ icon, scope })
    onSystemThemeChange(e => {
        doc.style.color = MaterialTheme.colors.onSurface
    })
    modifier.$apply(doc);

    if (scope === undefined) {
        console.error("Icon must be used with a parent scope");
        return
    }
    scope.children.push(doc)
}

export { Icon }
