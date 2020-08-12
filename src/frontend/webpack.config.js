const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;
const NullPlugin = require('webpack-null-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = env => {
    var production = env && env.NODE_ENV === 'production';
    var bundleAnalyze = env && env.ANALYZE;
    return {
        entry: ['./src/index.tsx'],
        mode: production ? 'production' : 'development',
        performance: {
            hints: production ? "warning" : false
        },
        devtool: production ? false : 'inline-source-map',
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    exclude: [/\.test.(ts|tsx)$/, /node_modules/],
                    use: {
                        loader: "ts-loader",
                        options: {
                            transpileOnly: true
                        }
                    }
                },
                {
                    test: /\.module\.scss$/,
                    loader: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: !production,
                                modules: {
                                    exportGlobals: true,
                                    localIdentName: '[path][name]__[local]--[hash:base64:5]',
                                    localIdentContext: path.resolve(__dirname, 'src'),
                                    localIdentHashPrefix: '_',
                                },
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: !production
                            }
                        }
                    ],
                },
                {
                    test: /\.scss$/,
                    exclude: /\.module\.scss$/,
                    use: ['style-loader', {
                        loader: "css-loader", options: {
                            sourceMap: !production
                        }
                    },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: !production
                            }
                        }],
                },
            ]
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js', '.css', '.scss']
        },
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'dist/bundles'),
        },
        optimization: {
            minimizer: [new TerserPlugin({ /* additional options here */})],
        },
        plugins: [
            bundleAnalyze ? new BundleAnalyzerPlugin() : new NullPlugin(),
            new HtmlWebpackPlugin(
                Object.assign(
                    {},
                    {
                        inject: true,
                        template: "./public/index.html",
                        favicon: "./public/favicon.ico"
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
        devServer: !production ? {
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
        } : {}
    };
};
