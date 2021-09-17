import { View } from './reusable/View.js'
import { Modifier } from "../modifier.js"
import { WebComponent } from "../WebComponent.js"
import { MaterialTheme } from "../theme.js"
import { onSystemThemeChange } from "../ext.js"
import { colorOf } from "../color.js"

class ComposeDivider extends View {
    constructor() {
        super()
        
        this.apply({
            style: `
            :host {
                display: block;
                width: 100%;
                height: 0.5px;
            }
            `
        })
    }
}


function Divider({modifier=Modifier()}={}, scope) {
    if (!WebComponent.wasRegistered("compose-divider")) {
        window.customElements.define('compose-divider', ComposeDivider)
    }
    let doc = new ComposeDivider()
    onSystemThemeChange(e => {
        Modifier().background(colorOf(MaterialTheme.colors.onSurface).copy(0.5)).$apply(doc)
    })
    
    if (arguments.length === 0) {
        console.error("Divider must be used with a parent scope");
        return
    }

    if (arguments.length === 1) {
        arguments[0].children.push(doc)
    } else {
        modifier.$apply(doc)
        if (scope === undefined) {
            console.error("Divider must be used with a parent scope");
            return
        }
        scope.children.push(doc)
    }
}

export { Divider }