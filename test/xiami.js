import assert from 'assert'
import xiami from '../src/xiami'
import axios from 'axios'

describe('虾米音乐', () => {
    const params = {
        keyword: '周杰伦',
        limit: 30,
        offset: 0
    }
    it('搜索歌曲 & 有30首歌', async () => {
        const data = await xiami.searchSong(params)
        assert.equal(true, data.status)
        assert.equal(true, data.data.songs.length === 30)
    })
    it('获取歌曲地址 & 歌曲地址可连通', async () => {
        const songs = await xiami.searchSong(params)
        const data = await xiami.getSongUrl(songs.data.songs[0].id)
        const {status} = await axios("http:"+ data.data.url)
        assert.equal(true, status === 200 || status === 201)
    })
    it('获取歌词 & 歌词有内容', async () => {
        const songs = await xiami.searchSong(params)
        const data = await xiami.getLyric(songs.data.songs[0].id)
        assert.equal(true, data.status)
        assert.equal(true, data.data.length > 0)
    })
    it('获取歌词评论 & 评论不为空', async () => {
        const songs = await xiami.searchSong(params)
        const data = await xiami.getComment(songs.data.songs[0].commentId, 0, 1)
        assert.equal(true, data.status)
        assert.equal(true, data.data.comments.length > 0)
    })
})