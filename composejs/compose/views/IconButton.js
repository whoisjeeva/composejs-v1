import { View } from './reusable/View.js'
import { Modifier } from "../modifier.js"
import { WebComponent } from "../WebComponent.js"
import { MaterialTheme } from "../theme.js"
import { onSystemThemeChange, addRippleEffect, onStateValueChange } from "../ext.js"
import { stateOf, State } from "../state.js"
import { Scope } from "../scope.js"
import { colorOf } from "../color.js"

class ComposeIconButton extends View {
    constructor({icon=null, onClick=null}={}) {
        super()
        this.attachShadow({ mode: 'open' })
        this.onClick = e => {
            addRippleEffect(this, e)
            onClick && onClick(e)
        }
        this.mouseDownCallback = e => {
            this.css("background-color", colorOf("#ccc").copy(0.3))
        }
        this.mouseUpCallback = e => {
            this.css("background-color", "transparent")
        }
        
        if (icon === null || icon === undefined) {
            this.__iconState = stateOf("")
        } else if (icon instanceof State) {
            this.__iconState = icon
        } else {
            this.__iconState = stateOf(icon)
        }

        let template = document.createElement('template')
        template.innerHTML = `
            <style>
                * {
                    box-sizing: border-box;
                    outline: none;
                    user-select: none; 
                }
                :host {
                    position: relative;
                    display: inline-block;
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    font-size: 1.5em;
                    overflow: hidden;
                }
                .material-icons {
                    font-size: inherit;
                    font-family: "Material Icons";
                    font-style: normal;
                }
                #compose-icon-button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            </style>
            <div id="compose-icon-button"><i class='material-icons'></i></div>
        `
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        this.__iconView = this.shadowRoot.querySelector('.material-icons')
        this.__iconView.textContent = this.__iconState.appliedValue
            
        onStateValueChange(this, this.__iconState, v => {
            this.recompose(v)
        })

        this.hammer = new Hammer(this)
    }

    recompose(v) {
        let scope = new Scope(this.__iconView, scope => {
            scope.addChild(document.createTextNode(v))
        })
        scope.recompose()
    }

    connectedCallback() {
        // bind events here
        this.hammer.on('tap', this.onClick)
        this.addEventListener('mousedown', this.mouseDownCallback)
        this.addEventListener('mouseup', this.mouseUpCallback)

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

    disconnectedCallback() {
        // this.incrementBtn.removeEventListener('click', this.increment);
        this.hammer.off('tap')
        this.removeEventListener('mousedown', this.mouseDownCallback)
        this.removeEventListener('mouseup', this.mouseUpCallback)
    }

    css(style, value) {
        if (value === undefined || value === null) {
            let keys = Object.keys(style)
            for (let k of keys) {
                this.style[k] = style[k]
            }
        } else {
            this.style[style] = value
        }
    }
}




function IconButton({icon=null, onClick=null, modifier=Modifier()}={}, scope) {
    if (!WebComponent.wasRegistered("compose-icon-button")) {
        window.customElements.define('compose-icon-button', ComposeIconButton)
    }
    let doc = new ComposeIconButton({ icon: icon, onClick: onClick })
    onSystemThemeChange(e => {
        doc.style.color = MaterialTheme.colors.onSurface
    })
    modifier.$apply(doc)

    if (scope === undefined) {
        console.error("IconButton must be used with a parent scope");
        return
    }
    scope.children.push(doc)
}

export { IconButton }
