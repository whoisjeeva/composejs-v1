import { Modifier } from "../modifier.js"
import { $ } from "../dom.js"
import { Scope } from "../scope.js"


function Card({ content=null, modifier=Modifier(), borderRadius="4px", background="white", color=null }, scope) {
    let card = document.createElement("div")
    $(card).css({
        padding: "16px",
        borderRadius: borderRadius,
        boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
        backgroundColor: background,
        color: color || "black"
    })
    .attr("data-view-name", "compose-card")

    if (typeof content === "function") {
        let contentScope = new Scope(card, content).compose()
        for (let child of contentScope.children) {
            child.style.width = "100%"
        }
    }

    modifier.$apply(card)

    scope.addChild(card)
}


export { Card }
