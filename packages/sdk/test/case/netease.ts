import MusicApi from '../../src/music.api.class'
import commonTest from './common'

export const meta = {
    songId: 27808044,
    artistId: 11127,
    playlistId: 483222600,
    albumId: 29597,
    translateLyricId: 3026472,
    vendor: 'netease'
}

export default function (api: MusicApi) {
    describe('网易云', () => {
        commonTest(api, meta)
        // it('获取歌曲地址 & 歌曲地址可连通', async () => {
        //     const data = await api.getSongUrl(neteaseMusic.id)
        //     const {status} = await fly.get(data.data.url)
        //     assert.equal(true, data.status)
        //     assert.equal(true, status === 200 || status === 201)
        // })
        // it('获取歌词 & 歌词有内容', async () => {
        //     const data = await api.getLyric(neteaseMusic.translateLyricId)
        //     assert.equal(true, data.status)
        //     assert.equal(true, data.data.lyric.length > 0)
        //     assert.equal(true, data.data.translate.length > 0)
        // })
        // it('获取新歌榜', async () => {
        //     const {data} = await api.getTopList("0")
        //     assert.equal(true, data.list.length >= 30)
        // })
        // it('获取热歌榜', async () => {
        //     const {data} = await api.getTopList("1")
        //     assert.equal(true, data.list.length >= 30)
        // })
        // it('获取网易原创歌曲榜', async () => {
        //     const {data} = await api.getTopList("2")
        //     assert.equal(true, data.list.length >= 30)
        // })
        // it('获取飙升榜', async () => {
        //     const {data} = await api.getTopList("3")
        //     assert.equal(true, data.list.length >= 30)
        // })
        // it('获取歌曲评论', async () => {
        //     const data = await api.getComment(neteaseMusic.id, 1, 1)
        //     assert.equal(true, data.status)
        //     assert.equal(true, data.data.comments.length > 0)
        // })
        // it('获取歌手详情', async () => {
        //     const {data, status} = await api.getArtistSongs(neteaseMusic.artistId)
        //     assert.equal(true, status)
        //     assert.equal(true, data.songs.length > 0)
        // })
    })
}