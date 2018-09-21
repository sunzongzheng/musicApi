import assert from 'assert'
import {netease} from '../src/app'
import fly from 'flyio'
import {neteaseMusic} from "./util"

describe('网易云', () => {
    const params = {
        keyword: '薛之谦',
        offset: 0
    }
    it('搜索歌曲 & 有30首歌', async () => {
        const data = await netease.searchSong(params)
        assert.equal(true, data.status)
        assert.equal(true, data.data.songs.length === 30)
    })
    it('获取歌曲地址 & 歌曲地址可连通', async () => {
        const data = await netease.getSongUrl(neteaseMusic.id)
        const {status} = await fly.get(data.data.url)
        assert.equal(true, data.status)
        assert.equal(true, status === 200 || status === 201)
    })
    it('获取歌词 & 歌词有内容', async () => {
        const data = await netease.getLyric(neteaseMusic.translateLyricId)
        assert.equal(true, data.status)
        assert.equal(true, data.data.lyric.length > 0)
        assert.equal(true, data.data.translate.length > 0)
    })
    it('获取新歌榜', async () => {
        const {data} = await netease.getTopList("0")
        assert.equal(true, data.list.length >= 30)
    })
    it('获取热歌榜', async () => {
        const {data} = await netease.getTopList("1")
        assert.equal(true, data.list.length >= 30)
    })
    it('获取网易原创歌曲榜', async () => {
        const {data} = await netease.getTopList("2")
        assert.equal(true, data.list.length >= 30)
    })
    it('获取飙升榜', async () => {
        const {data} = await netease.getTopList("3")
        assert.equal(true, data.list.length >= 30)
    })
    it('获取歌曲评论', async () => {
        const data = await netease.getComment(neteaseMusic.id, 1, 1)
        assert.equal(true, data.status)
        assert.equal(true, data.data.comments.length > 0)
    })
    it('获取歌手详情', async () => {
        const {data, status} = await netease.getArtistSongs(neteaseMusic.artistId)
        assert.equal(true, status)
        assert.equal(true, data.songs.length > 0)
    })
})