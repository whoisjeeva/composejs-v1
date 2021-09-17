class Color {
    
    constructor(s) {
        this.rgb = null
        if (s.startsWith("#")) {
            if (s.length == 4) {
                s = s.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => "#" + r + r + g + g + b + b)
            }
            this.rgb = this.toRGB(s)
        } else if (s.startsWith("rgb(")) {
            let nums = s.replace("rgb", "").replace(")", "").split(",").map(x => parseInt(x))
            this.rgb = {r: nums[0], g: nums[1], b: nums[2]}
        }
    }

    componentToHex(c) {
        let hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    toHex(r, g, b) {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }
    
    toRGB(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    copy(alpha) {
        return this.valueOf(alpha)
    }

    rgba(alpha) {
        let rgb = this.rgb
        return {r: rgb.r, g: rgb.g, b: rgb.b, a: alpha || 1}
    }

    valueOf(alpha) {
        if (this.rgb !== null) {
            return `rgba(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b}, ${alpha || 1})`
        }
        return ""
    }
}

function colorOf(color) {
    return new Color(color)
}

function rgbaOf(color, alpha) {
    return colorOf(color).rgba(alpha)
}


const Black = "#000000"
const White = "#000000"
const Red = "#ff0000"
const Green = "#00ff00"
const Blue = "#0000ff"
const Yellow = "#ffff00"
const Orange = "#ffa500"
const LightOrange = "#ffd699"
const LightRed = "#ffb2b2"
const LightGreen = "#b2ffb2"
const LightBlue = "#b2b2ff"


export { 
    Color,
    colorOf,
    rgbaOf,

    Black,
    White,
    Red,
    Green,
    Blue,
    Yellow,
    Orange,
    LightOrange,
    LightRed,
    LightGreen,
    LightBlue
}

