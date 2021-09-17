import { ButtonView } from './reusable/ButtonView.js'
import { Modifier } from "../modifier.js"
import { WebComponent } from "../WebComponent.js"
import { MaterialTheme } from "../theme.js"
import { onSystemThemeChange } from "../ext.js"

class ComposeButton extends ButtonView {
    constructor({content=null, onClick=null, disabled=false}={}) {
        super({
            content: content, 
            onClick: onClick, 
            disabled: disabled,
            baseStyle: ``,
            enabledStyle: `
            box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
            `,
            enabledHoverStyle: `
            box-shadow: 0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%);
            `
        })
    }
}



function Button({content=null, onClick=null, disabled=false, modifier=Modifier(), color=null}={}, scope) {
    if (!WebComponent.wasRegistered("compose-button")) {
        window.customElements.define('compose-button', ComposeButton)
    }
    let doc = new ComposeButton({ content: content, onClick: onClick, disabled: disabled })
    onSystemThemeChange(e => {
        if (modifier.value.color === undefined && !disabled) {
            doc.style.backgroundColor = color || MaterialTheme.colors.secondary
        } else if (disabled) {
            doc.style.backgroundColor = colorOf("#ccc").copy(0.5)
        }
    })
    Modifier().style(MaterialTheme.typography.button).$apply(doc)
    modifier.$apply(doc);

    if (scope === undefined) {
        console.error("Button must be used with a parent scope");
        return
    }
    scope.addChild(doc)
}


export { Button }