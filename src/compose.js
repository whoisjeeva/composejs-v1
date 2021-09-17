const parseArgs = require('./utils/argparse.js');
const Builder = require('./builder.js');
const Integrator = require('./integrate.js');
const runServer = require('./server.js')
const package = require("../package.json")
const Creator = require('./creator.js')

async function main(argv) {
    let options = await parseArgs(argv);
    if (options.version) {
        console.log(`Compose CLI ${package.version}`)
        return
    }
    if (options.help) {
        console.log(`
command        : operation to perform
--port         : port to run the server on
--app-name     : name of the app
--package-name : name of the package
--sdk          : android sdk to use
--key          : key to sign your app with
--alias        : alias of the key to use
--password     : password of the key to use
--debug        : buld a debug apk
--release      : build a release apk
--help, -h     : show this help
--version, -v  : show the version of this tool

Available commands:
    build      : create a new app
    integrate  : integrate into an existing app
    serve      : run a server to serve the app
    create     : create a new app

Usage: compose <command> [options]
        `)
        return
    }

    if (!options.command) {
        console.log("You must specify an command.")
        process.exit(1)
    }

    switch(options.command || null) {
        case "build":
            let buildType = "debug"
            if (options.release) {
                buildType = "release"
            }
            let builder = new Builder(options)
            await builder.build(buildType)
            break
        case "integrate":
            let integrator = new Integrator(options)
            integrator.integrate()
            break
        case "serve":
            runServer(options.port)
            break
        case "create":
            let creator = new Creator(options)
            await creator.create()
            break
        default:
            console.log("Unknown command: " + options.command)
    }
}


module.exports = main;
