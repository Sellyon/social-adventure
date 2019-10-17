const path = require('path');

module.exports = {
	entry: [
			'@babel/polyfill',
			'./src/index.js'
		],
	module: {
	    rules: [
		    {
		        test: /\.(js|jsx)$/,
		        exclude: /node_modules/,
		        use: 'babel-loader'
		    }
	    ]
	},
	resolve: {
		extensions: ['*', '.js', '.jsx']
	},
	output: {
	    filename: '[name].js',
	    chunkFilename: '[name].js',
	    path: path.resolve(__dirname, 'public'),
	    publicPath: 'public/',
	},
	devServer: {
	    contentBase: './public'
	}
};