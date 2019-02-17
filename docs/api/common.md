# 公共方法

## 搜索
````js
search({ keyword, limit, page, type }: {
    keyword: string, // 搜索关键词
    limit: number, // 页大小
    page: number, // 页数 > 0
    type: searchType
}): Promise<{
    total: number,
    songs: Array<songInfo>
}>
````

## 获取歌曲详情
````js
getSongDetail(ids: Array<number>): Promise<songInfo>
````