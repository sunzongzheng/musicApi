# music-api
## 请注意，当前分支是正在开发的v2版本，当前可用的最新版本为[v1](https://github.com/sunzongzheng/musicApi/tree/master)
- 对网易云、虾米音乐、QQ音乐统一封装
- 绝大部分来源于[Binaryify/NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)和[LIU9293/musicAPI](https://github.com/LIU9293/musicAPI)等
- Node >= 8
- 支持 NodeJS / 安卓 / iOS / Electron

## 安装
NodeJS
````bash
npm i @suen/music-api # npm
yarn add @suen/music-api # yarn
````
Android / iOS
  - 引入js
  - 通过Fly调用，详见[Fly文档](https://wendux.github.io/dist/#/doc/flyio/native)
  - 已在window下注册，可直接通过window.musicApi调用

## Api文档
地址：[https://sunzongzheng.github.io/musicApi/](https://sunzongzheng.github.io/musicApi/)

## 开发
````bash
git clone https://github.com/sunzongzheng/musicApi.git
yarn dev # yarn
npm run dev # npm
````

## 贡献代码