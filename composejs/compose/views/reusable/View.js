class View extends HTMLElement {
    constructor() {
        super()
    }

    apply({style=null, html=null}={}) {
        this.attachShadow({ mode: 'open' })
        let template = document.createElement('template')
        template.innerHTML = `
        <style>
            * {
                box-sizing: border-box;
                outline: none;
                user-select: none; 
                
                -webkit-tap-highlight-color: transparent;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                 -khtml-user-select: none;
                   -moz-user-select: none;
                    -ms-user-select: none;
                        user-select: none;
            }
            body {
                padding: 0;
                margin: 0;
                font-family: "Roboto", "Open Sans", sans-serif;
                max-width: 100%;
                max-height: 100%;
                overflow-x: auto;
            }
            :host {
                position: relative;
                display: flex;
                transition: all 0.2s ease-in-out;
                flex-shrink: 0;
            }
            ${ style || '' }
        </style>
        ${html || ''}
        `
        this.shadowRoot.appendChild(template.content.cloneNode(true))
    }


    connectedCallback() {
        // bind events here
    }

    static get observedAttributes() {
        return [];
    }

    attributeChangedCallback(name, oldValue, newValue) {
    }

    disconnectedCallback() {
        // this.incrementBtn.removeEventListener('click', this.increment);
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


export { View }
