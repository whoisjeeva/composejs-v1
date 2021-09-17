import { Scope } from "./scope.js"
import { css } from "./ext.js"

class NavController {

    constructor() {
        this.routes = {}
        this.parentScope = null
        this.currentScreen = null
        this.currentRouteName = null
        this.data = null
        this.backstack = []
    }


    addRoute({ name, screen, screenScope }) {
        this.routes[name] = { screen: screen, screenScope: screenScope }
    }

    push(name, data) {
        if (this.currentRouteName == name) return
        this.data = data || null
        if (this.currentScreen) {
            let r = this.routes[this.currentRouteName]
            r.name = this.currentRouteName
            this.backstack.push(r)
        }

        for (let stack of this.backstack) {
            if (stack.name === name) {
                stack.screen.style.display = "flex"
                break
            }
        }

        this.currentRouteName = name
        let futureRoute = this.routes[name]
        futureRoute.screenScope.recompose()
        let futureScreen = futureRoute.screen
        this.parentScope.element.appendChild(futureScreen)

        // css(this.currentScreen, { display: "none" })
        // this.currentScreen = this.routes[name].screen

        css(futureScreen, {
            position: "fixed",
            top: "0",
            right: "-100%",
            zIndex: "99"
        })

        css(this.currentScreen, {
            position: "fixed",
            top: "0",
            left: "0"
        })


        futureScreen.animate([
            { right: "-100%" },
            { right: "0" }
        ], {
            duration: 150,
            iterations: 1
        })

        this.currentScreen.animate([
            { left: "0" },
            { left: "-100%" }
        ], {
            duration: 150,
            iterations: 1
        })

        setTimeout(() => {
            css(futureScreen, {
                position: "relative",
                top: "auto",
                right: "auto"
            })

            // css(this.currentScreen, {
            //     position: "relative",
            //     top: "auto",
            //     left: "auto",
            //     display: "none"
            // })

            css(this.currentScreen, { left: "-100%" })
            
            this.currentScreen = this.routes[name].screen
        }, 140)


    }

    popUpLast() {
        this.backstack.pop(this.backstack.length-1)
    }

    popUpTo(name) {
        let popIndex = -1
        for (let i = 0; i < this.backstack.length; i++) {
            let stack = this.backstack[i]
            if (stack.name === name) {
                popIndex = i
                break
            }
        }

        if (popIndex > -1) {
            this.backstack.splice(0, popIndex+1)
        }
    }


    pop() {
        let route = this.backstack.pop()
        route.screen.style.display = "flex";

        // this.currentScreen.remove()
        // this.currentScreen = route.screen
        // this.currentRouteName = route.name

        css(this.currentScreen, {
            position: "fixed",
            top: "0",
            right: "0"
        })

        css(route.screen, {
            position: "fixed",
            top: "0",
            left: "-100%"
        })

        this.currentScreen.animate([
            { right: "0" },
            { right: "-100%" }
        ], {
            duration: 150,
            iterations: 1
        })

        route.screen.animate([
            { left: "-100%" },
            { left: "0" }
        ], {
            duration: 150,
            iterations: 1
        })

        setTimeout(() => {
            css(route.screen, {
                position: "relative",
                top: "auto",
                left: "auto"
            })
    
            css(this.currentScreen, {
                right: "-100%"
            })


            this.currentScreen.remove()
            this.currentScreen = route.screen
            this.currentRouteName = route.name

            this.currentScreen.scrollTo(
                this.currentScreen.getAttribute("data-scroll-x"), 
                this.currentScreen.getAttribute("data-scroll-y")
            )
        }, 140)
    }
}


function NavHost({ navController, startDestination, composer }, scope) {
    navController.parentScope = scope

    function composable({ route=null, content=null }) {
        let screen = document.createElement("div")
        screen.setAttribute("data-view-name", "compose-screen")
        screen.setAttribute("data-scroll-y", 0)
        screen.setAttribute("data-scroll-x", 0)
        Modifier.style({
            display: "flex",
            flexDirection: "column",
            width: "100vw",
            height: "100vh",
            overflow: "auto"
        }).$apply(screen)

        screen.onscroll = e => {
            screen.setAttribute("data-scroll-y", screen.scrollTop)
            screen.setAttribute("data-scroll-x", screen.scrollLeft)
        }
        
        let screenScope = new Scope(screen, content)
        
        if (route === startDestination) {
            screenScope.compose()
            navController.currentScreen = screen
            navController.currentRouteName = route
            navController.parentScope.addChild(screen)
        }

        navController.addRoute({ name: route, screen: screen, screenScope })
    }

    composer(composable)
}


export { NavHost, NavController }

