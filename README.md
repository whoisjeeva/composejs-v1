### Compose JS

A declarative toolkit for mobile application development using the JavaScript programming language.


### Compose CLI

Compose CLI is a small utility tool that allows you to build, integrate or serve your ComposeJS application. Install the compose CLI using the NPM.

```
$ npm i -g @composejs/cli
```

Create a new project

```sh
$ compose create myapp
```

Build your compose app into an Android apk or aab

```sh
$ compose build --debug
$ compose build --release
```

Generate files to integrate compose app into your existing Android application

```sh
$ compose integrate
```

Create a web server to debug your compose app while developing

```sh
$ compose serve --port 3000
```

### Documentation

To learn more about the API check out the Wiki page.
