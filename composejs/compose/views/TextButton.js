import { ButtonView } from './reusable/ButtonView.js';
import { Modifier } from "../modifier.js"
import { WebComponent } from "../WebComponent.js"
import { MaterialTheme } from "../theme.js"

class ComposeTextButton extends ButtonView {
    constructor({content=null, onClick=null, disabled=false, color=null}={}) {
        super({
            content: content, 
            onClick: onClick, 
            disabled: disabled,
            contentColor: disabled ? "#ccc" : color || MaterialTheme.colors.secondary
        })
    }
}



function TextButton({content=null, onClick=null, disabled=false, modifier=Modifier(), color=null}={}, scope) {
    if (!WebComponent.wasRegistered("compose-text-button")) {
        window.customElements.define('compose-text-button', ComposeTextButton)
    }
    let doc = new ComposeTextButton({ content: content, onClick: onClick, disabled: disabled, color: color });
    Modifier().style(MaterialTheme.typography.button).$apply(doc)
    modifier.$apply(doc)

    if (scope === undefined) {
        console.error("TextButton must be used with a parent scope");
        return
    }
    scope.children.push(doc)
}

export { TextButton }
