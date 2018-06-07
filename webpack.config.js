const path = require('path')

module.exports = {
    mode: 'production',
    entry: {
        'app.native': './src/app.native.js',
        'app.web': './src/app.web.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
    }
}