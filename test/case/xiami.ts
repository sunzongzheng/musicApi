import MusicApi from '../../src/music.api.class'
import commonTest from './common'

export const meta = {
    songId: 74204,
    artistId: 2629,
    playlistId: 412499071,
    albumId: 2100350206,
    translateLyricId: 2093450,
    vendor: 'xiami'
}

export default function (api: MusicApi) {
    describe('虾米音乐', () => {
        commonTest(api, meta)
        // it('获取歌曲地址 & 歌曲地址可连通', async () => {
        //     const data = await api.getSongUrl(xiamiMusic.id)
        //     const { status } = await fly.get(data.data.url)
        //     assert.equal(true, status === 200 || status === 201)
        // })
        // it('获取歌词 & 歌词有内容', async () => {
        //     const data = await api.getLyric(xiamiMusic.translateLyricId)
        //     assert.equal(true, data.status)
        //     assert.equal(true, data.data.lyric.length > 0)
        //     assert.equal(true, data.data.translate.length > 0)
        // })
        // it('获取歌曲评论 & 评论不为空', async () => {
        //     const data = await api.getComment(xiamiMusic.id, 1, 1)
        //     assert.equal(true, data.status)
        //     assert.equal(true, data.data.comments.length > 0)
        // })
        // it('获取歌手详情', async () => {
        //     const { data, status } = await api.getArtistSongs(xiamiMusic.artistId)
        //     assert.equal(true, status)
        //     assert.equal(true, data.songs.length > 0)
        // })
    })
}