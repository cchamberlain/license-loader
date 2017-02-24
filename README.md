# [license-loader](https://npmjs.com/package/license-loader)

**Inline licenses into Webpack's output bundle.**

[![NPM](https://nodei.co/npm/license-loader.png?stars=true&downloads=true)](https://nodei.co/npm/license-loader/)

## Install

`npm i -D license-loader`

## Usage

Include it as a loader targeting imports from `node_modules` and it will parse license information from the import's `package.json` and common license files.

**webpack.config.js**

```js
  module: {
    loaders: [
      { test: /\.js$/, include: /node_modules/, loader: 'license-loader' }
    ]
  }
```

## Output

The first occurrence of each package (name / version combination) will get complete readable license information emitted.

![license](https://raw.githubusercontent.com/cchamberlain/license-loader/master/public/images/license.png)
