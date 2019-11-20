

export default function (instance) {
    const getMusicInfo = (info) => {
        console.log(info)
        const file = info
        return {
            album: {
                id: info.albumId,
                name: info.albumName,
                cover: info.cover
            },
            artists: info.singerName.split(',').map((name,index) => {
                return {
                    id: info.singerId.split(',')[index],
                    name: name
                }
            }),
            name: info.songName,
            link: info.mp3,
            id: info.id,
            cp: info.copyrightId,
            dl: true,
            quality: {
                // 只有64?
                192: false,
                320: false,
                999: false
            },
            //TODO mv: info.hasMv 等于1的时候有mv || null,
            mv: null,
            vendor: 'migu'
        }
    }
    return {
        instance,
        async searchSong({keyword, limit = 30, offset = 0, type = 2}) {
            const params = {
                pgc: offset + 1,
                rows: limit,
                keyword: keyword,
                type:type
            }
            try {
                let data = await instance.get('/migu/remoting/scr_search_tag', params)
                return {
                    status: true,
                    data: {
                        total: data.musics.length,
                        songs: data.musics.map(item => getMusicInfo(item))
                    }
                }
            } catch (e) {
                return e
            }
        },

    }
}
