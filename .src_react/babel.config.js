const presets = [
    ["@babel/preset-react", {
        // New JSX transform
        "development": process.env.NODE_ENV !== 'production',
        "runtime": "automatic"
    }],
    "@babel/preset-typescript"
];
const plugins = [
    // ["wildcard", {
    //     "exts": ["ts", "json"]
    // }],
    ["react-html-attrs"]
];

if (process.env.NODE_ENV !== 'production') {
    plugins.push(
        require.resolve('react-refresh/babel')
    );
}

module.exports = {
    presets,
    plugins
};
