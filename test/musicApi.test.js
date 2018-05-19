import musicApi from '../src/app'
import assert from 'assert'
import {neteaseMusic, qqMusic, xiamiMusic} from './util'
import fly from 'flyio'

describe('musicApi', () => {

    it('搜索歌曲 & 每个歌曲来源均有30首歌', async () => {
        const {data, status} = await musicApi.searchSong('薛之谦')
        assert.equal(true, status)
        assert.equal(true, data.netease.songs.length === 30)
        assert.equal(true, data.qq.songs.length === 30)
        assert.equal(true, data.xiami.songs.length === 30)
    })

    it('获取歌曲详情 网易云', async () => {
        const {status} = await musicApi.getSongDetail('netease', neteaseMusic.id)
        assert.equal(true, status)
    })
    it('获取歌曲详情 QQ音乐', async () => {
        const {status} = await musicApi.getSongDetail('qq', qqMusic.id)
        assert.equal(true, status)
    })
    it('获取歌曲详情 虾米音乐', async () => {
        const {status} = await musicApi.getSongDetail('xiami', xiamiMusic.id)
        assert.equal(true, status)
    })

    it('获取歌曲地址 & 歌曲地址可连通 网易云', async () => {
        const data = await musicApi.getSongUrl('netease', neteaseMusic.id)
        const {status} = await fly.get(data.data.url)
        assert.equal(true, data.status)
        assert.equal(true, status === 200 || status === 201)
    })
    it('获取歌曲地址 & 歌曲地址可连通 QQ音乐', async () => {
        const data = await musicApi.getSongUrl('qq', qqMusic.id)
        const {status} = await fly.get(data.data.url)
        assert.equal(true, data.status)
        assert.equal(true, status === 200 || status === 201)
    })
    it('获取歌曲地址 & 歌曲地址可连通 虾米音乐', async () => {
        const data = await musicApi.getSongUrl('xiami', xiamiMusic.id)
        const {status} = await fly.get('http:' + data.data.url)
        assert.equal(true, data.status)
        assert.equal(true, status === 200 || status === 201)
    })

    it('获取歌词 & 歌词有内容 网易云', async () => {
        const data = await musicApi.getLyric('netease', neteaseMusic.id)
        assert.equal(true, data.status)
        assert.equal(true, data.data.length > 0)
    })
    it('获取歌词 & 歌词有内容 QQ音乐', async () => {
        const data = await musicApi.getLyric('qq', qqMusic.id)
        assert.equal(true, data.status)
        assert.equal(true, data.data.length > 0)
    })
    it('获取歌词 & 歌词有内容 虾米音乐', async () => {
        const data = await musicApi.getLyric('xiami', xiamiMusic.id)
        assert.equal(true, data.status)
        assert.equal(true, data.data.length > 0)
    })

    it('获取歌词评论 网易云', async () => {
        const data = await musicApi.getComment('netease', neteaseMusic.commentId, 0, 1)
        assert.equal(true, data.status)
        assert.equal(true, data.data.comments.length > 0)
    })
    it('获取歌词评论 QQ音乐', async () => {
        const data = await musicApi.getComment('qq', qqMusic.commentId, 0, 1)
        assert.equal(true, data.status)
        assert.equal(true, data.data.comments.length > 0)
    })
    it('获取歌词评论 虾米音乐', async () => {
        const data = await musicApi.getComment('xiami', xiamiMusic.commentId, 0, 1)
        assert.equal(true, data.status)
        assert.equal(true, data.data.comments.length > 0)
    })

})