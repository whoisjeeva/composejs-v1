import { View } from "./reusable/View.js"
import { WebComponent } from "../WebComponent.js"
import { Modifier } from "../modifier.js"
import { onSystemThemeChange } from "../ext.js"
import { MaterialTheme } from "../theme.js"
import { Scope } from "../scope.js"


class ComposeAppBar extends View {
    constructor({title=null, navigationIcon=null, action=null}={}) {
        super()

        this.apply({
            style: `
            :host {
                height: 56px;
                flex-direction: row;
                align-items: center;
                padding: 0 16px;
                box-shadow: 0px 1px 5px #333;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                z-index: 99;
            }
            #title {
                font-size: 20px;
                flex-grow: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            #navigation-icon {
                display: inline-flex;
                flex-direction: row;
            }
            #action {
                display: inline-flex;
                flex-direction: row;
            }
            `,
            html: `
            <span id="navigation-icon"></span>
            <span id="title"></span>
            <span id="action"></span>
            `
        })

        this.__titleView = this.shadowRoot.querySelector("#title")
        this.__navigationIconView = this.shadowRoot.querySelector("#navigation-icon")
        this.__actionView = this.shadowRoot.querySelector("#action")

        if (typeof navigationIcon === "function") {
            new Scope(this.__navigationIconView, navigationIcon).compose()
        }

        if (typeof action === "function") {
            new Scope(this.__actionView, action).compose()
        }

        if (typeof title === "function") {
            new Scope(this.__titleView, title).compose()
        }
    }
}



function AppBar({title=null, navigationIcon=null, action=null, modifier=Modifier()}={}, scope) {
    if (!WebComponent.wasRegistered("compose-appbar")) {
        window.customElements.define('compose-appbar', ComposeAppBar)
    }
 
    let doc = new ComposeAppBar({title, navigationIcon, action})
    modifier.$apply(doc)
    onSystemThemeChange(e => {
        doc.style.backgroundColor = MaterialTheme.colors.primary
    })

    if (scope === undefined) {
        console.error("AppBar must be used with a parent scope");
        return
    }
    scope.addChild(doc)
}

export { AppBar }
