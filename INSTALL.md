# Installing PostCSS Conic Gradient

[PostCSS Conic Gradient] runs in all Node environments, with special instructions for:

| [Node](#node) | [PostCSS CLI](#postcss-cli) | [Webpack](#webpack) | [Create React App](#create-react-app) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- | --- |

## Node

Add [PostCSS Conic Gradient] to your project:

```bash
npm install postcss-conic-gradient --save-dev
```

Use [PostCSS Conic Gradient] to process your CSS:

```js
const postcssConicGradient = require('postcss-conic-gradient');

postcssConicGradient.process(YOUR_CSS /*, processOptions, pluginOptions */);
```

Or use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssConicGradient = require('postcss-conic-gradient');

postcss([
  postcssConicGradient(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli --save-dev
```

Use [PostCSS Conic Gradient] in your `postcss.config.js` configuration file:

```js
const postcssConicGradient = require('postcss-conic-gradient');

module.exports = {
  plugins: [
    postcssConicGradient(/* pluginOptions */)
  ]
}
```

## Webpack

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader --save-dev
```

Use [PostCSS Conic Gradient] in your Webpack configuration:

```js
const postcssConicGradient = require('postcss-conic-gradient');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          { loader: 'postcss-loader', options: {
            ident: 'postcss',
            plugins: () => [
              postcssConicGradient(/* pluginOptions */)
            ]
          } }
        ]
      }
    ]
  }
}
```

## Create React App

Add [React App Rewired] and [React App Rewire PostCSS] to your project:

```bash
npm install react-app-rewired react-app-rewire-postcss --save-dev
```

Use [React App Rewire PostCSS] and [PostCSS Conic Gradient] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssConicGradient = require('postcss-conic-gradient');

module.exports = config => reactAppRewirePostcss(config, {
  plugins: () => [
    postcssConicGradient(/* pluginOptions */)
  ]
});
```

## Gulp

Add [Gulp PostCSS] to your project:

```bash
npm install gulp-postcss --save-dev
```

Use [PostCSS Conic Gradient] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssConicGradient = require('postcss-conic-gradient');

gulp.task('css', () => gulp.src('./src/*.css').pipe(
  postcss([
    postcssConicGradient(/* pluginOptions */)
  ])
).pipe(
  gulp.dest('.')
));
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss --save-dev
```

Use [PostCSS Conic Gradient] in your Gruntfile:

```js
const postcssConicGradient = require('postcss-conic-gradient');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
       postcssConicGradient(/* pluginOptions */)
      ]
    },
    dist: {
      src: '*.css'
    }
  }
});
```

[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS CLI]: https://github.com/postcss/postcss-cli
[PostCSS Loader]: https://github.com/postcss/postcss-loader
[PostCSS Conic Gradient]: https://github.com/jonathantneal/postcss-conic-gradient
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
