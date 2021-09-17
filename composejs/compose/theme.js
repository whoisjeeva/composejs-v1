class Theme {
    static get isDarkMode() {
        if (window.Android) {
            return JSON.parse(window.Android.isDarkMode())["data"]
        } else {
            return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        }
    }   
}

class Typography {
    static get h1() {
        return {
            fontSize: "81px",
            weight: "normal",
            letterSpacing: "-1.5px",
            fontFamily: "Roboto, 'Open Sans', sans-serif",
        }
    }

    static get h2() {
        return {
            fontSize: "50px",
            weight: "normal",
            letterSpacing: "-0.5px",
            fontFamily: "Roboto, 'Open Sans', sans-serif",
        }
    }

    static get h3() {
        return {
            fontSize: "40px",
            weight: "normal",
            letterSpacing: "0px",
            fontFamily: "Roboto, 'Open Sans', sans-serif",
        }
    }

    static get h4() {
        return {
            fontSize: "29px",
            weight: "normal",
            letterSpacing: "0.25px",
            fontFamily: "Roboto, 'Open Sans', sans-serif",
        }
    }

    static get h5() {
        return {
            fontSize: "20px",
            weight: "normal",
            letterSpacing: "0px",
            fontFamily: "Roboto, 'Open Sans', sans-serif",
        }
    }

    static get h6() {
        return {
            fontSize: "17px",
            weight: "normal",
            letterSpacing: "0.15px",
            fontFamily: "Roboto, 'Open Sans', sans-serif",
        }
    }

    static get subtitle1() {
        return {
            fontSize: "16px",
            weight: "normal",
            letterSpacing: "0.15px",
            fontFamily: "Roboto, 'Open Sans', sans-serif",
        }
    }

    static get subtitle2() {
        return {
            fontSize: "14px",
            weight: "normal",
            letterSpacing: "0.1px",
            fontFamily: "Roboto, 'Open Sans', sans-serif",
        }
    }

    static get body1() {
        return {
            fontSize: "14px",
            weight: "normal",
            letterSpacing: "0.5px",
            fontFamily: "Roboto, 'Open Sans', sans-serif",
        }
    }

    static get body2() {
        return {
            fontSize: "14px",
            weight: "normal",
            letterSpacing: "0.25px",
            fontFamily: "Roboto, 'Open Sans', sans-serif",
        }
    }

    static get button() {
        return {
            fontSize: "14px",
            weight: "normal",
            letterSpacing: "1.25px",
            fontFamily: "Roboto, 'Open Sans', sans-serif",
        }
    }

    static get caption() {
        return {
            fontSize: "12px",
            weight: "normal",
            letterSpacing: "0.4px",
            fontFamily: "Roboto, 'Open Sans', sans-serif",
        }
    }

    static get overline() {
        return {
            fontSize: "12px",
            weight: "normal",
            letterSpacing: "1.5px",
            fontFamily: "Roboto, 'Open Sans', sans-serif",
        }
    }
}


const __primary_dark = "#303F9F"
const __primary_light = "#7986CB"
const __secondary_dark = "#009688"
const __secondary_light = "#4DB6AC"
const __onSurface_dark = "#FFFFFF"
const __onSurface_light = "#212121"
const __surface_dark = "#212121"
const __surface_light = "#FFFFFF"

class Colors {
    static get primary() {
        return Theme.isDarkMode ? __primary_dark : __primary_light 
    }

    static get secondary() { 
        return Theme.isDarkMode ? __secondary_dark : __secondary_light 
    }

    static get onSurface() {
        return Theme.isDarkMode ? __onSurface_dark : __onSurface_light
    }

    static get surface() {
        return Theme.isDarkMode ? __surface_dark : __surface_light
    }
}


class MaterialTheme {
    static get colors() {
        return Colors
    }
    static get typography() {
        return Typography 
    } 
    static get isDarkMode() {
        return Theme.isDarkMode
    }
}



export {
    MaterialTheme,
    Colors,
    Typography
}


