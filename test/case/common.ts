import assert from 'assert'
import MusicApi from '../../src/music.api.class'
import flyio from 'flyio'

interface meta {
    songId: number,
    artistId: number,
    playlistId: number,
    albumId: number,
    translateLyricId: number,
    vendor: string
}

export default function (api: MusicApi, meta: meta) {
    const params = {
        keyword: '薛之谦',
    }
    it('搜索歌曲 & 有30首歌', async () => {
        const data = await api.search(params)
        assert.equal(true, data.songs.length === 30)
    })
    it('获取歌曲详情', async () => {
        const data = await api.getSongDetail([meta.songId])
        assert.equal(1, data.length)
        const song = data[0]
        assert.equal(meta.vendor, song.vendor)
        assert.equal('number', typeof song.songId)
        assert.equal('string', typeof song.name)
        assert.equal('object', typeof song.album)
        assert.equal('string', typeof song.album.cover)
        assert.equal('object', typeof song.artists)
        assert.equal(true, song.artists.length > 0)
        assert.equal('boolean', typeof song.cp)
        assert.equal('number', typeof song.maxbr)
        assert.equal('string', typeof song.vendor)
    })
    it('获取url & 资源可连通', async () => {
        const data = await api.getSongUrl(meta.songId)
        assert.equal(true, data.startsWith('http'))
        // 取十个字节 足以判断
        await flyio.get(data, null, {
            headers: {
                'range': `bytes=0-10`
            }
        })
    })
}