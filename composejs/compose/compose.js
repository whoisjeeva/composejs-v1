import { onSystemThemeChange, css } from "./ext.js"
import { MaterialTheme } from "./theme.js"
import { setStatusBarColor } from "./native.js"
import { rgbaOf } from "./color.js"
import { Scope } from "./scope.js"
import { Modifier } from "./modifier.js"


class Compose {
    constructor(selector) {
        Object.defineProperty(window, "Modifier", {
            get: () => Modifier()
        })

        console.log("%c Welcome to compose.js :) Happy coding. :D", "color: yellow;")

        if (document.querySelector("[data-boil-style]") == null) {
            let css = `
            body {
                padding: 0;
                margin: 0;
                font-family: "Roboto", "Open Sans", sans-serif;
                max-width: 100%;
                max-height: 100%;
            }

            * { 
                box-sizing: border-box; 
                outline: none;
                -webkit-tap-highlight-color: transparent;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                 -khtml-user-select: none;
                   -moz-user-select: none;
                    -ms-user-select: none;
                        user-select: none;
            }

            /* fallback */
            @font-face {
                font-family: 'Material Icons';
                font-style: normal;
                font-weight: 400;
                src: url(font/materil-icons.woff2) format('woff2');
            }

            .selectable {
                user-select: text;
            }
              
            .material-icons {
                transition: all 0.2s ease-in-out;
            }
            `
            let head = document.head || document.getElementsByTagName('head')[0]
            let style = document.createElement('style')

            head.appendChild(style)

            style.setAttribute("type", "text/css")
            style.setAttribute("data-boil-style", "true")
            if (style.styleSheet){
                style.styleSheet.cssText = css
            } else {
                style.appendChild(document.createTextNode(css))
            }
        }
        
        if (typeof selector === "string") {
            this.el = document.querySelector(selector)
        } else {
            this.el = selector
        }
        this.el.style.display = "flex"
    }

    async mount(content) { 
        onSystemThemeChange(e => {
            document.body.style.backgroundColor = MaterialTheme.colors.surface
            this.el.style.backgroundColor = MaterialTheme.colors.surface
            this.el.style.color = MaterialTheme.colors.onSurface
            setStatusBarColor(rgbaOf(MaterialTheme.colors.primary, 1), !MaterialTheme.isDarkMode)
        })
        
        
        css(this.el, {
            width: "100vw",
            height: "100vh",
            maxWidth: "100%",
            maxHeight: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
        })

        new Scope(this.el, content).compose()
    }
}

// root.Compose = Compose




export { Compose }
