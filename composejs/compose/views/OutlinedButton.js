import { ButtonView } from './reusable/ButtonView.js'
import { Modifier } from "../modifier.js"
import { WebComponent } from "../WebComponent.js"
import { MaterialTheme } from "../theme.js"
import { colorOf } from "../color.js"

class ComposeOutlinedButton extends ButtonView {
    constructor({content=null, onClick=null, disabled=false, color=null}={}) {
        let btnColor = disabled ? "#ccc" : color || MaterialTheme.colors.secondary
        super({
            content: content, 
            onClick: onClick, 
            disabled: disabled,
            baseStyle: `
            border: 2px solid ${ btnColor };
            `,
            enabledStyle: `
            `,
            enabledHoverStyle: `
            background-color: ${ colorOf("#ccc").copy(0.1) };
            `,
            contentColor: btnColor
        })
    }
}



function OutlinedButton({content=null, onClick=null, disabled=false, modifier=Modifier(), color=null}={}, scope) {
    if (!WebComponent.wasRegistered("compose-outlined-button")) {
        window.customElements.define('compose-outlined-button', ComposeOutlinedButton)
    }
    let doc = new ComposeOutlinedButton({ content: content, onClick: onClick, disabled: disabled, color: color });
   
    Modifier().style(MaterialTheme.typography.button).$apply(doc)
    modifier.$apply(doc);

    if (scope === undefined) {
        console.error("OutlinedButton must be used with a parent scope");
        return
    }
    scope.children.push(doc)
}

export { OutlinedButton }
