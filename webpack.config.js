var path = require('path');
var webpack = require('webpack');

var config = {
    devtool: 'source-map',
    entry: [
        'webpack-hot-middleware/client?reload=true',
        path.join(__dirname, './client/index.js')
    ],
    output: {
        path: __dirname,
        filename: 'bundle.js',
        publicPath: '/'
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.(?:png|ico|js|jsx)$/,
                include: path.join(__dirname, 'client'),
                loaders: ['babel-loader']
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.gif$/,
                loader: "url-loader?mimetype=image/png"
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&minetype=application/font-woff"
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader?name=[name].[ext]"
            }
        ]
    },
    resolve: {
        extensions: ['.js']
    }
}
module.exports = config