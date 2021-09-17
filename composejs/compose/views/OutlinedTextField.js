import { TextFieldView } from './reusable/TextFieldView.js'
import { Modifier } from "../modifier.js"
import { WebComponent } from "../WebComponent.js"
import { MaterialTheme } from "../theme.js"
import { colorOf } from "../color.js"
import { onSystemThemeChange } from "../ext.js"

class ComposeOutlinedTextField extends TextFieldView {
    constructor({
        value=null,
        onValueChange=null, 
        label=null,
        isError=false, 
        leadingIcon=null,
        trailingIcon=null,
        singleLine=false,
        disabled=false,
        scope=null,
        color=null,
    }={}) {
        super({
            value: value,
            onValueChange: onValueChange,
            label: label,
            isError: isError,
            leadingIcon: leadingIcon,
            trailingIcon: trailingIcon,
            singleLine: singleLine,
            disabled: disabled,
            style: `
            :host {
                border-radius: 4px;
                margin-top: 8px;
            }
            ${ label ? `
            #compose-text-input:focus, #compose-text-input.has-value {
                bottom: 0;
            }
            #compose-text-input:focus ~ .label, #compose-text-input.has-value ~ .label {
                font-size: 12px;
                top: -8px;
                left: -4px;
                padding: 0 4px;
                transform: translateY(0);
            }
            ` : '' }
            `,
            scope: scope,
        })

        this.color = color
    }

    onFocusCallback(e) {
        this.style.boxShadow = "0 0 0 2px " + (this.color || MaterialTheme.colors.secondary)
        this.__labelView.style.color = this.color || MaterialTheme.colors.secondary
    }

    onBlurCallback(e) {
        this.style.boxShadow = "0 0 0 1px " + colorOf(MaterialTheme.colors.onSurface).copy(0.4)
        this.__labelView.style.color = colorOf(MaterialTheme.colors.onSurface).copy(0.5)
    }
}



function OutlinedTextField({
    value=null, 
    onValueChange=null, 
    label=null, 
    modifier=Modifier(),
    isError=false, 
    singleLine=false, 
    leadingIcon=null,
    trailingIcon=null,
    disabled=false,
    color=null,
}={}, scope) {
    if (!WebComponent.wasRegistered("compose-outlined-text-field")) {
        window.customElements.define('compose-outlined-text-field', ComposeOutlinedTextField)
    }
    let doc = new ComposeOutlinedTextField({ 
        value: value, 
        onValueChange: onValueChange, 
        label: label, 
        isError: isError,
        singleLine: singleLine, 
        leadingIcon: leadingIcon,
        trailingIcon: trailingIcon,
        disabled: disabled,
        modifier: modifier,
        color: color,
        scope: scope,
    })

    onSystemThemeChange(e => {
        if (modifier.value.color === undefined) {
            doc.style.color = MaterialTheme.colors.onSurface
        }
        if (modifier.value.border === undefined) {
            doc.style.boxShadow = "0 0 0 1px " + colorOf(MaterialTheme.colors.onSurface).copy(0.4)
            doc.__labelView.style.backgroundColor = MaterialTheme.colors.surface
        }
        
        Modifier().color(colorOf(MaterialTheme.colors.onSurface).copy(0.5)).$apply(doc.__labelView)
    })

    modifier.$apply(doc)

    if (scope === undefined) {
        console.error("OutlinedTextField must be used with a parent scope")
        return
    }
    scope.addChild(doc)
}


export { OutlinedTextField }


