import assert from 'assert'
import {xiami} from '../src/app'
import fly from 'flyio'
import {xiamiMusic} from "./util"

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
        const data = await xiami.getSongUrl(xiamiMusic.id)
        const {status} = await fly.get(data.data.url)
        assert.equal(true, status === 200 || status === 201)
    })
    it('获取歌词 & 歌词有内容', async () => {
        const data = await xiami.getLyric(xiamiMusic.translateLyricId)
        assert.equal(true, data.status)
        assert.equal(true, data.data.lyric.length > 0)
        assert.equal(true, data.data.translate.length > 0)
    })
    it('获取歌曲评论 & 评论不为空', async () => {
        const data = await xiami.getComment(xiamiMusic.id, 1, 1)
        assert.equal(true, data.status)
        assert.equal(true, data.data.comments.length > 0)
    })
    it('获取歌手详情', async () => {
        const {data, status} = await xiami.getArtistSongs(xiamiMusic.artistId)
        assert.equal(true, status)
        assert.equal(true, data.songs.length > 0)
    })
})