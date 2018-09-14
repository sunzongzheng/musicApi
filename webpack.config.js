const path = require('path')

module.exports = [
    {
        mode: 'production',
        entry: {
            'app.native': './src/app.native.js',
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
        target: "electron-renderer"
    }
]