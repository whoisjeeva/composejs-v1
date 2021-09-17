const { promisify } = require("util")
const fs = require("fs")
const path = require("path")
const { exec } = require("child_process");
const ncp = require("ncp")

class Integrator {
    constructor(args) {
        this.args = args;
    }


    async integrate() {
        if (this.args.packageName === undefined || this.args.packageName === "") {
            throw new Error("Package name is required")
        }
        this.buildJavaScript()
        const buildFolder = path.join(process.cwd(), "build", "integrate")
        fs.rmdirSync(buildFolder, { recursive: true })
        if (!fs.existsSync(buildFolder)) {
            fs.mkdirSync(buildFolder, { recursive: true });
        }

        await this.makeCopyOfTemplate()
        const arrayOfFiles = this.getAllFiles(buildFolder)
        await this.updatePlaceholders(arrayOfFiles)
        await this.copyImageFolder()
        await this.copyFontFolder()
        console.log("> Task: Done.")
    }

    async makeCopyOfTemplate() {
        const access = promisify(fs.access)
        const copy = promisify(ncp)
        await access(path.join(process.cwd(), 'compose', "integrate"), fs.constants.F_OK)
        await copy(path.join(process.cwd(), 'compose', "integrate"), path.join(process.cwd(), 'build', 'integrate'))
    }

    async copyImageFolder() {
        const access = promisify(fs.access)
        const copy = promisify(ncp)
        await access(path.join(process.cwd(), "res", "images"), fs.constants.F_OK)
        await copy(path.join(process.cwd(), "res", "images"), path.join(process.cwd(), "build", "integrate", "assets", "images"))
    }

    async copyFontFolder() {
        const access = promisify(fs.access)
        const copy = promisify(ncp)
        await access(path.join(process.cwd(), "res", "font"), fs.constants.F_OK)
        await copy(path.join(process.cwd(), "res", "font"), path.join(process.cwd(), "build", "integrate", "assets", "font"))
    }

    buildJavaScript() {
        console.log("> Task :Building JavaScript")
        return new Promise((resolve, reject) => {
            exec('npm run build', (err, stdout, stderr) => {
                if (err) {
                    console.error(err)
                    reject(err)
                }
                resolve()
            })
        })
    }

    getAllFiles(dirPath, arrayOfFiles) {
        let files = fs.readdirSync(dirPath)
        arrayOfFiles = arrayOfFiles || []

        files.forEach(file => {
            if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
                arrayOfFiles = this.getAllFiles(path.join(dirPath, file), arrayOfFiles)
            } else {
                arrayOfFiles.push(path.join(dirPath, "/", file))
            }
        })

        return arrayOfFiles
    }

    async updatePlaceholders(files) {
        for (let file of files) {
            if (file.includes("font")) {
                continue
            }
            const access = promisify(fs.access)
            const readFile = promisify(fs.readFile)
            const writeFile = promisify(fs.writeFile)
            await access(file, fs.constants.F_OK)
    
            let content = await readFile(file, 'utf8')
            content = content.replace(/‗PACKAGE_NAME‗/g, this.args.packageName)
            await writeFile(file, content)
        }
    }
}


module.exports = Integrator;
