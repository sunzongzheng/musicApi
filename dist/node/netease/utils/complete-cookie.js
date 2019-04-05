"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function randomString(pattern, length) {
    return Array.from(new Array(length), function () { return pattern[Math.floor(Math.random() * pattern.length)]; }).join('');
}
function completeCookie(cookie) {
    if (cookie === void 0) { cookie = ''; }
    var origin = cookie.split(/;\s*/).map(function (element) { return (element.split('=')[0]); }), extra = [];
    var now = (new Date).getTime();
    if (!origin.includes('JSESSIONID-WYYY')) {
        var expire = new Date(now + 1800000); //30 minutes
        var jessionid = randomString('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKMNOPQRSTUVWXYZ\\/+', 176) + ':' + expire.getTime();
        extra.push(['JSESSIONID-WYYY=' + jessionid, 'Expires=' + expire.toUTCString()]);
    }
    if (!origin.includes('_iuqxldmzr_')) {
        var expire = new Date(now + 157680000000); //5 years
        extra.push(['_iuqxldmzr_=32', 'Expires=' + expire.toUTCString()]);
    }
    if ((!origin.includes('_ntes_nnid')) || (!origin.includes('_ntes_nuid'))) {
        var expire = new Date(now + 3153600000000); //100 years
        var nnid = randomString('0123456789abcdefghijklmnopqrstuvwxyz', 32) + ',' + now;
        extra.push(['_ntes_nnid=' + nnid, 'Expires=' + expire.toUTCString()]);
        extra.push(['_ntes_nuid=' + nnid.slice(0, 32), 'Expires=' + expire.toUTCString()]);
    }
    return extra.map(function (x) { return x[0]; }).join('; ');
}
exports.default = completeCookie;
//# sourceMappingURL=complete-cookie.js.map