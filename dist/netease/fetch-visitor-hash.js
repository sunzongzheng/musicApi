"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fetch_visitor_hash;

var _util = require("../util");

const _ntes_hexcase = 0;
const _ntes_chrsz = 8;

function safe_add(e, t) {
  var r = (65535 & e) + (65535 & t),
      n = (e >> 16) + (t >> 16) + (r >> 16);
  return n << 16 | 65535 & r;
}

function bit_rol(e, t) {
  return e << t | e >>> 32 - t;
}

function md5_gg(e, t, r, n, i, o, a) {
  return md5_cmn(t & n | r & ~n, e, t, i, o, a);
}

function md5_hh(e, t, r, n, i, o, a) {
  return md5_cmn(t ^ r ^ n, e, t, i, o, a);
}

function md5_ii(e, t, r, n, i, o, a) {
  return md5_cmn(r ^ (t | ~n), e, t, i, o, a);
}

function md5_cmn(e, t, r, n, i, o) {
  return safe_add(bit_rol(safe_add(safe_add(t, e), safe_add(n, o)), i), r);
}

function md5_ff(e, t, r, n, i, o, a) {
  return md5_cmn(t & r | ~t & n, e, t, i, o, a);
}

function str_to_ent(e) {
  var t,
      r = "";

  for (t = 0; t < e.length; t++) {
    var n = e.charCodeAt(t),
        i = "";

    if (n > 255) {
      for (; n >= 1;) i = "0123456789".charAt(n % 10) + i, n /= 10;

      "" == i && (i = "0"), i = "#" + i, i = "&" + i, i += ";", r += i;
    } else r += e.charAt(t);
  }

  return r;
}

