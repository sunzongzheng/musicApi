# Music Api

## 聚合音乐接口SDK
- 涵盖平台：网易云音乐、QQ音乐、虾米音乐
- 支持环境：`NodeJS`、`Electron`、`Android`、`iOS`
- 示例项目：[PC](https://github.com/sunzongzheng/music)、[Android](https://github.com/caiyonglong/MusicLake)

### 使用方法
- NodeJS / Electron：
````bash
// 安装
npm i @suen/music-api # npm
yarn add @suen/music-api # yarn

// NodeJS
import MusicApi from '@suen/music-api'
// Electon
import createApi from '@suen/music-api/dist/custom-adapter'
import nodeAdapter from 'flyio/src/adapter/node'
const MusicApi = createApi(nodeAdapter)
````
- Android / iOS:
````bash
// 安装

// 使用

````