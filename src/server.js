const express = require('express')
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const useragent = require('express-useragent')
const os = require('os')
const interfaces = os.networkInterfaces()
var chokidar = require('chokidar')


function getCurrentTime() {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    return `${hours}:${minutes}:${seconds}`
}

function getIpAddress() {
    let address = null
    for (let key in interfaces) {
        let iface = interfaces[key].filter(details => details.family === 'IPv4' && details.internal === false)
        if (iface.length > 0) address = iface[0].address
    }
    return address 
}

function runServer(port) {
    const app = express()
    app.use(useragent.express())
    let changes = {}
    let isChanged = false

    app.use("/src", express.static(path.join(process.cwd(), 'src')))
    app.use("/res", express.static(path.join(process.cwd(), 'res')))
    app.use("/compose", express.static(path.join(process.cwd(), 'compose')))


    app.get('/', (req, res) => {
        res.sendFile("index.html", { root: process.cwd() })
    })

    app.get("/changes", (req, res) => {
        if (isChanged) {
            console.log(`[%s] file change detected, reloading...`, chalk.gray(getCurrentTime()))
            isChanged = false
        }
        res.send(`${changes[req.useragent.source]}`)
        changes[req.useragent.source] = 0
    })


    var watcher = chokidar.watch(path.join(process.cwd(), "src"), {ignored: /^\./, persistent: true})
    watcher.on('all', (evt, path) => {
        isChanged = true        
        let keys = Object.keys(changes)
        keys.forEach(key => {
            changes[key] = 1
        })
    })

    let localPort = port || 3000
    app.listen(localPort, () => {
        console.log(`[%s] Serving Compose app (livereload: enabled)`, chalk.gray(getCurrentTime()))
        console.log(`[%s] Server started on port %s`, chalk.gray(getCurrentTime()), chalk.green.bold(`${localPort}`))
        console.log(`[%s] Use %s to see your application`, chalk.gray(getCurrentTime()), chalk.gray.bold(`http://${getIpAddress()}:${localPort}`))
        console.log()
    })
}


module.exports = runServer
