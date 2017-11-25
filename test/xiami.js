import assert from 'assert'
import xiami from '../src/xiami'
import axios from 'axios'

describe('虾米音乐', () => {
    const params = {
        keyword: '周杰伦',
        limit: 30,
        offset: 0,
        type: 1
    }
    it('搜索歌曲 & 有30首歌', async () => {
        const data = await xiami.searchSong(params)
        assert.equal(true, data.status)
        assert.equal(true, data.data.songs.length === 30)
    })
    it('获取歌曲地址 & 歌曲地址可连通', async () => {
        const songs = await xiami.searchSong(params)
        const data = await xiami.getSongUrl(songs.data.songs[0].id)
        const {status} = await axios(data.data.url)
        assert.equal(true, data.status)
        assert.equal(true, status === 200 || status === 201)
    })
    it('获取歌词 & 歌词有内容', async () => {
        const songs = await xiami.searchSong(params)
        const data = await xiami.getLyric(songs.data.songs[0].id)
        assert.equal(true, data.status)
        assert.equal(true, data.data.length > 0)
    })
})