# music-api [![Build Status](https://travis-ci.org/sunzongzheng/musicApi.svg?branch=master)](https://travis-ci.org/sunzongzheng/musicApi)
- 聚合各大音乐Api
- 绝大部分来源于[Binaryify/NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)和[LIU9293/musicAPI](https://github.com/LIU9293/musicAPI)等
- axios mocha

# 已涵盖
- 网易云音乐
- QQ音乐
- 虾米音乐

# 已完成
- 歌曲搜索
````js
function searchSong( { keyword='关键字' } ) {
    return {
        status:Boolean, // 请求是否成功
        data:{
            netease: Object,
            qq: Object,
            xiami: Object
        }
    }
}
````
- 歌曲url
````js
function getSongUrl( { vendor='歌曲来源',id='歌曲id' } ) {
    return {
        status: Boolean, // 请求是否成功
        data: {
            url:'歌曲地址'
        }
    }
}
````
- 歌曲歌词
````js
function getLyric( { vendor='歌曲来源',id='歌曲id' } ) {
    return {
        status: Boolean, // 请求是否成功
        data: Array, // 歌词数组
    }
}
````
# 客户端
- [x] [electron PC端](https://github.com/sunzongzheng/music)
- [ ] react native 移动端