"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// getRestrictLevel方法 来源于网易云音乐web端代码
function getRestrictLevel(bm5r, fC7v) {
    if (!bm5r)
        return 0;
    if (bm5r.program)
        return 0;
    if (fC7v) {
        if (fC7v.st != null && fC7v.st < 0) {
            return 100;
        }
        if (fC7v.fee > 0 && fC7v.fee != 8 && fC7v.payed == 0 && fC7v.pl <= 0)
            return 10;
        if (fC7v.fee == 16 || fC7v.fee == 4 && fC7v.flag & 2048)
            return 11;
        if ((fC7v.fee == 0 || fC7v.payed) && fC7v.pl > 0 && fC7v.dl == 0)
            return 1e3;
        if (fC7v.pl == 0 && fC7v.dl == 0)
            return 100;
        return 0;
    }
    else {
        var eA7t = bm5r.status != null ? bm5r.status : bm5r.st != null ? bm5r.st : 0;
        if (bm5r.status >= 0)
            return 0;
        if (bm5r.fee > 0)
            return 10;
        return 100;
    }
}
// 判断是否被版权限制
function disable(song, privilege) {
    return getRestrictLevel(song, privilege) === 100;
}
exports.default = disable;
//# sourceMappingURL=disable.js.map