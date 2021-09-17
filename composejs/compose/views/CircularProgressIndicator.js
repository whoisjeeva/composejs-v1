import { Modifier } from "../modifier.js"
import { WebComponent } from "../WebComponent.js"
import { MaterialTheme } from "../theme.js"
import { stateOf$1 } from "../state.js"
import { onSystemThemeChange, onStateValueChange } from "../ext.js"
import { View } from "./reusable/View.js"

class ComposeCircularProgressIndicator extends View {
    constructor({ progress=null, width=10 }) {
        super()

		if (progress && progress > 100) {
			progress = 100
		}

        this.progress = stateOf$1(progress)
        this.width = stateOf$1(width)
        
        this.apply({
            style: `
            :host {
                height: 30px;
                width: 30px;
            }
            .container {
                width: inherit;
                height: inherit;
            }

              ${ this.progress.appliedValue ? `
              .spinner {
                transform: rotate(-90deg);
              }
              ` : `
              .spinner {
                -webkit-animation: rotator 1.4s linear infinite;
                        animation: rotator 1.4s linear infinite;
              }
              
              @-webkit-keyframes rotator {
                0% {
                  transform: rotate(0deg);
                }
                100% {
                  transform: rotate(270deg);
                }
              }
              
              @keyframes rotator {
                0% {
                  transform: rotate(0deg);
                }
                100% {
                  transform: rotate(270deg);
                }
              }
              ` }

              
              .path {
                stroke-dasharray: 187;
                transform-origin: center;
                stroke: ${MaterialTheme.colors.primary};

                ${ this.progress.appliedValue ? `
                stroke-dashoffset: calc(187 - (187 * ${this.progress.appliedValue}) / 100);
                ` : `
                stroke-dashoffset: 0;
                animation: dash 1.4s ease-in-out infinite;
                /* , colors 5.6s ease-in-out infinite */
                ` }
              }
              
              /*
              @keyframes colors {
                0% { stroke: #4285F4; }
                25% { stroke: #DE3E35; }
                50% { stroke: #F7C223; }
                75% { stroke: #1B9A59; }
                100% { stroke: #4285F4; }
              }
              */
              @keyframes dash {
                0% { stroke-dashoffset: 187; }
                50% { stroke-dashoffset: 46.75; transform: rotate(135deg); }
                100% { stroke-dashoffset: 187; transform: rotate(450deg); }
              }
            `,
            html: `
            <div class="container">
                <svg class="spinner" width="100%" height="100%" viewBox="0 0 ${60+this.width.appliedValue} ${60+this.width.appliedValue}" xmlns="http://www.w3.org/2000/svg">
                    <circle class="path" fill="none" stroke-width="${this.width.appliedValue}" stroke-linecap="round" cx="${this.width.appliedValue/2+30}" cy="${this.width.appliedValue/2+30}" r="30"></circle>
                </svg>
            </div>
            `
        })
        // calc(187 - (187 * 100) / 100)

        this.container = this.shadowRoot.querySelector(".container")

		if (this.progress.appliedValue && this.progress.appliedValue <= 0) {
			this.container.style.visibility = "hidden"
		} else {
			this.container.style.visibility = "visible"
		}
        
        onStateValueChange(this, this.progress, this.recompose.bind(this))
        onStateValueChange(this, this.width, this.recompose.bind(this))
    }

    recompose(v) {
		// let width = this.width.appliedValue
		// let progress = this.progress.appliedValue

		// if (progress > 100) {
		// 	progress = 100
		// }
		// this.container.innerHTML = `
        // <svg class="spinner" width="100%" height="100%" viewBox="0 0 ${60+width} ${60+width}" xmlns="http://www.w3.org/2000/svg">
        //     <circle class="path" fill="none" stroke-width="${width}" stroke-linecap="round" cx="${width/2+30}" cy="${width/2+30}" r="30"></circle>
        // </svg>
        // `

		// if (progress <= 0) {
		// 	this.container.style.visibility = "hidden"
		// } else {
		// 	this.container.style.visibility = "visible"
		// }
        // let path = this.shadowRoot.querySelector(".path")
        // path.style["stroke-dashoffset"] = `calc(187 - (187 * ${progress}) / 100)`
		let newEl = new ComposeCircularProgressIndicator({ progress: this.progress, width: this.width })
		this.shadowRoot.innerHTML = newEl.shadowRoot.innerHTML
	}
}


function CircularProgressIndicator({progress=null, width=10, modifier=Modifier()}={}, scope) {
    if (!WebComponent.wasRegistered("compose-circular-progress-indicator")) {
        window.customElements.define('compose-circular-progress-indicator', ComposeCircularProgressIndicator)
    }
    let doc = new ComposeCircularProgressIndicator({ progress, width })
    modifier.$apply(doc)

    if (scope === undefined) {
        console.error("CircularProgressIndicator must be used with a parent scope");
        return
    }
    scope.children.push(doc)
}

export { CircularProgressIndicator }
