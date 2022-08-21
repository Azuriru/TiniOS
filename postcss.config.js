module.exports = {
    plugins: [
        require('autoprefixer'),
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('postcss-selector-matches')({
            lineBreak: true
        })
    ]
};
