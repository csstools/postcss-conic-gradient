import postcss from 'postcss';
import path from 'path';
import loadNativeModule from './lib/load-native-module';
import canvaskit from './lib/canvaskit';
import _ from './lib/_';

export default postcss.plugin('postcss-conic-gradient', () => {
	return async function (css) {
		const canvasKit = canvaskit({
			locateFile(file) {
				return path.resolve(__dirname, 'src', 'lib', file);
			}
		});

		try {
			await loadNativeModule(canvasKit);
		} catch (error) {
			throw new Error(`Cannot load CanvasKit module! ${error.message}`);
		}

		_.CanvasKit = canvasKit;

		css.walkDecls(supportedPropertiesRegExp, decl => {
			let hasChanged;

			const values = postcss.list.comma(decl.value).map(value => {
				if (conicGradientFunctionRegExp.test(value)) {
					hasChanged = true;

					return value.replace(
						conicGradientFunctionRegExp,
						(gradient, stops) => new _({
							stops: stops,
							repeating: gradient.includes('repeating-')
						})
					);
				}

				return value;
			}).join(',');

			if (hasChanged) {
				decl.cloneBefore({
					prop: decl.prop,
					value: values
				});
			}
		});
	};
});

const supportedPropertiesRegExp = /^(background|background-image|border-image|border-image-source|content|cursor|list-style|list-style-image)$/;
const conicGradientFunctionRegExp = /(?:repeating-)?conic-gradient\(((?:\([^()]+\)|[^;()}])+?)\)/g;
