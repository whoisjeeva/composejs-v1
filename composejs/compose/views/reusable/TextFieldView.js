import { View } from "./View.js"
import { stateOf, State } from "../../state.js"
import { onStateValueChange } from "../../ext.js"
import { Scope } from "../../scope.js"

class TextFieldView extends View {
    
    constructor({
        value=null,
        onValueChange=null, 
        label=null,
        isError=false, 
        leadingIcon=null,
        trailingIcon=null,
        singleLine=false,
        disabled=false,
        style="",
        scope=null,
    }={}) {
        super()
        this.__onChange = onValueChange;
        
        if (value === null || value === undefined) {
            this.__textState = stateOf("")
        } else if (value instanceof State) {
            this.__textState = value
        } else {
            this.__textState = stateOf(value)
        }

        if (isError instanceof State) {
            this.__errorState = isError
        } else {
            this.__errorState = stateOf(isError)
        }

        this.apply({
            html: `
            ${ leadingIcon ? `<span id='leading-icon-container'></span>` : '' }
            <div class="content">
                <input id="compose-text-input" value="${this.__textState.value}">
                <div class="label">${ label || "" }</div>
            </div>
            ${ leadingIcon ? `<span id='trailing-icon-container'></span>` : '' }
            `,
            style: `
            :host {
                height: 48px;
                width: 280px;
                font-size: 16px;
                padding: 0 12px 0 16px;
            }
            #leading-icon-container, #trailing-icon-container {
                display: flex;
                align-items: center;
            }
            .content {
                display: flex;
            }
            .label {
                position: absolute;
                top: 50%;
                left: 0;
                transform: translateY(-50%);
                transition: all 0.2s ease-in-out;
                font-weight: 500;
            }
            ${ label ? `
            #compose-text-input:focus, #compose-text-input.has-value {
                bottom: -8px;
            }
            #compose-text-input:focus ~ .label, #compose-text-input.has-value ~ .label {
                font-size: 12px;
                top: 4px;
                transform: translateY(0);
            }
            ` : '' }
            #compose-text-input, .content {
                width: 100%;
                background-color: transparent;
                border: none;
                color: inherit;
                position: relative;
                font-size: inherit;
                padding: 0;
                transition: all 0.2s ease-in-out;
            }
            ${ style }
            `
        })

        this.__textInput = this.shadowRoot.querySelector('#compose-text-input')
        this.__labelView = this.shadowRoot.querySelector('.label')
        this.__leadingIconContainer = this.shadowRoot.querySelector('#leading-icon-container')
        this.__trailingIconContainer = this.shadowRoot.querySelector('#trailing-icon-container')

        if (disabled) {
            this.style.opacity = 0.5
        }

        if (this.value) {
            this.__textInput.classList.add("has-value")
        }

        if (typeof leadingIcon === "function") {
            new Scope(this.__leadingIconContainer, leadingIcon).compose()
        }

        if (typeof trailingIcon === "function") {
            new Scope(this.__trailingIconContainer, trailingIcon).compose()
        }

        this.__textInput.value = this.__textState.appliedValue
        if (!this.value) {
            this.__textInput.classList.remove("has-value")
        } else {
            this.__textInput.classList.add("has-value")
        }
        
        onStateValueChange(this, this.__textState, v => {
            this.recompose()
        })

        this.__onChangeCallback = this.onChangeCallback.bind(this)
        this.__onFocusCallback = this.onFocusCallback.bind(this)
        this.__onBlurCallback = this.onBlurCallback.bind(this)
        this.__triggerFocusCallback = this.triggerFocusCallback.bind(this)
    }

    recompose() {
        this.__textInput.value = this.__textState.appliedValue
        if (!this.__textState.appliedValue) {
            this.__textInput.classList.remove("has-value")
        } else {
            this.__textInput.classList.add("has-value")
        }
    }

    get value() {
        return this.__textInput.value
    }

    set value(v) {
        this.__textState.value = v
    }

    onChangeCallback(e) {
        if (this.__onChange !== null) {
            this.__onChange(this.value)
        }
        this.__textState.value = this.value
    }

    triggerFocusCallback(e) {
        this.__textInput.focus()
    }

    onFocusCallback(e) {
    }

    onBlurCallback(e) {
        if (!this.value) {
            this.__textInput.classList.remove("has-value")
        } else {
            this.__textInput.classList.add("has-value")
        }
    }

    connectedCallback() {
        // bind events here
        this.__textInput.addEventListener('keydown', this.__onChangeCallback)
        this.__textInput.addEventListener('keyup', this.__onChangeCallback)
        // this.__textInput.addEventListener('input', this.__onChangeCallback)
        this.__textInput.addEventListener('paste', this.__onChangeCallback)
        this.addEventListener('click', this.__triggerFocusCallback)
        this.__textInput.addEventListener('focus', this.__onFocusCallback)
        this.__textInput.addEventListener('blur', this.__onBlurCallback)

        if (this.hasAttribute('text')) {
            this.__textState.value = this.getAttribute('text')
            this.__textInput.value = this.__textState.appliedValue
        }
    }

    static get observedAttributes() {
        return ['value']
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.__textState.value = newValue
    }

    disconnectedCallback() {
        if (this.__onChange !== null) {
            this.__textInput.removeEventListener('keydown', this.onChangeCallback)
            this.__textInput.removeEventListener('keyup', this.onChangeCallback)
            // this.__textInput.removeEventListener('input', this.onChangeCallback)
            this.__textInput.removeEventListener('paste', this.onChangeCallback)
            this.removeEventListener('click', this.triggerFocusCallback)
            this.__textInput.removeEventListener('focus', this.onFocusCallback)
            this.__textInput.removeEventListener('blur', this.onBlurCallback)
        }
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

export { TextFieldView }
