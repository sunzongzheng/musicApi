import assert from 'assert'
import {netease} from '../src/app'
import fly from 'flyio'

describe('网易云', () => {
    const params = {
        keyword: '周杰伦',
        limit: 30,
        offset: 0,
        type: 1
    }
    it('搜索歌曲 & 有30首歌', async () => {
        const data = await netease.searchSong(params)
        assert.equal(true, data.status)
        assert.equal(true, data.data.songs.length === 30)
    })
    it('获取歌曲地址 & 歌曲地址可连通', async () => {
        const songs = await netease.searchSong(params)
        const data = await netease.getSongUrl(songs.data.songs[0].id)
        const {status} = await fly.get(data.data.url)
        assert.equal(true, data.status)
        assert.equal(true, status === 200 || status === 201)
    })
    it('获取歌词 & 歌词有内容', async () => {
        const songs = await netease.searchSong(params)
        const data = await netease.getLyric(songs.data.songs[0].id)
        assert.equal(true, data.status)
        assert.equal(true, data.data.length > 0)
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
    it('获取歌词评论', async () => {
        const songs = await netease.searchSong(params)
        const data = await netease.getComment(songs.data.songs[0].commentId, 0, 1)
        assert.equal(true, data.status)
        assert.equal(true, data.data.comments.length > 0)
    })
})