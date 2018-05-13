# music-api
- 聚合各大音乐Api
- 绝大部分来源于[Binaryify/NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)和[LIU9293/musicAPI](https://github.com/LIU9293/musicAPI)等
- axios mocha

# 岂不是你啥都没做，就拷贝了两个仓库？:smirk:
- 获取 QQ音乐、虾米音乐的 歌词api
- 获取 QQ音乐、虾米音乐的 歌曲评论api
- 获取 QQ音乐、虾米音乐的 歌曲详情

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
- 歌曲评论

**由于网易云、QQ音乐的`评论逻辑不一样`，`hotComments`及`comments`没有进行强封装**
````js
function getComment( { vendor='歌曲来源',id='歌曲id',offset='偏移页数',limit='页大小' } ) {
    return {
        status: Boolean, // 请求是否成功
        data: {
            hotComments: Array, // 热评
            comments: Array, // 所有评论
            total: Number, //评论总数
        }
    }
}
````