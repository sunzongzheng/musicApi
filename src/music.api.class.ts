/// <reference path="./types/flyio.d.ts"/>

import EngineWrapper from "flyio/dist/npm/engine-wrapper"
import { Err } from './utils'

export enum br {
    none = 0,
    normal = 128,
    high = 320,
    max = 999
}

export enum vendor {
    netease = 'netease',
    qq = 'qq',
    xiami = 'xiami'
}

export enum searchType {
    song = 'song',
    album = 'album',
    singer = 'singer',
    playlist = 'playlist',
    user = 'user'
}

interface songInfo {
    id: number
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
    maxbr: br // 最大音质 0代表无音频资源
    mv: number | string | null
    vendor: vendor
}

interface lyric_item {
    
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

    protected checkBr(br: number) {
        if(![128, 320, 999].includes(br)) {
            throw new Err({
                msg: 'br错误',
                log: br
            })
        }
    }

    abstract search({ keyword, limit, page, type }: {
        keyword: string, // 搜索关键词
        limit?: number, // 页大小
        page?: number, // 页数 > 0
        type?: searchType
    }): Promise<{
        total: number,
        songs: Array<songInfo>
    }>

    abstract getSongDetail(ids: Array<number>): Promise<Array<songInfo>>

    abstract getSongUrl(id: number, br?: br): Promise<string>

    // abstract getLyric(id: number): Promise<{
    //     lyric: Array<lyric_item>
    // }>
}