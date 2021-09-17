const arg = require("arg")
const inquirer = require("inquirer")
const path = require("path")
const uuid = require("./uuid.js")



function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
        { 
            "--package-name": String, 
            "--app-name": String,
            "--sdk": String, 
            "--key": String, 
            "--alias": String, 
            "--password": String ,
            "--debug": Boolean,
            "--release": Boolean,
            "--help": Boolean,
            "--port": Number,
            "--version": Boolean,
            "-v": "--version",
            "-h": "--help",
        },
        { argv: rawArgs.slice(2) }
    )

    return {
        command: args._[0],
        path: args._[1],
        port: args["--port"],
        appName: args["--app-name"],
        packageName: args["--package-name"],
        sdk: args["--sdk"],
        key: args["--key"],
        alias: args["--alias"],
        password: args["--password"],
        debug: args["--debug"],
        release: args["--release"],
        help: args["--help"],
        version: args["--version"],
    } 
}



async function promptForMissingOptions(options) {
    let questions = []
    
    if (options.command === "build") {
        if (!options.appName) {
            questions.push({
                type: "input",
                name: "appName",
                message: "App name: ",
                default: "My App"
            })
        }

        if (!options.packageName) {
            questions.push({
                type: "input",
                name: "packageName",
                message: "Package name: ",
                default: "compose.app_" + uuid()
            })
        }

        if (!options.sdk) {
            questions.push({
                type: "input",
                name: "sdk",
                message: "Android SDK location: ",
                default: path.join(process.env.USERPROFILE, "AppData", "Local", "Android", "Sdk")
            })
        }

        if (!options.key) {
            questions.push({
                type: "input",
                name: "key",
                message: "Sign key: "
            })
        }

        if (!options.alias) {
            questions.push({
                type: "input",
                name: "alias",
                message: "Key alias: "
            })
        }

        if (!options.password) {
            questions.push({
                type: "input",
                name: "password",
                message: "Key password: "
            })
        }
    } else if (options.command === "integrate") {
        if (!options.packageName) {
            questions.push({
                type: "input",
                name: "packageName",
                message: "Package name: ",
                default: "compose.app_" + uuid()
            })
        }
    } else if (options.command === "create") {
        if (!options.appName) {
            questions.push({
                type: "input",
                name: "appName",
                message: "App name: ",
                default: "My App"
            })
        }
    }
    const answers = await inquirer.prompt(questions)
    return {
        ...options,
        appName: options.appName || answers.appName,
        packageName: options.packageName || answers.packageName,
        sdk: options.sdk || answers.sdk,
        key: options.key || answers.key,
        alias: options.alias || answers.alias,
        password: options.password || answers.password,
    }
}


async function parseArgs(args) {
    const options = parseArgumentsIntoOptions(args)
    try {
        return await promptForMissingOptions(options)
    } catch (e) {
        console.error(e.message)
        process.exit(1)
    }
}


module.exports = parseArgs