function ntes_core_md5(e, t) {
  e[t >> 5] |= 128 << t % 32, e[(t + 64 >>> 9 << 4) + 14] = t;

  for (var r = 1732584193, n = -271733879, i = -1732584194, o = 271733878, a = 0; a < e.length; a += 16) {
    var s = r,
        u = n,
        c = i,
        l = o;
    r = md5_ff(r, n, i, o, e[a + 0], 7, -680876936), o = md5_ff(o, r, n, i, e[a + 1], 12, -389564586), i = md5_ff(i, o, r, n, e[a + 2], 17, 606105819), n = md5_ff(n, i, o, r, e[a + 3], 22, -1044525330), r = md5_ff(r, n, i, o, e[a + 4], 7, -176418897), o = md5_ff(o, r, n, i, e[a + 5], 12, 1200080426), i = md5_ff(i, o, r, n, e[a + 6], 17, -1473231341), n = md5_ff(n, i, o, r, e[a + 7], 22, -45705983), r = md5_ff(r, n, i, o, e[a + 8], 7, 1770035416), o = md5_ff(o, r, n, i, e[a + 9], 12, -1958414417), i = md5_ff(i, o, r, n, e[a + 10], 17, -42063), n = md5_ff(n, i, o, r, e[a + 11], 22, -1990404162), r = md5_ff(r, n, i, o, e[a + 12], 7, 1804603682), o = md5_ff(o, r, n, i, e[a + 13], 12, -40341101), i = md5_ff(i, o, r, n, e[a + 14], 17, -1502002290), n = md5_ff(n, i, o, r, e[a + 15], 22, 1236535329), r = md5_gg(r, n, i, o, e[a + 1], 5, -165796510), o = md5_gg(o, r, n, i, e[a + 6], 9, -1069501632), i = md5_gg(i, o, r, n, e[a + 11], 14, 643717713), n = md5_gg(n, i, o, r, e[a + 0], 20, -373897302), r = md5_gg(r, n, i, o, e[a + 5], 5, -701558691), o = md5_gg(o, r, n, i, e[a + 10], 9, 38016083), i = md5_gg(i, o, r, n, e[a + 15], 14, -660478335), n = md5_gg(n, i, o, r, e[a + 4], 20, -405537848), r = md5_gg(r, n, i, o, e[a + 9], 5, 568446438), o = md5_gg(o, r, n, i, e[a + 14], 9, -1019803690), i = md5_gg(i, o, r, n, e[a + 3], 14, -187363961), n = md5_gg(n, i, o, r, e[a + 8], 20, 1163531501), r = md5_gg(r, n, i, o, e[a + 13], 5, -1444681467), o = md5_gg(o, r, n, i, e[a + 2], 9, -51403784), i = md5_gg(i, o, r, n, e[a + 7], 14, 1735328473), n = md5_gg(n, i, o, r, e[a + 12], 20, -1926607734), r = md5_hh(r, n, i, o, e[a + 5], 4, -378558), o = md5_hh(o, r, n, i, e[a + 8], 11, -2022574463), i = md5_hh(i, o, r, n, e[a + 11], 16, 1839030562), n = md5_hh(n, i, o, r, e[a + 14], 23, -35309556), r = md5_hh(r, n, i, o, e[a + 1], 4, -1530992060), o = md5_hh(o, r, n, i, e[a + 4], 11, 1272893353), i = md5_hh(i, o, r, n, e[a + 7], 16, -155497632), n = md5_hh(n, i, o, r, e[a + 10], 23, -1094730640), r = md5_hh(r, n, i, o, e[a + 13], 4, 681279174), o = md5_hh(o, r, n, i, e[a + 0], 11, -358537222), i = md5_hh(i, o, r, n, e[a + 3], 16, -722521979), n = md5_hh(n, i, o, r, e[a + 6], 23, 76029189), r = md5_hh(r, n, i, o, e[a + 9], 4, -640364487), o = md5_hh(o, r, n, i, e[a + 12], 11, -421815835), i = md5_hh(i, o, r, n, e[a + 15], 16, 530742520), n = md5_hh(n, i, o, r, e[a + 2], 23, -995338651), r = md5_ii(r, n, i, o, e[a + 0], 6, -198630844), o = md5_ii(o, r, n, i, e[a + 7], 10, 1126891415), i = md5_ii(i, o, r, n, e[a + 14], 15, -1416354905), n = md5_ii(n, i, o, r, e[a + 5], 21, -57434055), r = md5_ii(r, n, i, o, e[a + 12], 6, 1700485571), o = md5_ii(o, r, n, i, e[a + 3], 10, -1894986606), i = md5_ii(i, o, r, n, e[a + 10], 15, -1051523), n = md5_ii(n, i, o, r, e[a + 1], 21, -2054922799), r = md5_ii(r, n, i, o, e[a + 8], 6, 1873313359), o = md5_ii(o, r, n, i, e[a + 15], 10, -30611744), i = md5_ii(i, o, r, n, e[a + 6], 15, -1560198380), n = md5_ii(n, i, o, r, e[a + 13], 21, 1309151649), r = md5_ii(r, n, i, o, e[a + 4], 6, -145523070), o = md5_ii(o, r, n, i, e[a + 11], 10, -1120210379), i = md5_ii(i, o, r, n, e[a + 2], 15, 718787259), n = md5_ii(n, i, o, r, e[a + 9], 21, -343485551), r = safe_add(r, s), n = safe_add(n, u), i = safe_add(i, c), o = safe_add(o, l);
  }

  return Array(r, n, i, o);
}

function str2binl(e) {
  for (var t = new Array(), r = (1 << _ntes_chrsz) - 1, n = 0; n < e.length * _ntes_chrsz; n += _ntes_chrsz) t[n >> 5] |= (e.charCodeAt(n / _ntes_chrsz) & r) << n % 32;

  return t;
}

function binl2hex(e) {
  for (var t = _ntes_hexcase ? "0123456789ABCDEF" : "0123456789abcdef", r = "", n = 0; n < 4 * e.length; n++) r += t.charAt(e[n >> 2] >> n % 4 * 8 + 4 & 15) + t.charAt(e[n >> 2] >> n % 4 * 8 & 15);

  return r;
}

function ntes_hex_md5(e) {
  return binl2hex(ntes_core_md5(str2binl(e), e.length * _ntes_chrsz));
}

const document = {
  body: {
    clientWidth: 1920,
    clientHeight: 1080
  },
  location: {},
  referrer: 'https://music.163.com/',
  cookie: ''
};
const screen = {
  width: 1920,
  height: 1080
};
const navigator = {
  userAgent: (0, _util.randomUserAgent)()
};

function fetch_visitor_hash() {
  var e = new Date(),
      t = document.body.clientWidth + ":" + document.body.clientHeight,
      r = str_to_ent(e.getTime() + Math.random() + document.location + document.referrer + screen.width + screen.height + navigator.userAgent + document.cookie + t);
  return ntes_hex_md5(r);
}