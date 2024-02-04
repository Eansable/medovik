const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env) => {

    const server = env.dev ? {
        static: './dist',
    } : {}

    return {
        mode: env.dev ? 'development' : 'production',
        entry: "./src/index.js",
        output: {
            filename: 'bundle.[contenthash].js',
            path: path.resolve(__dirname, 'dist'),
            clean: true,
        },
        devServer: server,
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: ['style-loader', 'css-loader'],
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
                    type: 'asset/resource',
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    type: 'asset/resource',
                },
                {
                    test: /\.html$/i,
                    loader: "html-loader",
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "./src/index.html"
            }),
        ],
        optimization: {
            splitChunks: {
                chunks: 'all',
            },
        },
    }
} 