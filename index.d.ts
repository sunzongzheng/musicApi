declare module 'music-api' {

    export interface album {
        id: number | string
        name: string
        cover: string
    }

    export interface artist {
        id: number | string
        name: string
    }

    export interface musicInfo {
        id: number | string
        name: string
        album: album
        artists: Array<artist>
        commentId: number | string
        cp: boolean
    }

    export interface errorResult {
        status: false
        msg: string
        log: any
    }

    export interface searchSongResult {
        total: number
        songs: Array<musicInfo>
    }

    export interface searchSongOptions {
        keyword: string
        limit: number
        offset: number
        type?: number
    }

    export interface getSongDetailResult {
        status: true,
        data: musicInfo
    }

    enum qqSongLever {
        high,
        normal,
        low
    }

    export interface getSongUrlResult {
        status: true
        data: {
            url: string
        }
    }

    export interface getLyricResult {
        status: true
        data: Array<string>[]
    }

    export interface qqCommentInfo {
        avatarurl: string
        nick: string
        rootcommentcontent: string
    }

    export interface getCommentResult {
        status: true
        data: {
            hotComments: Array<qqCommentInfo>
            comments: Array<qqCommentInfo>
            total: number
        }
    }

    interface musicApiBase {
        searchSong(options: searchSongOptions): Promise<searchSongResult | errorResult>

        getSongDetail(id: number | string, getRaw?: boolean): Promise<getSongDetailResult | errorResult>

        getSongUrl(id: number | string, level?: qqSongLever): Promise<getSongUrlResult | errorResult>

        getLyric(id: number | string): Promise<getLyricResult | errorResult>

        getComment(commentId: number | string, pagenum: number, pagesize: number): Promise<getCommentResult | errorResult>
    }

    export interface qq extends musicApiBase {
    }

    export interface xiami extends musicApiBase {
        getXiamiToken(api: string): Promise<{ token: string, signedToken: string }>

        parseLocation(location: string): string
    }

    export interface getTopListResult {
        status: true
        data: {
            name: string,
            description: string,
            cover: string,
            playCount: number,
            list: Array<musicInfo>
        }
    }

    export interface netease extends musicApiBase {
        getTopList(id: number | string): Promise<getTopListResult | errorResult>
    }


    export interface musicApiSearchSongResult {
        status: true,
        data: {
            netease: searchSongResult,
            qq: searchSongResult,
            xiami: searchSongResult
        }
    }

    export function searchSong(keyword: string, offset?: number): Promise<musicApiSearchSongResult | errorResult>

    export enum vendor {
        netease,
        qq,
        xiami
    }

    export function getSongDetail(vendor: vendor, id: number | string): Promise<getSongDetailResult | errorResult>

    export function getSongUrl(vendor: vendor, id: number | string): Promise<getSongUrlResult | errorResult>

    export function getLyric(vendor: vendor, id: number | string): Promise<getLyricResult | errorResult>

    export function getTopList(id: string): Promise<getTopListResult | errorResult>

    export function getComment(vendor: vendor, id: number | string, offset?: number, limit?: number): Promise<getCommentResult | errorResult>
}