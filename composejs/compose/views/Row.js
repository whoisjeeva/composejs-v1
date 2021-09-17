import { Modifier } from "../modifier.js"
import { WebComponent } from "../WebComponent.js"
import { MaterialTheme } from "../theme.js"
import { Scope } from "../scope.js"
import { View } from "./reusable/View.js"

class ComposeRow extends View {
    constructor({content=null}={}) {
        super()

        this.apply({
            style: `
            :host {
                flex-direction: row;
                align-items: flex-start;
                flex-wrap: wrap;
            }
            `,
            html: ``
        })

        if (typeof content === "function") {
            new Scope(this, content).compose()
        }
    }
}


function Row({content=null, modifier=Modifier()}={}, scope) {
    if (!WebComponent.wasRegistered("compose-row")) {
        window.customElements.define('compose-row', ComposeRow)
    }
    let doc = new ComposeRow({ content: content })
    
    Modifier().style(MaterialTheme.typography.body1).$apply(doc)
    modifier.$apply(doc)
    
    if (scope === undefined) {
        console.error("Row must be used with a parent scope");
        return
    }
    scope.addChild(doc)
}

export { Row }