import { View } from './reusable/View.js'
import { Modifier } from "../modifier.js"
import { WebComponent } from "../WebComponent.js"
import { MaterialTheme } from "../theme.js"
import { onSystemThemeChange, addRippleEffect } from "../ext.js"
import { Scope } from "../scope.js"


class ComposeFloatingActionButton extends View {
    constructor({icon=null, isMiniFab=false, onClick=null}={}) {
        super()

        this.__onClick = onClick

        this.apply({
            style: `
            :host {
                width: ${ isMiniFab ? '40px' : '56px' };
                height: ${ isMiniFab ? '40px' : '56px' };
                padding: ${ isMiniFab ? '8px' : '16px' };
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                box-shadow: 0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%), 0 1px 5px 0 rgb(0 0 0 / 20%);
                overflow: hidden;
                z-index: 999;
            }
            `,
            html: ``
        })

        if (typeof icon === "function") {
            new Scope(this, icon).compose()
        }

        this.hammer = new Hammer(this)
        this.__onClickCallback = this.onClickCallback.bind(this)
    }

    connectedCallback() {
        // bind events here
        this.hammer.on('tap', this.__onClickCallback)
    }

    disconnectedCallback() {
        // this.incrementBtn.removeEventListener('click', this.increment);
        this.hammer.off('tap')
    }

    onClickCallback(e) {
        addRippleEffect(this, e)
        if (this.__onClick !== null) {
            this.__onClick(e)
        }
    }
}


function FloatingActionButton({icon=null, isMiniFab=false, onClick=null, modifier=Modifier()}={}, scope) {
    if (!WebComponent.wasRegistered("compose-floating-action-button")) {
        window.customElements.define('compose-floating-action-button', ComposeFloatingActionButton)
    }
    let doc = new ComposeFloatingActionButton({icon, isMiniFab, onClick})
    onSystemThemeChange(e => {
        doc.style.backgroundColor = MaterialTheme.colors.secondary
    })

    modifier.$apply(doc)

    if (scope === undefined) {
        console.error("FloatingActionButton must be used with a parent scope")
        return
    }
    scope.addChild(doc)
}

export { FloatingActionButton }
