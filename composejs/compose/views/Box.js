import { View } from './reusable/View.js'
import { Modifier } from "../modifier.js"
import { WebComponent } from "../WebComponent.js"
import { Scope } from "../scope.js"

class ComposeBox extends View {
    constructor({content=null}={}) {
        super()

        this.apply({ 
            style: `
            :host {
                align-items: flex-start;
                flex-wrap: wrap;
            }

            :host > * {
                position: absolute;
            }
            `
        })

        if (typeof content === "function") {
            new Scope(this, content).compose()
        }
    }
}


function Box({content=null, modifier=Modifier()}={}, scope) {
    if (!WebComponent.wasRegistered("compose-box")) {
        window.customElements.define('compose-box', ComposeBox)
    }

    let doc = new ComposeBox({ content: content })
    modifier.$apply(doc)

    if (scope === undefined) {
        console.error("Box must be used with a parent scope");
        return
    }
    scope.children.push(doc)
}


export { Box }
