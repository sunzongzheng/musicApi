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
        const {status} = await fly.get(data.data.url)
        assert.equal(true, data.status)
        assert.equal(true, status === 200 || status === 201)
    })

    it('获取歌词 & 歌词有内容 网易云', async () => {
        const data = await musicApi.getLyric('netease', neteaseMusic.translateLyricId)
        assert.equal(true, data.status)
        assert.equal(true, data.data.lyric.length > 0)
        assert.equal(true, data.data.translate.length > 0)
    })
    it('获取歌词 & 歌词有内容 QQ音乐', async () => {
        const data = await musicApi.getLyric('qq', qqMusic.translateLyricId)
        assert.equal(true, data.status)
        assert.equal(true, data.data.lyric.length > 0)
        assert.equal(true, data.data.translate.length > 0)
    })
    it('获取歌词 & 歌词有内容 虾米音乐', async () => {
        const data = await musicApi.getLyric('xiami', xiamiMusic.translateLyricId)
        assert.equal(true, data.status)
        assert.equal(true, data.data.lyric.length > 0)
        assert.equal(true, data.data.translate.length > 0)
    })

    it('获取歌曲评论 网易云', async () => {
        const data = await musicApi.getComment('netease', neteaseMusic.id, 1, 1)
        assert.equal(true, data.status)
        assert.equal(true, data.data.comments.length > 0)
    })
    it('获取歌曲评论 QQ音乐', async () => {
        const data = await musicApi.getComment('qq', qqMusic.id, 1, 1)
        assert.equal(true, data.status)
        assert.equal(true, data.data.comments.length > 0)
    })
    it('获取歌曲评论 虾米音乐', async () => {
        const data = await musicApi.getComment('xiami', xiamiMusic.id, 1, 1)
        assert.equal(true, data.status)
        assert.equal(true, data.data.comments.length > 0)
    })
    it('获取歌手详情 网易云', async () => {
        const {data, status} = await musicApi.getArtistSongs('netease', neteaseMusic.artistId)
        assert.equal(true, status)
        assert.equal(true, data.songs.length > 0)
    })
    it('获取歌手详情 QQ音乐', async () => {
        const {data, status} = await musicApi.getArtistSongs('qq', qqMusic.artistId)
        assert.equal(true, status)
        assert.equal(true, data.songs.length > 0)
    })
    it('获取歌手详情 虾米音乐', async () => {
        const {data, status} = await musicApi.getArtistSongs('xiami', xiamiMusic.artistId)
        assert.equal(true, status)
        assert.equal(true, data.songs.length > 0)
    })
    it('获取专辑详情 网易云', async () => {
        const {data, status} = await musicApi.getAlbumDetail('netease', neteaseMusic.albumId)
        assert.equal(true, status)
    })
    it('获取专辑详情 QQ音乐', async () => {
        const {data, status} = await musicApi.getAlbumDetail('qq', qqMusic.albumId)
        assert.equal(true, status)
    })
    it('获取专辑详情 虾米音乐', async () => {
        const {data, status} = await musicApi.getAlbumDetail('xiami', xiamiMusic.albumId)
        assert.equal(true, status)
    })
})