# music-api
- 对网易云、虾米音乐、QQ音乐统一封装
- 绝大部分来源于[Binaryify/NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)和[LIU9293/musicAPI](https://github.com/LIU9293/musicAPI)等
- Node >= 6
- 支持安卓/ios/electron

# 注意事项
- 项目仍在开发阶段，即使是小版本之间也会出现不兼容，如用在`生产环境`，请写死版本号使用

# Usage
- node
    ````js
    npm install @suen/music-api
    
    import musicApi from '@suen/music-api'
    ````
- native
  - 引入[js](https://github.com/sunzongzheng/musicApi/blob/master/dist/app.native.js)
  - 通过Fly调用，详见[Fly文档](https://wendux.github.io/dist/#/doc/flyio/native)
  - 已在window下注册，可直接通过window.musicApi调用
  
# Api
- ## Common
    - 歌曲搜索
        ````js
        function searchSong( keyword:关键字, offset:偏移页数 ) {
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
        function getSongUrl( vendor:歌曲来源, id:歌曲id ) {
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
        function getLyric( vendor:歌曲来源, id:歌曲id ) {
            return {
                status: Boolean, // 请求是否成功
                data: Array, // 歌词数组
            }
        }
        ````
    - 歌曲评论
    
        **由于网易云、QQ音乐的`评论逻辑不一样`，`hotComments`及`comments`没有进行强封装**
        ````js
        function getComment( vendor:歌曲来源, id:歌曲id, page:页数, limit:页大小 ) {
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
    - 歌曲详情
    
        ````js
        function getSongDetail( vendor:歌曲来源, id:歌曲id ) {
            return {
                status: Boolean, // 请求是否成功
                data: {
                    album: {
                        id: Number | String,
                        name: String,
                        cover: String
                    },
                    artists: Array,
                    name: String,
                    id: Number,
                    cp: Boolean
                }
            }
        }
        ````
    - 批量获取歌曲详情
    
        注意事项： 
        - QQ音乐一次只能获取50条数据，不会去重
        - 网易云音乐未发现单次数量限制，会去重
        - 虾米音乐未发现单次数量限制，不会去重
        - `去重`的意思是 `重复的歌曲id，只会返回一次歌曲信息`
        ````js
        function getBatchSongDetail( vendor:歌曲来源, ids:歌曲id数组 ) {
            return {
                status: Boolean, // 请求是否成功
                data: [{
                    album: {
                        id: Number | String,
                        name: String,
                        cover: String
                    },
                    artists: Array,
                    name: String,
                    id: Number,
                    cp: Boolean
                }]
            }
        }
        ````
    - 歌手单曲
    
        注意事项：
        - 网易云没有分页，传页参数无效
        - 默认第一页，50条数据
    
        ````js
        function getArtistSongs( vendor:歌曲来源, id:歌手id, offset:偏移页数, limit:页大小 ) {
            return {
                status: Boolean, // 请求是否成功
                data: {
                    detail: {
                        id: Number | String,
                        name: String,
                        avatar: String,
                        desc: String
                    },
                    songs: [{
                       album: {
                           id: Number | String,
                           name: String,
                           cover: String
                       },
                       artists: Array,
                       name: String,
                       id: Number,
                       cp: Boolean
                   }]
                }
            }
        }
        ````
    - 歌单信息
    
        注意事项：
        - QQ音乐没有分页，传页参数无效;网易云可传limit;虾米可传全部页参数
        - 默认第一页，65535条数据
        
        ````js
        function getAlbumSongs( vendor:歌曲来源, id:歌手id, offset:偏移页数, limit:页大小 ) {
            return {
                status: Boolean, // 请求是否成功
                data: {
                    detail: {
                        id: Number | String,
                        name: String,
                        cover: String,
                        desc: String
                    },
                    songs: [{
                       album: {
                           id: Number | String,
                           name: String,
                           cover: String
                       },
                       artists: Array,
                       name: String,
                       id: Number,
                       cp: Boolean
                   }]
                }
            }
        }
        ````
        
    - 专辑信息
        
        ````js
        function getAlbumDetail( vendor:歌曲来源, id:专辑id ) {
            return {
                status: Boolean, // 请求是否成功
                data: {
                    name: String,
                    cover: String,
                    artist: {
                        id: Number,
                        name: String,
                    },
                    desc: String,
                    publishTime: Number,
                    songs: [{
                       album: {
                           id: Number | String,
                           name: String,
                           cover: String
                       },
                       artists: Array,
                       name: String,
                       id: Number,
                       cp: Boolean
                   }]
                }
            }
        }
        ````
    
- ## Difference
    - 网易云
        - 获取排行榜
        
            注意事项：排行榜id可传0-23
            
            ````js
            function getTopList( id:排行榜id ) {
                return {
                    status: Boolean, // 请求是否成功
                    data: {
                        name: '名称',
                        description: '简介',
                        cover: '封面',
                        playCount: '播放次数',
                        list: [{
                           album: {
                               id: Number | String,
                               name: String,
                               cover: String
                           },
                           artists: Array,
                           name: String,
                           id: Number,
                           cp: Boolean
                       }]
                    }
                }
            }
            ````
    - QQ音乐
        - 获取歌手列表
            
            注意事项：一页限制80条
            ````js
            function getArtists( offset : '偏移页数', { area = -100, sex = -100, genre = -100, index = -100 } ) {
                return {
                    status: Boolean, // 请求是否成功
                    data: {
                        area: '地区分类',
                        genre: '音乐分类',
                        index: '热门 + 首字母',
                        sex: '性别',
                        singerlist: [{
                           country: '地区分类',
                           singer_id: '歌手id',
                           singer_mid: '歌手mid',
                           singer_name: '歌手名',
                           singer_pic: '照片'
                        }],
                        tags: [{
                           area: [],
                           genre: [],
                           index: [],
                           sex: [],
                        }],
                        total: '总数量'
                    }
                }
            }
            ````