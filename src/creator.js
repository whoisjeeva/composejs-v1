const { promisify } = require("util")
const fs = require("fs")
const path = require("path")
const { exec } = require("child_process");
const ncp = require("ncp")


class Creator {
    constructor(options) {
        this.options = options
        this.config = {
            appName: options.appName,
        }
    }

    async create() {
        let projectPath = this.options.path || "."

        if (!fs.existsSync(projectPath)) fs.mkdirSync(projectPath, { recursive: true });

        let files = fs.readdirSync(projectPath)
        if (files.length > 0) {
            console.error("Project directory is not empty")
            return
        }
        await this.makeCopyOfTemplate(projectPath)
        await this.updatePlaceholders([
            path.join(process.cwd(), projectPath, "index.html"),
        ])
    }

    async updatePlaceholders(files) {
        for (let file of files) {
            if (file.includes("gradle-wrapper")) {
                continue
            }
            const access = promisify(fs.access)
            const readFile = promisify(fs.readFile)
            const writeFile = promisify(fs.writeFile)
            await access(file, fs.constants.F_OK)
    
            let content = await readFile(file, 'utf8')
            // content = content.replace(/‗PACKAGE_NAME‗/g, this.config.packageName)
            // content = content.replace(/app\.spidy\.boil/g, this.config.packageName)
            // content = content.replace(/‗SDK_LOCATION‗/g, this.config.sdk)
            content = content.replace(/‗APP_NAME‗/g, this.config.appName)
            // content = content.replace(/‗SIGN_KEY‗/g, this.config.signKey)
            // content = content.replace(/‗SIGN_KEY_PASSWORD‗/g, this.config.keyPassword)
            // content = content.replace(/‗SIGN_KEY_ALIAS‗/g, this.config.keyAlias)
            await writeFile(file, content)
        }
    }

    async makeCopyOfTemplate(projectPath) {
        const access = promisify(fs.access)
        const copy = promisify(ncp)
        await access(path.join(__dirname, "..", 'composejs'), fs.constants.F_OK)
        await copy(path.join(__dirname, "..", 'composejs'), path.join(process.cwd(), projectPath))
    }
}

module.exports = Creator
