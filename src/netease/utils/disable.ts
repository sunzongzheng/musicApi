// getRestrictLevel方法 来源于网易云音乐web端代码
function getRestrictLevel(bm5r: any, fC7v: any) {
    if (!bm5r)
        return 0;
    if (bm5r.program)
        return 0;
    if (fC7v) {
        if (fC7v.st != null && fC7v.st < 0) {
            return 100
        }
        if (fC7v.fee > 0 && fC7v.fee != 8 && fC7v.payed == 0 && fC7v.pl <= 0)
            return 10;
        if (fC7v.fee == 16 || fC7v.fee == 4 && fC7v.flag & 2048)
            return 11;
        if ((fC7v.fee == 0 || fC7v.payed) && fC7v.pl > 0 && fC7v.dl == 0)
            return 1e3;
        if (fC7v.pl == 0 && fC7v.dl == 0)
            return 100;
        return 0
    } else {
        var eA7t = bm5r.status != null ? bm5r.status : bm5r.st != null ? bm5r.st : 0;
        if (bm5r.status >= 0)
            return 0;
        if (bm5r.fee > 0)
            return 10;
        return 100
    }
}

// 来自网易云前端 l2x.qA8s
function qA8s(fB4F: any) {
    if (fB4F.st != null && fB4F.st < 0) {
        return 100
    }
    if (fB4F.fee > 0 && fB4F.fee != 8 && fB4F.payed == 0 && fB4F.pl <= 0)
        return 10;
    if (fB4F.fee == 16 || fB4F.fee == 4 && fB4F.flag & 2048)
        return 11;
    if ((fB4F.fee == 0 || fB4F.payed) && fB4F.pl > 0 && fB4F.dl == 0)
        return 1e3;
    if (fB4F.pl == 0 && fB4F.dl == 0)
        return 100;
    return 0
}
// 判断是否被版权限制
export default function disable(song: any, privilege: any) {
    return getRestrictLevel(song, privilege) === 100 || qA8s(privilege) === 10
}