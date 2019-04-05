# 数据结构

## vendor
````ts
enum vendor {
    netease = 'netease',
    qq = 'qq',
    xiami = 'xiami'
}
````

## songInfo
````ts
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
    maxbr: br // 最大音质
    mv: number | string | null
    vendor: vendor
}
````

## br
````ts
enum br {
    normal = 128,
    high = 320,
    max = 999
}
````