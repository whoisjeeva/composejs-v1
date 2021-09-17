import { View } from './reusable/View.js'
import { Modifier } from "../modifier.js"
import { WebComponent } from "../WebComponent.js"
import { MaterialTheme } from "../theme.js"
import { Scope } from "../scope.js"

class ComposeColumn extends View {
    constructor({content=null}={}) {
        super()
        
        this.apply({
            style: `
            :host {
                flex-direction: column;
                align-items: flex-start;
                flex-wrap: wrap;
            }
            `
        })

        if (typeof content === "function") {
            new Scope(this, content).compose()
        }
    }
}


function Column({content=null, modifier=Modifier()}={}, scope) {
    if (!WebComponent.wasRegistered("compose-column")) {
        window.customElements.define('compose-column', ComposeColumn)
    }
    let doc = new ComposeColumn({ content: content })
    Modifier().style(MaterialTheme.typography.body1).$apply(doc)
    modifier.$apply(doc);

    if (scope === undefined) {
        console.error("Text must be used with a parent scope");
        return
    }
    scope.children.push(doc)
}


export { Column }
