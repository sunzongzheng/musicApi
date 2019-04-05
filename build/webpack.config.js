const path = require('path')
const rootPath = process.cwd()

module.exports = [
    {
        mode: 'production',
        entry: {
            'dsbridge': './src/dsbridge.ts',
        },
        output: {
            path: path.resolve(rootPath, 'dist'),
        },
        resolve: {
            extensions: [".ts", ".js"]
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'ts-loader'
                    }
                }
            ]
        },
    },
    {
        mode: 'production',
        entry: {
            'custom-adapter-web': './src/custom-adapter.ts'
        },
        output: {
            path: path.resolve(rootPath, 'dist'),
            libraryTarget: 'umd'
        },
        resolve: {
            extensions: [".ts", ".js"]
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'ts-loader'
                    }
                }
            ]
        }
    },
    {
        mode: 'production',
        entry: {
            'electron-renderer': './src/custom-adapter.ts'
        },
        output: {
            path: path.resolve(rootPath, 'dist'),
            libraryTarget: 'umd'
        },
        resolve: {
            extensions: [".ts", ".js"]
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'ts-loader'
                    }
                }
            ]
        },
        target: "electron-renderer"
    }
]