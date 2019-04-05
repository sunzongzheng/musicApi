/// <reference path="../types/flyio.d.ts"/>
import MusicApi from '../music.api.class'
import Fly from 'flyio/dist/npm/fly'
import setApi from './set-api'
import disable from './utils/disable'

export default class Netease extends MusicApi {
    public Api: Fly
    constructor(adapter: any) {
        super(adapter)
        this.Api = new Fly(this.engine)
        setApi(this.Api)
    }

    private getMusicInfo(info: any, privilege: any = null) {
        if (!privilege) {
            privilege = info.privilege
        }
        return {
            album: {
                id: info.al.id,
                name: info.al.name,
                cover: info.al.picUrl
            },
            artists: info.ar.map((ar: any) => {
                return {
                    id: ar.id,
                    name: ar.name
                }
            }),
            name: info.name,
            songId: info.id,
            cp: disable(info, privilege),
            maxbr: privilege.maxbr,
            mv: info.mv || null,
            vendor: 'netease'
        }
    }

    async search({ keyword = '', limit = 30, page = 1, type = 'song' }) {
        const types: {
            [key: string]: number
        } = {
            song: 1,
            album: 10,
            singer: 100,
            playlist: 1000,
            user: 1002
        }
        const { result }: any = await this.Api.post('/weapi/cloudsearch/get/web', {
            csrf_token: '',
            limit,
            type: types[type],
            s: keyword,
            offset: page - 1,
        })
        return result ?
            {
                total: result.songCount,
                songs: result.songs.map((item: any) => this.getMusicInfo(item))
            } :
            {
                total: 0,
                songs: []
            }
    }

    async getSongDetail(ids: Array<number>) {
        this.checkId(ids)
        const data: any = await this.Api.post('/weapi/v3/song/detail', {
            c: JSON.stringify(ids.map(id => ({ id }))),
            ids: JSON.stringify(ids),
            csrf_token: ''
        })
        const privilegeObject: { [key: number]: any } = {}
        data.privileges.forEach((item: any) => {
            privilegeObject[item.id] = item
        })
        return data.songs.map((info: any) => this.getMusicInfo(info, privilegeObject[info.id]))
    }

    async getSongUrl(id: number, br = 128) {
        this.checkBr(br)
        br = br * 1000
        const params = {
            ids: [id],
            br,
            csrf_token: ''
        }
        const {data} = await this.Api.post('/weapi/song/enhance/player/url', params)
        return data[0].url
    }
}