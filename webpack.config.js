const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = ({ minify = false, production = false } = {}) => {
	const extractLess = new ExtractTextPlugin('[name]');

	const plugins = [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development')
		}),
		new CopyWebpackPlugin([
			{ from: './src/less/img/onas.jpg', to: './img/onas.jpg' },
			{ from: './src/less/img/products_bckg.png', to: './img/products_bckg.png' },
			{ from: './src/less/img/portfolio.jpg', to: './img/portfolio.jpg' },
			{ from: './src/less/img/career.jpg', to: './img/career.jpg' }
		], {}),
		extractLess,
		new webpack.ProvidePlugin({
			$: 'jquery'
	 	})
	];

	if (production) {
		plugins.push(new webpack.optimize.UglifyJsPlugin({
			compress: { warnings: false }
		}));
	}

	return {
		entry: {
			'bundle.css': './src/less/viafinance.less',
			'bundle.js': './src/js/App.js',
		},
		output: {
			filename: '[name]',
			path: path.resolve(__dirname, './dist/')
		},
		module: {
			rules: [
				{
					test: /.js$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader'
					}
				}, {
					test: /\.less$/,
					use: ExtractTextPlugin.extract([{
						loader: 'css-loader',
						options: {
							minimize: minify
						}
					}, 'less-loader'])
			}, {
            test: /\.png$/,
            use: [ { loader: "url-loader?limit=100000" } ]
        }, {
            test: /\.jpg$/,
            use: [ { loader: "file-loader" } ]
        }, {
            test: /\.ttf$/,
            use: [ { loader: "url-loader?limit=10000&mimetype=application/octet-stream" } ]
        }, {
            test: /\.(woff|woff2)$/,
            use: [ { loader: "url-loader?limit=10000&mimetype=application/font-woff" } ]
        }, {
            test: /\.eot$/,
            use: [ { loader: "file-loader" } ]
        }, {
            test: /\.svg$/,
            use: [ { loader: "url-loader?limit=10000&mimetype=image/svg+xml" } ]
        }
			]
		},
		plugins,
		devtool: 'source-map'
	};
};
