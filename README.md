# PostCSS Conic Gradient [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Support Chat][git-img]][git-url]

[PostCSS Conic Gradient] lets you use conic gradients in CSS. It is based on
[Lea Verou]’s excellent [conic-gradient polyfill].

```pcss
.hue-wheel {
	background-image: conic-gradient(red, yellow, lime, aqua, blue, magenta, red);
}

/* becomes */

.hue-wheel {
	background-image: url("data:image/png;base64,...");
	background-image: conic-gradient(red, yellow, lime, aqua, blue, magenta, red);
}
```

## Usage

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

[PostCSS Conic Gradient] runs in all Node environments, with special instructions for:

| [Node](INSTALL.md#node) | [PostCSS CLI](INSTALL.md#postcss-cli) | [Webpack](INSTALL.md#webpack) | [Create React App](INSTALL.md#create-react-app) | [Gulp](INSTALL.md#gulp) | [Grunt](INSTALL.md#grunt) |
| --- | --- | --- | --- | --- | --- |

[cli-img]: https://img.shields.io/travis/jonathantneal/postcss-conic-gradient.svg
[cli-url]: https://travis-ci.org/jonathantneal/postcss-conic-gradient
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[npm-img]: https://img.shields.io/npm/v/postcss-conic-gradient.svg
[npm-url]: https://www.npmjs.com/package/postcss-conic-gradient

[conic-gradient polyfill]: http://leaverou.github.io/conic-gradient/
[conic gradients]: http://w3.org/TR/css4-images/#conic-gradients
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Conic Gradient]: https://github.com/jonathantneal/postcss-conic-gradient
[Lea Verou]: http://lea.verou.me/
