const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    // target: 'electron-main',
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'output'),
        filename: 'app.bundle.js'
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'src/assets', to: 'assets' },
                { from: 'src/html/index.html', to: '' }
            ]
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    useBuiltIns: 'usage',
                                    corejs: 3
                                }
                            ],
                        ],
                        plugins: [
                            'bynport-directory'
                            // ['babel-plugin-import-dir'],
                            // ['wildcard', {
                            //     exts: ['js', 'jsx', 'es6', 'es', 'ts', 'tsx', '']
                            // }]
                        ]
                    }
                }
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
                            url: false
                        }
                    },
                    {
                        loader: 'postcss-loader'
                    }
                ]
            },
            {
                test: /\.s[ac]ss$/i,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: ['file-loader']
            }
        ]
    },
    devtool: 'source-map'
};