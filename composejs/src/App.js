import { Compose } from "../compose/compose.js"
import { Button } from "../compose/views/Button.js"
import { Text } from "../compose/views/Text.js"
import { Justify, FontWeight } from "../compose/constants.js"
import { NavController, NavHost } from "../compose/navigation.js"
import { Column } from "../compose/views/Column.js"
import { Spacer } from "../compose/views/Spacer.js"
import { Card } from "../compose/views/Card.js"
import { MaterialTheme } from "../compose/theme.js"
import { Image } from "../compose/views/Image.js"


const App = async scope => {
    let navController = new NavController()
    NavHost({ 
        navController: navController, 
        startDestination: "map", 
        composer: composable => {

            composable({
                route: "map",
                content: scope => {
                    Column({
                        modifier: Modifier.justifySelf(Justify.Center).width(400).maxWidth("100%"),
                        content: scope => {
                            Image({
                                src: "res/images/img.jpeg",
                                modifier: Modifier.clickable(e => {})
                            }, scope)

                            Image({
                                src: "res/images/img.jpeg",
                                modifier: Modifier.clickable(e => {})
                            }, scope)

                            Card({
                                modifier: Modifier.width("100%"),
                                content: scope => {
                                    Text({ 
                                        text: "Card title",
                                        modifier: Modifier.style(MaterialTheme.typography.h5) 
                                            .fontWeight(FontWeight.Bold)
                                    }, scope)

                                    Text({
                                        text: "Secondary text",
                                        modifier: Modifier.style(MaterialTheme.typography.subtitle1)
                                            .color("#aaa")
                                    }, scope)
                                }
                            }, scope)
                            Spacer({ height: 20 }, scope)
                            Button({
                                content: scope => Text({ text: "Go to map" }, scope),
                                onClick: () => navController.push("home")
                            }, scope)
                        }
                    }, scope)
                }
            })

            composable({
                route: "home",
                content: scope => {
                    Button({
                        modifier: Modifier.width(200).justifySelf(Justify.Center),
                        content: scope => Text({ text: "Go to home" }, scope),
                        onClick: () => navController.pop()
                    }, scope)
                }
            })

        } 
    }, scope)
}

new Compose("#app").mount(App)
