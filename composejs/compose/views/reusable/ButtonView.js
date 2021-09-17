import { addRippleEffect } from "../../ext.js"
import { Scope } from "../../scope.js"

class ButtonView extends HTMLElement {
    constructor({content=null, onClick=null, disabled=false, baseStyle=null, enabledStyle=null, enabledHoverStyle=null, disabledStyle=null, contentColor=null}={}) {
        super()
        this.attachShadow({ mode: 'open' })
        this.__onClick = onClick
        this.__disabled = disabled
        
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
                    display: flex;
                    border-radius: 4px;
                    text-transform: uppercase;
                    border: none;
                    font-size: .875rem;
                    font-weight: 500;
                    padding: 0 16px;
                    letter-spacing: .05em;
                    overflow: hidden;
                    min-height: 36px;
                    min-width: 64px;
                    align-items: center;
                    justify-content: center;

                    ${ baseStyle || '' }

                    ${ disabled ? (disabledStyle || '') : `
                    ${ enabledStyle || '' }
                    cursor: pointer;
                    transition: all .2s ease-in-out;
                    ` }
                }
                :host > * {
                    text-align: center;
                }
                ${ disabled ? '' : `
                :host(:active) {
                    ${ enabledHoverStyle || '' }
                    filter: brightness(1.1);
                }
                ` }
                ${ disabled ? `
                :host {
                    opacity: 0.8;
                }
                ` : '' }
                #compose-button-text-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: row;
                }
            </style>
            <div id="compose-button-text-container" class="${ disabled ? 'disabled' : '' }"></div>
        `
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        this.__buttonContainer = this.shadowRoot.querySelector('#compose-button-text-container')

        if (contentColor) {
            this.style.color = contentColor
        }

        if (typeof content === "function") {
            let buttonScope = new Scope(this.__buttonContainer, content).compose()
            for (let child of buttonScope.children) {
                if (contentColor) {
                    child.style.color = "inherit"
                }
            }
        }

        this.onClickCallback = e => {
            if (this.__disabled) {
                return
            }
            addRippleEffect(this, e)
    
            if (this.__onClick !== null) {
                this.__onClick(e)
            }
        }
        this.hammer = new Hammer(this)
    }

    connectedCallback() {
        // bind events here
        this.hammer.on('tap', this.onClickCallback)
    }

    disconnectedCallback() {
        // this.incrementBtn.removeEventListener('click', this.increment);
        // this.removeEventListener('click', this.__onClickCallback)
        this.hammer.off("tap")
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


export { ButtonView }
