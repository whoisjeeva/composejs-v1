import { Modifier } from "../modifier.js"
import { WebComponent } from "../WebComponent.js"
import { View } from "./reusable/View.js"


class ComposeSpacer extends View {
    constructor() {
        super()
        
        this.apply({
            style: `
            :host {
                width: 100%;
                height: 100%;
            }
            `,
            html: ``
        })
    }
}


function Spacer({modifier=Modifier(), height=null, width=null}={}, scope) {
    if (!WebComponent.wasRegistered("compose-spacer")) {
        window.customElements.define('compose-spacer', ComposeSpacer)
    }
    let doc = new ComposeSpacer()

    if (height) Modifier().height(height).$apply(doc)
    if (width) Modifier().width(width).$apply(doc)
    
    modifier.$apply(doc)

    if (scope === undefined) {
        console.error("Spacer must be used with a parent scope");
        return
    }
    scope.addChild(doc)
}


export { Spacer }