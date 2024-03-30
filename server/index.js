const path = require('path');
const express = require('express');
const app = express();

const STATIC_PATH = path.join(path.dirname(__dirname), 'output');

app.use(express.static(STATIC_PATH));

app.get('*', (_, res) => {
    res.sendFile(path.join(STATIC_PATH, 'index.html'));
});

const server = app.listen(process.env.PORT || 3000, () => console.log(`Listening on port ${process.env.PORT || 3000}`));