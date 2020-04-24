const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin');
var production = process.env.NODE_ENV === 'production';
module.exports = {
    entry: './src/index.tsx',
    mode: production ? 'production' : 'development',
    performance: {
        hints: production ? "warning" : false
    },
    devtool: production ? false : 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: [/.*\.test.*/, /node_modules/],
                use: {
                    loader: "ts-loader",
                    options: {
                        transpileOnly: true
                    }
                }
            },
            {
                test: /\.css$/,
                exclude: [/node_modules/],
                use: ['style-loader', "css-loader"]
            },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
        minimizer: [new TerserPlugin({ /* additional options here */})],
    },
    plugins: [
        new BundleAnalyzerPlugin(),
        new HtmlWebpackPlugin(
            Object.assign(
                {},
                {
                    inject: true,
                    template: "./public/index.html",
                }, production ? {
                    minify: {
                        removeComments: true,
                        collapseWhitespace: true,
                        removeRedundantAttributes: true,
                        useShortDoctype: true,
                        removeEmptyAttributes: true,
                        removeStyleLinkTypeAttributes: true,
                        keepClosingSlash: true,
                        minifyJS: true,
                        minifyCSS: true,
                        minifyURLs: true,
                    },
                } : undefined
            )
        )],
    devServer: {
        port: 3001,
        inline: true,
        hot: true,
        contentBase: ['./src', './public'],
        watchContentBase: true,
        proxy: {
            "**": {
                changeOrigin: true,
                target: "http://localhost:8080"
            }
        }
    }
};
