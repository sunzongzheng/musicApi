module.exports = {
    title: 'Music Api 文档',
    description: '聚合音乐接口SDK',
    base: '/musicApi/',
    themeConfig: {
        repo: 'sunzongzheng/musicApi',
        docsDir: 'docs',
        editLinks: true,
        editLinkText: '帮助我们改善此页面！',
        sidebar: [
            '/guide/',
            {
                title: 'Api',
                children: [
                    '/api/common',
                    '/api/netease',
                    '/api/qq',
                    '/api/xiami',
                ]
            },
        ]
    }
}