# [license-loader](https://npmjs.com/package/license-loader)
**Inline licenses into Webpack's output bundle.**

## Install

`npm i -D license-loader`

## Usage

**webpack.config.js**

```js
  module: {
    loaders: [
      { test: /\.js$/, include: /node_modules/, loader: 'license-loader' }
    ]
  }
```

## Output

![license](https://raw.githubusercontent.com/cchamberlain/license-loader/master/public/images/license.png)
