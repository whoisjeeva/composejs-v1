import { State } from './state.js'
import { MaterialTheme } from './theme.js';

function onStateValueChange(owner, state, callback) {
    if (state instanceof State) {
        state.observe(owner, v => {
            callback(v)
        })
    }
}

function onSystemThemeChange(callback) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', callback);
    callback()
}

function addRippleEffect(el, evt) {
    if (el.getAttribute('disabled') || el.getAttribute('readonly') || el.getAttribute('no-ripple') === "1") {
        return
    }
    let rect = el.getBoundingClientRect()
    let x = evt.center.x - rect.left
    let y = evt.center.y - rect.top
    let ripple = document.createElement('span')
    ripple.classList.add('ripple')
    ripple.style.left = x + 'px'
    ripple.style.top = y + 'px'
    el.shadowRoot.appendChild(ripple)
    css(ripple, {
        position: 'absolute',
        backgroundColor: MaterialTheme.isDarkMode ? '#fff' : '#000',
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        pointerEvents: 'none',
    })

    let maxSize = Math.max(el.offsetHeight, el.offsetWidth) * 2

    ripple.animate([
        { opacity: 0.3, height: 0, width: 0 },
        { opacity: 0, height: maxSize + 'px', width: maxSize + 'px' }
    ], {
        duration: 600,
        easing: 'ease-out',
        iterations: 1
    })

    setTimeout(() => ripple.remove(), 600)
}

async function sleep(milliseconds) {
    return await new Promise(resolve => setTimeout(resolve, milliseconds))
}

function css(els, style) {
    if (els === undefined || els === null || style === undefined || style === null) return
    if (els.forEach) {
        els.forEach(el => {
            if (el) {
                let keys = Object.keys(style)
                keys.forEach(key => {
                    if (typeof style[key] === "number") {
                        el.style[key] = style[key] + "px"
                    } else {
                        el.style[key] = style[key]
                    }
                })
            }
        })
    } else {
        let keys = Object.keys(style)
        keys.forEach(key => {
            if (typeof style[key] === "number") {
                els.style[key] = style[key] + "px"
            } else {
                els.style[key] = style[key]
            }
        })
    }
}


export { onStateValueChange, onSystemThemeChange, addRippleEffect, sleep, css }

