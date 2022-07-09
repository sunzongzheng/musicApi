import assert from 'assert'

interface meta {
    songId: number,
    artistId: number,
    playlistId: number,
    albumId: number,
    translateLyricId: number,
    vendor: string
}

export default function (api: axios, meta: meta) {
    const params = {
        keyword: '薛之谦',
    }
    it('qq searchSong', async () => {
        const data = await api.searchSong(params)
        assert.equal(true, data.songs.length === 30)
    })
}