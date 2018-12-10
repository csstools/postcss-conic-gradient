var postcss = require('postcss');
var path = require('path');
var colorTool = require('color');

var CanvasKitInit = require('./canvaskit');

// eslint-disable-next-line no-unused-vars
module.exports = postcss.plugin('postcss-conic-gradient', function (opts) {
	opts = opts || {};

	var π = Math.PI;
	var ε = 0.00001;
	var deg = π / 180;

	var innerWidth = 480;
	var innerHeight = 480;

	var _ = function(o) {
		_.all.push(this);

		o = o || {};

		this.surface = _.CanvasKit.MakeSurface(innerWidth, innerHeight);
		this.canvas = this.surface.getCanvas();

		this.repeating = !!o.repeating;

		this.size = o.size || Math.max(innerWidth, innerHeight);

		this.canvas.width = this.canvas.height = this.size;

		var stops = o.stops;

		// commas that are not followed by a ) without a ( first
		this.stops = (stops || '').split(/\s*,(?![^(]*\))\s*/);

		for (var i = 0; i < this.stops.length; i++) {
			var forStop = this.stops[i] = new _.ColorStop(this, this.stops[i]);

			if (forStop.next) {
				this.stops.splice(i + 1, 0, forStop.next);

				i++;
			}
		}

		// Normalize stops

		// Add dummy first stop or set first stop’s position to 0
		// if it doesn’t have one
		if (this.stops[0].pos === undefined) {
			this.stops[0].pos = 0;
		}
		else if (this.stops[0].pos > 0) {
			var first = this.stops[0].clone();

			first.pos = 0;
			this.stops.unshift(first);
		}

		// Add dummy last stop or set first stop’s position to 100%
		// if it doesn’t have one
		if (this.stops[this.stops.length - 1].pos === undefined) {
			this.stops[this.stops.length - 1].pos = 1;
		}
		else if (!this.repeating && this.stops[this.stops.length - 1].pos < 1) {
			var last = this.stops[this.stops.length - 1].clone();

			last.pos = 1;

			this.stops.push(last);
		}

		this.stops.forEach(function(stop, i){
			if (stop.pos === undefined) {
				// Evenly space color stops with no position
				for (var j = i + 1; this[j]; j++) {
					if (this[j].pos !== undefined) {
						stop.pos =
							this[i - 1].pos + 
							(this[j].pos - this[i - 1].pos) / (j - i + 1);

						break;
					}
				}
			}
			else if (i > 0) {
				// Normalize color stops whose position is smaller
				// than the position of the stop before them
				stop.pos = Math.max(stop.pos, this[i - 1].pos);
			}
		}, this.stops);

		if (this.repeating) {
			// Repeat color stops until >= 1
			var repeatingStops = this.stops.slice();
			var lastStop = repeatingStops[repeatingStops.length - 1];
			var difference = lastStop.pos - repeatingStops[0].pos;

			for (
				var i = 0;
				this.stops[this.stops.length - 1].pos < 1 && i < 10000;
				i++
			) {
				for (var j = 0; j < repeatingStops.length; j++) {
					var s = repeatingStops[j].clone();

					s.pos += (i + 1) * difference;

					this.stops.push(s);
				}
			}
		}

		this.paint();
	};

	_.all = [];

	_.prototype = {
		toString: function() {
			var b64encoded = this.png.toString('base64');

			return "url('data:image/png;base64," + b64encoded + "')";
		},

		get png() {
			var img = this.surface.makeImageSnapshot();

			if (!img) {
				throw new Error('Failed to get image snapshot');
			}

			var png = img.encodeToData();

			if (!png) {
				throw new Error('Encoding failure');
			}

			var pngBytes = _.CanvasKit.getSkDataBytes(png);

			return Buffer.from(pngBytes);
		},

		get r() {
			return Math.sqrt(2) * this.size / 2;
		},

		// Paint the conical gradient on the canvas
		// Algorithm inspired from http://jsdo.it/akm2/yr9B
		paint: function() {
			var c = this.canvas;

			var radius = this.r;
			var x = this.size / 2;

			var stopIndex = 0; // The index of the current color
			var stop = this.stops[stopIndex], prevStop;

			var diff, t, sameColor;

			c.rotate(-90, this.size / 2, this.size / 2);

			for (var i = 0; i < 360; i += 0.5) {
				if (i / 360 + ε >= stop.pos) {
					// Switch color stop
					do {
						prevStop = stop;

						stopIndex++;
						stop = this.stops[stopIndex];
					} while (
						stop && stop !== prevStop && stop.pos === prevStop.pos
					);

					if (!stop) {
						break;
					}

					sameColor =
						prevStop.color + '' === stop.color + '' &&
						prevStop !== stop;

					diff = prevStop.color.map(function(c, i){
						return stop.color[i] - c;
					});
				}

				t = (i / 360 - prevStop.pos) / (stop.pos - prevStop.pos);

				var interpolated = sameColor ?
					stop.color :
					diff.map(function (d, i){
						var ret = d * t + prevStop.color[i];

						return i < 3 ? ret & 255 : ret;
					});

				var path = new _.CanvasKit.SkPath();

				path.moveTo(x, x);

				var angle = Math.min(360 * deg, i * deg);
				var θ;

				if (sameColor) {
					θ = 360 * (stop.pos - prevStop.pos);

					i += θ - 0.5;
				}
				else {
					θ = 0.5;
				}

				var endAngle = angle + θ * deg;

				endAngle = Math.min(360 * deg, endAngle);

				// 0.02: To prevent moire

				var arc = endAngle - angle;

				path.arc(
					x, x,
					radius,
					arc >= 2 * deg ? angle : angle - 0.02, endAngle
				);

				var paint = new _.CanvasKit.SkPaint();
				paint.setStyle(_.CanvasKit.PaintStyle.Fill);
				paint.setColor(_.CanvasKit.Color(...interpolated, 1.0));

				c.drawPath(path, paint);
				
				this.surface.flush();

				path.delete();
				paint.delete();
			}
		}
	};

	_.ColorStop = function(gradient, stop) {
		this.gradient = gradient;

		if (stop) {
			var parts = stop.match(/^(.+?)(?:\s+([\d.]+)(%|deg|turn)?)?(?:\s+([\d.]+)(%|deg|turn)?)?\s*$/);

			this.color = _.ColorStop.colorToRGBA(parts[1]);

			if (parts[2]) {
				var unit = parts[3];

				if (unit === '%' || parts[2] === '0' && !unit) {
					this.pos = parts[2] / 100;
				}
				else if (unit === 'turn') {
					this.pos = +parts[2];
				}
				else if (unit === 'deg') {
					this.pos = parts[2] / 360;
				}
			}

			if (parts[4]) {
				this.next = new _.ColorStop(
					gradient,
					parts[1] + ' ' + parts[4] + parts[5]
				);
			}
		}
	};

	_.ColorStop.prototype = {
		clone: function() {
			var ret = new _.ColorStop(this.gradient);
			ret.color = this.color;
			ret.pos = this.pos;

			return ret;
		},

		toString: function() {
			var colors = this.color.join(', ');
			return `rgba(${colors}) ${this.pos * 100}%`;
		}
	};

	_.ColorStop.colorToRGBA = function(color) {
		if (!Array.isArray(color)) {
			return colorTool(color).rgbArray();
		}

		return color;
	};

	var match = /(?:repeating-)?conic-gradient\(((?:\([^()]+\)|[^;()}])+?)\)/g;

	return async function (css) {
		const CanvasKit = CanvasKitInit({
			locateFile: (file) => path.resolve(__dirname, file),
		});

		try {
			await loadNativeModule(CanvasKit);
		} catch (e) {
			throw new Error('Cannot load CanvasKit module! ' + e.message)
		}

		_.CanvasKit = CanvasKit;

		css.eachDecl('background-image', function (decl) {
			var changed;

			var values = postcss.list.comma(decl.value).map(function (value) {
				if (match.test(value)) {
					changed = true;

					return value.replace(
						match,
						function(gradient, stops) {
							return new _({
								stops: stops,
								repeating: gradient.indexOf('repeating-') > -1
							});
						}
					);
				}

				return value;
			}).join(',');

			if (changed) {
				decl.cloneBefore({
					prop: decl.prop,
					value: values
				});
			}
		});
	};
});

function loadNativeModule (module) {
	return new Promise((resolve) => {
		if (module.calledRun) {
			resolve()
		} else {
			const _onRuntimeInitialized = module.onRuntimeInitialized;
			
			module.onRuntimeInitialized = () => {
				if (_onRuntimeInitialized) _onRuntimeInitialized();
				resolve()
			}
		}
	})
}
