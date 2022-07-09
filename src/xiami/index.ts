/// <reference path="../types/flyio.d.ts"/>
import MusicApi from '../music.api.class'
import Fly from 'flyio/dist/npm/fly'
import setApi from './set-api'

export default class Xiami extends MusicApi {
    public Api: Fly
    constructor(adapter: any) {
        super(adapter)
        this.Api = new Fly(this.engine)
        setApi(this.Api)
    }

    private replaceImage(url = '') {
        return url.replace('http', 'https').replace('_1.jpg', '_4.jpg').replace('_1.png', '_4.png')
    }
    private getMusicInfo(info: any) {
        const purviewRoleVOs = info.purviewRoleVOs
        const brObject: { [key: string]: string } = {}
        purviewRoleVOs.forEach((item: any) => {
            brObject[item.quality] = item.isExist
        })
        const maxbr = brObject.s ? 999 : (brObject.h ? 320 : 128)
        return {
            album: {
                id: info.albumId,
                name: info.albumName,
                cover: this.replaceImage(info.albumLogo)
            },
            artists: [{
                id: info.artistId,
                name: info.artistName
            }],
            name: info.songName,
            songId: info.songId,
            cp: !info.listenFiles.length,
            maxbr,
            mv: info.mvId || null,
            vendor: 'xiami'
        }
    }

    async search({ keyword = '', limit = 30, page = 1, type = 'song' }) {
        const params = {
            key: keyword,
            pagingVO: {
                page,
                pageSize: limit
            }
        }
        const { songs, pagingVO }: any = await this.Api.get('/search/searchSongs', params, {
            webApi: true
        })
        return {
            total: pagingVO.count,
            songs: songs.map((item: any) => this.getMusicInfo(item))
        }
    }
    async getSongDetail(ids: Array<number>, raw = false) {
        this.checkId(ids)
        const data: any = await this.Api.get('mtop.alimusic.music.songservice.getsongs', {
            songIds: ids
        })
        return raw ? data : data.songs.map((song: any) => this.getMusicInfo(song))
    }

    async getSongUrl(id: number, br = 128) {
        this.checkBr(br)
        const data = await this.getSongDetail([id], true)
        const brObject: { [key: string]: any } = {}
        data.songs[0].listenFiles.forEach((item: any) => {
            brObject[item.quality] = item.listenFile
        })
        switch (br) {
            case 128:
                return brObject.l
            case 320:
                return brObject.h
            case 999:
                return brObject.s
            default:
                return ''
        }
    }
}