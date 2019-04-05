# 快速上手
## NodeJS / Electron
- 安装
````bash
npm i @suen/music-api # npm
yarn add @suen/music-api # yarn
````
- 使用
````js
// NodeJS
import MusicApi from '@suen/music-api'
// Electon
import createApi from '@suen/music-api/dist/custom-adapter'
import nodeAdapter from 'flyio/src/adapter/node'
const MusicApi = createApi(nodeAdapter)
````
## Android / iOS
````bash
// 安装

// 使用

````