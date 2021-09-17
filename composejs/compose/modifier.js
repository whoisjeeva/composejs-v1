import { State } from './state.js'
import { onStateValueChange, addRippleEffect, css } from './ext.js'


class ComposeModifier {
    constructor() {
        this.el = null
        this.value = {}
    }


    $apply(el) {
        this.el = el
        let modKeys = Object.keys(this.value);
        for (let key of modKeys) {
            if (this.value[key] instanceof State && !key.startsWith("__")) {
                this.__apply_style(el, key, this.value[key].value)
                onStateValueChange(el, this.value[key], v => {
                    if (v) {
                        if (typeof this.value[key] === "string") {
                            el.style[key] = this.value[key]
                        } else {
                            this.__apply_style(el, key, v)
                        }
                    }
                })
            } else if (key === "clickable") {
                let that = this
                new Hammer(el).on("tap", function(e) {
                    addRippleEffect(el, e)
                    that.value[key].call(this, e)
                }, false)
            } else if (key === "noripple") {
                this.el.setAttribute("no-ripple", "1")
            } else {
                this.__apply_style(el, key, this.value[key])
            }
        }
    }

    __apply_style(element, key, value) {
        if (value) {
            if (typeof value === "string") {
                element.style[key] = value
            } else if (typeof value === "number") {
                element.style[key] = value + "px"
            } else {
                css(element, value)
            }
        }
    }

    noRipple() {
        this.value["noripple"] = "1"
        return this
    }

    fillMaxWidth() {
        this.value.width = "100%"
        return this
    }
    fillMaxHeight() {
        this.value.height = "100%"
        return this
    }
    fillMaxSize() {
        this.fillMaxWidth()
        this.fillMaxHeight()
        return this
    }

    fillScreenWidth() {
        this.value.width = "100vw"
        this.value.maxWidth = "100%"
        return this
    }
    fillScreenHeight() {
        this.value.height = "100vh"
        this.value.maxHeight = "100%"
        return this
    }
    fillScreenSize() {
        this.fillScreenWidth()
        this.fillScreenHeight()
        return this
    }

    visibility(value) {
        this.value.visibility = value
        return this
    }

    display(value) {
        this.value.display = value
        return this
    }

    padding({top=null,bottom=null,start=null,end=null, all=null}={}) {
        if (all) this.value.padding = all
        if (top) this.value.paddingTop = top
        if (bottom) this.value.paddingBottom = bottom
        if (start) this.value.paddingLeft = start
        if (end) this.value.paddingRight = end
        return this
    }

    height(value) {
        this.value.height = value
        return this
    }

    width(value) {
        this.value.width = value
        return this
    }

    size(width, height) {
        this.width(width)
        this.height(height)
        return this
    }
    
    scale(value) {
        this.value.scale = value
        return this
    }

    background(value) {
        this.value.backgroundColor = value
        return this
    }

    fontSize(value) {
        this.value.fontSize = value
        return this
    }
    
    fontWeight(value) {
        this.value.fontWeight = value
        return this
    }

    clickable(callback) {
        this.value.cursor = "pointer"
        this.value.overflow = "hidden"
        this.value.clickable = callback
        return this
    }

    weight(value) {
        this.value.flexGrow = value
        return this
    }

    align(value) {
        this.value.alignItems = value
        return this
    }

    alignSelf(value) {
        this.value.alignSelf = value
        return this
    }

    justifySelf(value) {
        this.value.justifySelf = value
        return this
    }

    basis(value) {
        this.value.flexBasis = value
        return this
    }

    justifyContent(value) {
        this.value.justifyContent = value
        return this
    }

    color(value) {
        this.value.color = value
        return this
    }

    selectable() {
        this.value.userSelect = "text"
        return this
    }

    radius(value) {
        this.value.borderRadius = value
        return this
    }

    margin({top=null,bottom=null,start=null,end=null, all=null}={}) {
        if (all) this.value.margin = all
        if (top) this.value.marginTop = top
        if (bottom) this.value.marginBottom = bottom
        if (start) this.value.marginLeft = start
        if (end) this.value.marginRight = end
        return this
    }

    textAlign(value) {
        this.value.textAlign = value
        return this
    }

    maxWidth(value) {
        this.value.maxWidth = value
        return this
    }

    maxHeight(value) {
        this.value.maxHeight = value
        return this
    }

    style(value) {
        this.value.style = value
        return this
    }

    transform(value) {
        this.value.transform = value
        return this
    }

    position(value) {
        this.value.position = value
        return this
    }

    overflow(value) {
        this.value.overflow = value
        return this
    }

    verticalScrollable() {
        this.value.overflowY = "scroll"
        this.value.overflowX = "hidden"
        return this
    }

    horizontalScrollable(value) {
        this.value.overflowX = "scroll"
        this.value.overflowY = "hidden"
        return this
    }

    top(value) {
        this.value.top = value
        return this
    }
    

    bottom(value) {
        this.value.bottom = value
        return this
    }

    left(value) {
        this.value.left = value
        return this
    }

    right(value) {
        this.value.right = value
        return this
    }

    allCaps() {
        this.value.textTransform = "uppercase"
        return this
    }

    static get get() {
        return new Modifier()
    }
}


function Modifier() {
    return new ComposeModifier()
}


export { Modifier }

