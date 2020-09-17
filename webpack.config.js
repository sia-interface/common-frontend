// const webpack = require('webpack');
const name = require('project-name');

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const {merge} = require('webpack-merge');

const sourceMap = require('./webpack/sourceMap');

const typescript = require('./webpack/typescript');
const favicon = require('./webpack/favicon');
const assets = require('./webpack/assets');

const PATHS = {
    public: path.join(__dirname, 'public'),
    source: path.resolve(__dirname, 'src'),
};
const common = merge([
    {
        entry: {
            app: path.join(PATHS.source, 'index.ts')
        },
        plugins: [
            new CleanWebpackPlugin(),
        ],
        resolve: {
            extensions: ['.tsx', '.ts', '.js']
        },
        stats: {
            assets: false,
            builtAt: false,
            children: false,
            chunks: true,
            modules: false,
            performance: false
        }
    },
    typescript()
]);

module.exports = function (env, argv) {
    if (argv.mode === 'production') {
        const OUTPUT = path.resolve(__dirname, 'build')
        const BASE = '/' + name() + "/"

        return merge([
            common,
            favicon(path.join(PATHS.public, 'favicon.png'), BASE),
            assets(PATHS.public, OUTPUT),
            {
                mode: 'production',
                plugins: [
                    new HtmlWebpackPlugin({
                        template: path.join(PATHS.public, 'index.html'),
                        base: BASE,
                        minify: {
                            collapseWhitespace: true,
                            minifyCSS: true,
                            minifyJS: true
                        }
                    }),
                ],
                output: {
                    filename: '[name].[contenthash].bundle.js',
                    path: OUTPUT,
                    publicPath: BASE,
                },
                optimization: {
                    namedChunks: true,
                    splitChunks: {
                        chunks: 'all',
                    },
                },
            },
        ]);
    } else {
        // argv.mode === 'development'
        const OUTPUT = 'D:\\nginx-1.19.1\\html' // path.resolve(__dirname, 'build')
        const BASE = '/'

        return merge([
            common,
            favicon(path.join(PATHS.public, 'favicon.png'), BASE),
            sourceMap(),
            assets(PATHS.public, OUTPUT),
            {
                mode: 'development',
                plugins: [
                    new HtmlWebpackPlugin({
                        template: path.join(PATHS.public, 'index.html'),
                        base: BASE,
                    }),
                ],
                output: {
                    filename: '[name].bundle.js',
                    path: OUTPUT,
                    publicPath: BASE,
                },
                optimization: {
                    namedChunks: true,
                    splitChunks: {
                        chunks: 'all',
                    },
                },
            },
        ]);
    }
};