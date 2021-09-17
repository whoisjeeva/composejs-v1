import { Modifier } from "../modifier.js"
import { WebComponent } from "../WebComponent.js"
import { MaterialTheme } from "../theme.js"
import { stateOf$1 } from "../state.js"
import { onSystemThemeChange, onStateValueChange } from "../ext.js"
import { View } from "./reusable/View.js"

class ComposeGoogleMap extends View {
    constructor({query=null, latitude=null, longitude=null, zoom=17, scrolling=false, onLoad=null}) {
        super()

        this.query = stateOf$1(query)
        this.latitude = stateOf$1(latitude)
        this.longitude = stateOf$1(longitude)
        this.zoom = stateOf$1(zoom)
        this.scrolling = stateOf$1(scrolling)
        this.onLoad = onLoad
        
        
        this.apply({
            style: `
            iframe {
                width: 100%;
                height: 100%;
            }
            `,
            html: `
            <iframe width="100%" height="100%" id="google-map" src="https://maps.google.com/maps?q=${this.getQuery()}&t=&z=${this.zoom.appliedValue}&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="${this.getScrolling()}" marginheight="0" marginwidth="0"></iframe>
            `
        })

        this.iframe = this.shadowRoot.querySelector("iframe")

        onStateValueChange(this, this.latitude, this.recompose.bind(this))
        onStateValueChange(this, this.longitude, this.recompose.bind(this))
        onStateValueChange(this, this.zoom, this.recompose.bind(this))
        onStateValueChange(this, this.scrolling, this.recompose.bind(this))
        onStateValueChange(this, this.query, this.recompose.bind(this))
    }

    recompose(v) {
        this.iframe.src = `https://maps.google.com/maps?q=${this.getQuery()}&t=&z=${this.zoom.appliedValue}&ie=UTF8&iwloc=&output=embed`
        this.iframe.setAttribute("scrolling", this.getScrolling())
    }

    getScrolling() {
        if (this.scrolling.appliedValue) {
            return "yes"
        }
        return "no"
    }

    getQuery() {
        if (this.query.appliedValue) {
            return this.query.appliedValue
        }

        return this.latitude.appliedValue + "," + this.longitude.appliedValue
    }

    connectedCallback() {
        // bind events here
        this.iframe.addEventListener("load", this.onLoad)
    }

    disconnectedCallback() {
        this.iframe.removeEventListener("load", this.onLoad)
    }
}


function GoogleMap({query=null, latitude=null, longitude=null, zoom=17, scrolling=false, onLoad=null, modifier=Modifier()}={}, scope) {
    if (!WebComponent.wasRegistered("compose-google-map")) {
        window.customElements.define('compose-google-map', ComposeGoogleMap)
    }
    let doc = new ComposeGoogleMap({ query, latitude, longitude, zoom, scrolling, onLoad })
    modifier.$apply(doc)

    if (scope === undefined) {
        console.error("Text must be used with a parent scope");
        return
    }
    scope.children.push(doc)
}

export { GoogleMap }
