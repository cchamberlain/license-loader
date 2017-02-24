# license-loader
Inlines licenses into Webpack's output bundle.

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

