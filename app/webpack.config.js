const path = require('path');
const webpack = require('webpack');

const plugins = [
	new webpack.DefinePlugin(
		{
			'process.env': {
				NODE_ENV: `"${process.env.NODE_ENV || 'development'}"`
			}
		}
	),
	new webpack.ProvidePlugin(
		{
			$: 'jquery',
			jQuery: 'jquery'
		}
	)
];

if (process.env.NODE_ENV === 'production') {
	plugins.push(
		new webpack.optimize.UglifyJsPlugin(
			{
				compress: {
					drop_console: true
				}
			}
		)
	);
}

const jsDirectory = path.resolve(__dirname, 'frontend', 'js');

module.exports = {
	context: `${jsDirectory}/src`,
	entry: {
		main: ['babel-polyfill', `${jsDirectory}/src/main.js`]
	},
	module: {
		rules: [
			{
				exclude: /node_modules/,
				test: /\.js$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['env', 'metal-jsx', 'stage-2']
					}
				}
			}
		]
	},
	output: {
		filename: 'bundle.nocsf.js',
		library: 'RC',
		libraryTarget: 'var',
		path: `${jsDirectory}/dist`
	},
	plugins,
	resolve: {
		alias: {
			actions: `${jsDirectory}/src/actions`,
			components: `${jsDirectory}/src/components`,
			lib: `${jsDirectory}/src/lib`,
			middleware: `${jsDirectory}/src/middleware`,
			pages: `${jsDirectory}/src/pages`,
			reducers: `${jsDirectory}/src/reducers`,
			resources: `${jsDirectory}/src/resources`,
			store: `${jsDirectory}/src/store`,
			testData: `${jsDirectory}/src/test-data`
		},
		extensions: ['.js']
	}
};