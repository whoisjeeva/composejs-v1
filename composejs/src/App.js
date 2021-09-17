import { Compose } from "../compose/compose.js"
import { Box } from "../compose/views/Box.js"
import { Text } from "../compose/views/Text.js"
import { JustifyContent, Align } from "../compose/constants.js"


const App = async scope => {
    Box({ 
        modifier: Modifier.fillMaxSize().align(Align.Center).justifyContent(JustifyContent.Center),
        content: scope => {
            Text({ text: "Hello, World!" }, scope)
        } 
    }, scope)
}

new Compose("#app").mount(App)
