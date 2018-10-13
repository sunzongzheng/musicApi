declare module '@suen/music-api' {

    interface album {
        id: number | string
        name: string
        cover: string
    }

    interface artist {
        id: number | string
        name: string
    }

    interface musicInfo {
        id: number | string
        name: string
        album: album
        artists: Array<artist>
        commentId: number | string
        cp: boolean
        dl: boolean
        quality: {
            192: boolean,
            320: boolean,
            999: boolean
        }
    }

    interface errorResult {
        status: false
        msg: string
        log: any
    }

    interface searchSongResult {
        total: number
        songs: Array<musicInfo>
    }

    interface searchSongOptions {
        keyword: string
        limit: number
        offset: number
        type?: number
    }

    interface getSongDetailResult {
        status: true,
        data: musicInfo
    }

    interface getBatchSongDetailResult {
        status: true,
        data: Array<musicInfo>
    }

    interface getArtistSongsResult {
        status: true,
        data: {
            detail: {
                id: number | string,
                name: string,
                avatar: string,
                desc: string
            },
            songs: Array<musicInfo>
        }
    }

    interface getAlbumSongsResult {
        status: true,
        data: {
            detail: {
                id: number | string,
                name: string,
                cover: string,
                desc: string
            },
            songs: Array<musicInfo>
        }
    }

    enum qqSongLever {
        high,
        normal,
        low
    }

    interface getSongUrlResult {
        status: true
        data: {
            url: string
        }
    }

    interface getLyricResult {
        status: true
        data: Array<string>[]
    }

    interface qqCommentInfo {
        avatarurl: string
        nick: string
        rootcommentcontent: string
    }

    interface getCommentResult {
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

    interface getTopListResult {
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


    interface musicApiSearchSongResult {
        status: true,
        data: {
            netease: searchSongResult,
            qq: searchSongResult,
            xiami: searchSongResult
        }
    }

    export function searchSong(keyword: string, offset?: number): Promise<musicApiSearchSongResult | errorResult>

    enum vendor {
        netease = 'netease',
        qq = 'qq',
        xiami = 'xiami'
    }

    export function getSongDetail(vendor: vendor, id: number | string): Promise<getSongDetailResult | errorResult>

    export function getSongUrl(vendor: vendor, id: number | string): Promise<getSongUrlResult | errorResult>

    export function getLyric(vendor: vendor, id: number | string): Promise<getLyricResult | errorResult>

    export function getTopList(id: string): Promise<getTopListResult | errorResult>

    export function getComment(vendor: vendor, id: number | string, offset?: number, limit?: number): Promise<getCommentResult | errorResult>

    export function getBatchSongDetail(vendor: vendor, ids: Array<number | string>): Promise<getBatchSongDetailResult | errorResult>

    export function getArtistSongs(vendor: vendor, ids: number | string, offset?: number, limit?: number): Promise<getArtistSongsResult | errorResult>

    export function getAlbumSongs(vendor: vendor, ids: number | string, offset?: number, limit?: number): Promise<getAlbumSongsResult | errorResult>

    export function getAnyVendorSongDetail(list: Array<{vendor: vendor, id: number}>) : Promise<Array<musicInfo>>
}