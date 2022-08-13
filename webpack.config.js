const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
// const createReloadPlugin = require('electron-reload-webpack-plugin');
// const ElectronReloadPlugin = createReloadPlugin({
//     path: __dirname,
// });

module.exports = {
    target: 'web',
    entry: './src/index.tsx',
    output: {
        path: path.join(__dirname, 'output'),
        filename: 'app.bundle.js'
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: 'public',
                    to: ''
                }
            ]
        }),
        // ElectronReloadPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.(jsx?|tsx?)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
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
    devtool: 'source-map'
};
