/// <reference path="./types/flyio.d.ts"/>

import EngineWrapper from "flyio/dist/npm/engine-wrapper"
import { Err } from './utils'

enum maxbr {
    normal = 128,
    high = 320,
    max = 999
}

enum vendor {
    netease,
    qq,
    xiami
}

export enum searchType {
    song = 'song',
    album = 'album',
    singer = 'singer',
    playlist = 'playlist',
    user = 'user'
}

interface songInfo {
    songId: number
    name: string
    album: {
        id: number,
        name: string,
        cover: string
    }
    artists: Array<{
        id: number,
        name: string
    }>,
    cp: boolean // 是否有版权限制
    maxbr: maxbr // 最大音质
    mv: number | string | null
    vendor: vendor
}

export default abstract class MusicApi {
    public engine: any

    constructor(adapter: any) {
        this.engine = EngineWrapper(adapter)
    }

    protected checkId(id: any) {
        if (typeof id === 'undefined' || Array.isArray(id) && !id.length) {
            throw new Err('id不能为空')
        }
    }

    abstract search({ keyword, limit, page, type }: {
        keyword: string, // 搜索关键词
        limit: number, // 页大小
        page: number, // 页数 > 0
        type: searchType
    }): Promise<{
        total: number,
        songs: Array<songInfo>
    }>

    abstract getSongDetail(ids: Array<number>): Promise<songInfo>
}