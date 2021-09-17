const { promisify } = require("util")
const fs = require("fs")
const path = require("path")
const { exec } = require("child_process");
const ncp = require("ncp")


class Builder {
    constructor(options) {
        this.config = {
            appName: "",
            packageName: "",
            sdk: "",
            signKey: "",
            keyAlias: "",
            keyPassword: ""
        }
        this.options = options
        this.config.appName = options.appName
        this.config.packageName = options.packageName
        this.config.sdk = options.sdk.replace(/\\/g, "\\\\").replace(/\:/g, "\\:")
        this.config.signKey = options.key
        this.config.keyAlias = options.alias
        this.config.keyPassword = options.password
    }

    async build(buildType) {
        await this.buildJavaScript()
        const buildFolder = path.join(process.cwd(), "compose", "android-build")
        fs.rmdirSync(buildFolder, { recursive: true })
        if (!fs.existsSync(buildFolder)) {
            fs.mkdirSync(buildFolder, { recursive: true });
        }

        await this.makeCopyOfTemplate()
        const arrayOfFiles = this.getAllFiles(buildFolder)
        await this.updatePlaceholders(arrayOfFiles)
        await this.copyImageFolder()
        await this.makeCopyOfMipmap()

        setTimeout(() => this.executeBuilds(buildType), 1000)
    }

    async makeCopyOfTemplate() {
        const access = promisify(fs.access)
        const copy = promisify(ncp)
        await access(path.join(process.cwd(), 'compose', "android"), fs.constants.F_OK)
        await copy(path.join(process.cwd(), 'compose', "android"), path.join(process.cwd(), 'compose', 'android-build'))
    }

    async makeCopyOfMipmap() {
        const access = promisify(fs.access)
        const copy = promisify(ncp)
        await access(path.join(process.cwd(), "res", "mipmap"), fs.constants.F_OK)
        await copy(path.join(process.cwd(), "res", "mipmap"), path.join(process.cwd(), 'compose', 'android-build', "app", "src", "main", "res"))
    }

    async copyImageFolder() {
        const access = promisify(fs.access)
        const copy = promisify(ncp)
        await access(path.join(process.cwd(), "res", "images"), fs.constants.F_OK)
        await copy(path.join(process.cwd(), "res", "images"), path.join(process.cwd(), 'compose', 'android-build', "app", "src", "main", "assets", "images"))
    }

    async copyFontFolder() {
        const access = promisify(fs.access)
        const copy = promisify(ncp)
        await access(path.join(process.cwd(), "res", "font"), fs.constants.F_OK)
        await copy(path.join(process.cwd(), "res", "font"), path.join(process.cwd(), 'compose', 'android-build', "app", "src", "main", "assets", "font"))
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
            if (file.includes("gradle-wrapper") || file.includes("font")) {
                continue
            }
            const access = promisify(fs.access)
            const readFile = promisify(fs.readFile)
            const writeFile = promisify(fs.writeFile)
            await access(file, fs.constants.F_OK)
    
            let content = await readFile(file, 'utf8')
            content = content.replace(/‗PACKAGE_NAME‗/g, this.config.packageName)
            content = content.replace(/app\.spidy\.boil/g, this.config.packageName)
            content = content.replace(/‗SDK_LOCATION‗/g, this.config.sdk)
            content = content.replace(/‗APP_NAME‗/g, this.config.appName)
            content = content.replace(/‗SIGN_KEY‗/g, this.config.signKey)
            content = content.replace(/‗SIGN_KEY_PASSWORD‗/g, this.config.keyPassword)
            content = content.replace(/‗SIGN_KEY_ALIAS‗/g, this.config.keyAlias)
            await writeFile(file, content)
        }
    }

    async copyDebugApk() {
        const access = promisify(fs.access)
        const copy = promisify(ncp)
        const buildFolder = path.join(process.cwd(), "build")
        fs.rmdirSync(buildFolder, { recursive: true })
        if (!fs.existsSync(buildFolder)) {
            fs.mkdirSync(buildFolder, { recursive: true });
        }

        const apkPath = path.join(process.cwd(), "compose", "android-build", "app", "build", "outputs", "apk", "debug")

        await access(apkPath, fs.constants.F_OK)
        await copy(apkPath, buildFolder)
    }

    async copyReleaseApk() {
        const access = promisify(fs.access)
        const copy = promisify(ncp)
        const buildFolder = path.join(process.cwd(), "build")
        fs.rmdirSync(buildFolder, { recursive: true })
        if (!fs.existsSync(buildFolder)) {
            fs.mkdirSync(buildFolder, { recursive: true });
        }

        const apkPath = path.join(process.cwd(), "compose", "android-build", "app", "build", "outputs", "bundle", "release")

        await access(apkPath, fs.constants.F_OK)
        await copy(apkPath, buildFolder)
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

    executeBuilds(buildType) {
        if (buildType === "debug") {
            exec("cd " + path.join("compose", "android-build") + " && .\\gradlew assembleDebug", async (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
                await this.copyDebugApk()
            }).stdout.on('data', data => process.stdout.write(data))
        } else if (buildType === "release") {
            exec("cd " + path.join("compose", "android-build") + " && .\\gradlew bundleRelease", async (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
                await this.copyReleaseApk()
            }).stdout.on('data', data => process.stdout.write(data))
        }
    }

    async readFile(file) {
        const access = promisify(fs.access)
        const readFile = promisify(fs.readFile)

        await access(file, fs.constants.R_OK)
        return await readFile(file, "utf8")    
    }
}

module.exports = Builder
