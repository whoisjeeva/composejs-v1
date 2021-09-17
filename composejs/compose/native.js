function toast({ text="", duration=0 }) {
    let data = JSON.stringify({ text, duration })
    if (window.Android) {
        Android.toast(data)
    }
}

function snackbar({ text="", duration=1, action=null }) {
    if (window.Android) {
        Android.snackbar(JSON.stringify({ text, duration, action }))
    }
}

function setStatusBarColor(color, darkIcons=false) {
    color.a = parseInt(color.a * 255)
    if (window.Android) {
        Android.setStatusBarColor(JSON.stringify({ color, darkIcons }))
    }
}

function invoke(func) {
    return func.toString()
}


export { 
    toast,
    snackbar,
    setStatusBarColor,
    invoke
 }
