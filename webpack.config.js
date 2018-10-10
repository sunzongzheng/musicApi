const path = require('path')

module.exports = [
    {
        mode: 'production',
        entry: {
            'app.native': './src/app.native.js',
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                            plugins: [
                                "@babel/plugin-transform-runtime",
                                "@babel/plugin-proposal-object-rest-spread"
                            ]
                        }
                    }
                }
            ]
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
        }
    }, {
        mode: 'production',
        entry: {
            'app.electron': './src/app.electron.js'
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            libraryTarget: 'umd'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                            plugins: [
                                "@babel/plugin-transform-runtime",
                                "@babel/plugin-proposal-object-rest-spread"
                            ]
                        }
                    }
                }
            ]
        },
        target: "electron-renderer"
    }
]