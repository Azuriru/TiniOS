const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { HotModuleReplacementPlugin } = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

// const createReloadPlugin = require('electron-reload-webpack-plugin');
// const ElectronReloadPlugin = createReloadPlugin({
//     path: __dirname,
// });
const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
    target: 'web',
    entry: [
        isDevelopment && 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
        './src/index.tsx'
    ].filter(Boolean),
    mode: isDevelopment ? 'development' : 'production',
    output: {
        path: path.join(__dirname, 'output'),
        // filename: 'app.bundle.js'
        // filename: '[filename].[fullhash].[ext]'
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: 'public',
                    to: '',
                    globOptions: {
                        ignore: ['**/index.html']
                    }
                },
            ]
        }),
        new HtmlWebpackPlugin({
            filename: './index.html',
            template: './public/index.html',
        }),
        isDevelopment && new ReactRefreshWebpackPlugin(),
        isDevelopment && new HotModuleReplacementPlugin()
        // ElectronReloadPlugin()
    ].filter(Boolean),
    module: {
        rules: [
            {
                test: /\.(jsx?|tsx?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            envName: process.env.NODE_ENV
                        }
                    }
             ]
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                            import: false
                        }
                    },
                    {
                        loader: 'postcss-loader'
                    }
                ]
            }
        ]
    },
    resolve: {
        // Webpack is big dumb-dumb and doesn't recognize typescript by default
        extensions: [
            '.tsx',
            '.ts',
            '.js',
            '.json'
        ],
    },
    // Persistent cache
    cache: {
        type: 'filesystem',
        buildDependencies: {
            // Invalidate cache when webpack.config.js is changed
            config: [__filename],
        },
    },
    devtool: isDevelopment ? 'source-map' : false,
    // devServer: {
    //     hot: true,
    //     client: {
    //         overlay: false
    //     }
    // }
};
