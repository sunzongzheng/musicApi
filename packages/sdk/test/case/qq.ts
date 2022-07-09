import commonTest from './common'

export const meta = {
    songId: 5106429,
    artistId: 2,
    playlistId: 2890182907,
    albumId: 1458791,
    translateLyricId: 432263,
    vendor: 'qq'
}

export default function (api: axios) {
    describe('QQ音乐', () => {
        commonTest(api, meta)
        // it('获取歌曲地址 & 歌曲地址可连通', async () => {
        //     const data = await api.getSongUrl(qqMusic.id)
        //     const {status} = await fly.get(data.data.url)
        //     assert.equal(true, data.status)
        //     assert.equal(true, status === 200 || status === 201)
        // })
        // it('获取歌词 & 歌词有内容', async () => {
        //     const data = await api.getLyric(qqMusic.translateLyricId)
        //     assert.equal(true, data.status)
        //     assert.equal(true, data.data.lyric.length > 0)
        //     assert.equal(true, data.data.translate.length > 0)
        // })
        // it('获取歌曲评论 & 评论不为空', async () => {
        //     const data = await api.getComment(qqMusic.id, 1, 1)
        //     assert.equal(true, data.status)
        //     assert.equal(true, data.data.comments.length > 0)
        // })
        // it('获取歌手详情', async () => {
        //     const {data, status} = await api.getArtistSongs(qqMusic.artistId)
        //     assert.equal(true, status)
        //     assert.equal(true, data.songs.length > 0)
        // })
        // it('获取歌手列表', async () => {
        //     const {data, status} = await api.getArtists()
        //     assert.equal(true, status)
        //     assert.equal(true, data.singerlist.length > 0)
        // })
    })
}