import { TextFieldView } from './reusable/TextFieldView.js';
import { Modifier } from "../modifier.js"
import { WebComponent } from "../WebComponent.js"
import { MaterialTheme } from "../theme.js"
import { colorOf } from "../color.js"
import { onSystemThemeChange, css } from "../ext.js"

class ComposeTextField extends TextFieldView {
    
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
            `,
            scope: scope
        })

        this.color = color
    }

    onFocusCallback(e) {
        css(this.__labelView, {
            color: this.color || colorOf(MaterialTheme.colors.secondary).copy(1)
        })
        this.style.boxShadow = "0 2px 0 0 " + (this.color || MaterialTheme.colors.secondary)
        this.style.backgroundColor = colorOf(MaterialTheme.colors.onSurface).copy(0.15)
    }

    onBlurCallback(e) {
        css(this.__labelView, {
            color: colorOf(MaterialTheme.colors.onSurface).copy(0.5)
        })
        this.style.boxShadow = "0 1px 0 0 " + MaterialTheme.colors.onSurface
        this.style.backgroundColor = colorOf(MaterialTheme.colors.onSurface).copy(0.1)
        if (!this.value) {
            this.__textInput.classList.remove("has-value")
        } else {
            this.__textInput.classList.add("has-value")
        }
    }
}



function TextField({
    value=null, 
    onValueChange=null, 
    label=null, 
    modifier=Modifier(),
    isError=false, 
    singleLine=false, 
    leadingIcon=null,
    trailingIcon=null,
    color=null,
    disabled=false,
}={}, scope) {
    if (!WebComponent.wasRegistered("compose-text-field")) {
        window.customElements.define('compose-text-field', ComposeTextField)
    }
    let doc = new ComposeTextField({ 
        value: value, 
        onValueChange: onValueChange, 
        label: label, 
        isError: isError,
        singleLine: singleLine, 
        leadingIcon: leadingIcon,
        trailingIcon: trailingIcon,
        disabled: disabled,
        scope: scope,
        color: color
    })

    onSystemThemeChange(e => {
        if (modifier.value.color === undefined) {
            doc.style.color = MaterialTheme.colors.onSurface
        }
        doc.style.backgroundColor = colorOf(MaterialTheme.colors.onSurface).copy(0.1)
        doc.style.boxShadow = "0 1px 0 0 " + MaterialTheme.colors.onSurface
        Modifier().color(colorOf(MaterialTheme.colors.onSurface).copy(0.5)).$apply(doc.__labelView)
    })

    modifier.$apply(doc)

    if (scope === undefined) {
        console.error("TextField must be used with a parent scope")
        return
    }
    scope.children.push(doc)
}

export { TextField }
