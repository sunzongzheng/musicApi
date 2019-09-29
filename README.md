# music-api
- 对网易云、虾米音乐、QQ音乐统一封装
- 绝大部分来源于[Binaryify/NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)和[LIU9293/musicAPI](https://github.com/LIU9293/musicAPI)等
- 支持node、android、ios、react native、electron

# 注意事项
- 项目仍在开发阶段，即使是小版本之间也会出现不兼容，如用在`生产环境`，请写死版本号使用

# 安装
````js
yarn add @suen/music-api
````

# 引入
- node
    ````js
    import musicApi from '@suen/music-api'
    ````
- android、ios
  - 引入[js](https://github.com/sunzongzheng/musicApi/blob/master/dist/app.native.js)
  - 通过Fly注册并调用，详见[Fly文档](https://wendux.github.io/dist/#/doc/flyio/native)
  - 已在window下注册，webview内可直接使用window.musicApi
- react native
  - 安装依赖
    ````shell
    // 请使用yarn 经测试 使用npm可能会在装依赖时卡死
    yarn add react-native-crypto react-native-randombytes
    react-native link react-native-randombytes
    yarn add -D rn-nodeify@latest
    ./node_modules/.bin/rn-nodeify --hack --install --yarn // 执行到这一步时 请确定已安装 @suen/music-api
    ````
  - 通过以下代码引入
    ````js
    import './shim.js' // shim.js会生成在根目录下
    import musicApi from '@suen/music-api/dist/app.react-native'
    ````
- electron-render
    ````js
    // 主进程 引入nodeAdapter，避免被打包进渲染进程 如无这个需求 可直接在渲染进程中引入
    import nodeAdapter from 'flyio/src/adapter/node'
    global.nodeAdapter = nodeAdapter
    
    // 渲染进程
    import musicApiContructor from '@suen/music-api/dist/app.electron'
    const musicApi = musicApiContructor(require('electron').remote.getGlobal('nodeAdapter'))
    ````
- api server
    ````js
    // express
    import app from '@suen/music-api/src/express-app'
    app.listen(8080)
    
    // lean cloud
    import app from '@suen/music-api/src/lean-cloud-server'
    app.listen(process.env.LEANCLOUD_APP_PORT)
    ````
    
# 使用
- 函数调用
  ````js
  musicApi.searchSong('周杰伦')
    .then(data => {
        console.log(data)
    })
  musicApi.qq.searchSong({
    keyword: '周杰伦'
  })
    .then(data => {
        console.log(data)
    })
  ````
- api server调用
  - method: `GET`
  - query: 
    - vendor: enum('qq', 'netease', 'xiami')
    - method: 函数名
    - params: 参数 `JSON.stringfy([param1, param2])`
  - 通过这种方式调用请查看源代码，了解各个vendor的函数列表及参数
  - 示例：[https://suen-music-api.leanapp.cn/?vendor=qq&method=searchSong&params=\[{"keyword":"周杰伦"}\]](https://suen-music-api.leanapp.cn/?vendor=qq&method=searchSong&params=[{"keyword":"周杰伦"}])

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
        function getPlaylistDetail( vendor:歌曲来源, id:歌手id, offset:偏移页数, limit:页大小 ) {
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
