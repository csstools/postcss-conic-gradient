# PostCSS Conic Gradient [![Build Status][ci-img]][ci]

<img align="right" width="135" height="95" src="http://postcss.github.io/postcss/logo-leftp.png" title="Philosopher’s stone, logo of PostCSS">

[PostCSS Conic Gradient] is a [PostCSS] plugin that allows you to use [conic gradients] in your CSS files. It is based on [Lea Verou’s excellent [conic-gradient polyfill].

Conic gradients are awesome, but browsers haven’t realized yet. This polyfill lets you experiment with them now. If you like them, [ask browser vendors to implement them]!

```css
/* before */

.hue-wheel {
	background-image: conic-gradient(red, yellow, lime, aqua, blue, magenta, red);
}

/* after */

.groovy {
	background-image: url("data:image/svg+xml,...");
	background-image: conic-gradient(red, yellow, lime, aqua, blue, magenta, red);
}
```

## Usage

You just need to follow these three steps to use [PostCSS Conic Gradient]:

1. Install [Cairo].
2. Add [PostCSS] to your build tool.
3. Add [PostCSS Conic Gradient] as a PostCSS process.

```sh
npm install postcss-conic-gradient --save-dev
```

### Node

```js
postcss([ require('postcss-conic-gradient')() ])
```

### Grunt

Install [Grunt PostCSS]:

```shell
npm install postcss-conic-gradient --save-dev
```

Enable [PostCSS Conic Gradient] within your Gruntfile:

```js
grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
				require('postcss-conic-gradient')()
			]
		},
		dist: {
			src: 'css/*.css'
		}
	}
});
```

[ask browser vendors to implement them]: http://leaverou.github.io/conic-gradient/#ask
[ci]: https://travis-ci.org/jonathantneal/postcss-conic-gradient
[ci-img]: https://travis-ci.org/jonathantneal/postcss-conic-gradient.svg
[Cairo]: https://github.com/Automattic/node-canvas/wiki/_pages
[conic-gradient polyfill]: http://leaverou.github.io/conic-gradient/
[conic gradients]: http://w3.org/TR/css4-images/#conic-gradients
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[Lea Verou]: http://lea.verou.me/
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Conic Gradient]: https://github.com/jonathantneal/postcss-conic-gradient
