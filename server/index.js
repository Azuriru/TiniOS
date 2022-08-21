const path = require('path');
const express = require('express');
const hotMiddleware = require('webpack-hot-middleware');
const devMiddleware = require('webpack-dev-middleware');
const { webpack } = require('webpack');
const app = express();
const webpackConfig = require('../webpack.config');

const STATIC_PATH = path.join(path.dirname(__dirname), 'output');

app.use(express.static(STATIC_PATH));

if (process.env.NODE_ENV !== 'production') {
    // Install webpack compiler and dev server via express middleware
    // This could have been done with just webpack-dev-server,
    // since the only thing we do is set writeToDisk to true
    // This makes it more flexible and with just one command,
    // but really I only did it this way because I didn't know
    // you could set devServer.writeToDisk via the config
    const compiler = webpack(webpackConfig);
    app.use(devMiddleware(compiler, {
        publicPath: webpackConfig.output.path,
        writeToDisk: true
    }));
    app.use(hotMiddleware(compiler, {
        log: false
    }));
}

app.get('/', (_, res) => {
    res.sendFile(path.join(STATIC_PATH, 'index.html'));
});

const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`Server live at http://localhost:${server.address().port}`);
});
