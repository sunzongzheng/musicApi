/// <reference path="../types/flyio.d.ts"/>
import MusicApi from '../music.api.class'
import Fly from 'flyio/dist/npm/fly'
import setApi from './set-api'

export default class QQ extends MusicApi {
    public Api: Fly
    constructor(adapter: any) {
        super(adapter)
        this.Api = new Fly(this.engine)
        setApi(this.Api)
    }

    private getMusicInfo(song: any) {
        const file = song.file
        let maxbr = 128
        if (song.file.size_flac) {
            maxbr = 999
        } else if (file.size_320 || file.size_320mp3) {
            maxbr = 320
        }
        return {
            album: {
                id: song.album.id,
                name: song.album.name,
                cover: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${song.album.mid}.jpg`,
            },
            artists: song.singer.map((singer: any) => {
                return {
                    id: singer.id,
                    name: singer.name
                }
            }),
            name: song.title,
            songId: song.id,
            cp: !song.id || song.action.msg === 3 || !song.interval,
            maxbr,
            mv: song.mv.vid || null,
            vendor: 'qq'
        }
    }

    async search({ keyword = '', limit = 30, page = 1, type = 'song' }) {
        const params = {
            p: page,
            n: limit,
            w: keyword,
            ct: 24,
            remoteplace: 'txt.yqq.song',
            aggr: 1,
            cr: 1,
            lossless: 0,
        }
        const data = await this.Api.get('/soso/fcgi-bin/client_search_cp', params)
        return {
            total: data.data.song.totalnum,
            songs: data.data.song.list.map((item: any) => this.getMusicInfo(item))
        }
    }

    async getSongDetail(ids: Array<number>, raw = false) {
        this.checkId(ids)
        const { data } = await this.Api.get('/v8/fcg-bin/fcg_play_single_song.fcg', {
            songid: ids.join(','),
            tpl: 'yqq_song_detail',
        })
        return raw ? data : data.map((item: any) => this.getMusicInfo(item))
    }

    async getMid(id: number) {
        const detailInfo = await this.getSongDetail([id], true)
        return detailInfo[0].mid
    }

    async getSongUrl(id: number, br = 128) {
        this.checkBr(br)
        const guid = Math.floor(Math.random() * 1000000000)
        const {key} = await this.Api.get('/base/fcgi-bin/fcg_musicexpress.fcg', {
            json: 3,
            guid: guid
        })
        const mid = await this.getMid(id)
        switch (br) {
            case 128:
                return `http://isure.stream.qqmusic.qq.com/M500${mid}.mp3?vkey=${key}&guid=${guid}&fromtag=30`
            case 320:
                return `http://isure.stream.qqmusic.qq.com/M800${mid}.mp3?vkey=${key}&guid=${guid}&fromtag=30`
            case 999:
                return `http://isure.stream.qqmusic.qq.com/F000${mid}.flac?vkey=${key}&guid=${guid}&fromtag=54`
            default:
                return ''
        }
    }
}