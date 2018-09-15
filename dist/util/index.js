"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomUserAgent = randomUserAgent;
exports.lyric_decode = lyric_decode;
exports.getCookies = getCookies;
exports.setCookie = setCookie;
exports.noSongsDetailMsg = void 0;

function randomUserAgent() {
  const userAgentList = ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36', 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1', 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36', 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Mobile Safari/537.36', 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_2 like Mac OS X) AppleWebKit/603.2.4 (KHTML, like Gecko) Mobile/14F89;GameHelper', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/603.2.4 (KHTML, like Gecko) Version/10.1.1 Safari/603.2.4', 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:46.0) Gecko/20100101 Firefox/46.0', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:46.0) Gecko/20100101 Firefox/46.0', 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)', 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)', 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)', 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Win64; x64; Trident/6.0)', 'Mozilla/5.0 (Windows NT 6.3; Win64, x64; Trident/7.0; rv:11.0) like Gecko', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/13.10586', 'Mozilla/5.0 (iPad; CPU OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1'];
  const num = Math.floor(Math.random() * userAgentList.length);
  return userAgentList[num];
}

function lyric_decode(str) {
  let list = str.replace(/\<\d+\>/g, '').split('\n');
  let lyric_arr = [];
  list.forEach(item => {
    const matchs = item.match(/((\[\d+:\d+\.\d+\])+)(.*)/);

    if (matchs && matchs[1]) {
      const t_array = matchs[1].match(/\[\d+:\d+\.\d+\]/g);
      t_array.forEach(item => {
        lyric_arr.push([item.substring(1, item.length - 1), matchs[3]]);
      });
    }
  });
  return lyric_arr.sort();
}

const noSongsDetailMsg = '无法获取信息，请检查songId';
exports.noSongsDetailMsg = noSongsDetailMsg;

function getCookies() {
  let result = {};

  if (document.cookie) {
    const cookies = document.cookie.split('; ');
    cookies.forEach(item => {
      console.log(item);
      const cookie = item.split('=');
      result[cookie[0]] = cookie[1];
    });
  }

  return result;
}

const expiresTime = (day = 7) => {
  // 获取过期时间
  const exp = new Date();
  exp.setTime(exp.getTime() + day * 24 * 60 * 60 * 1000);
  return exp.toUTCString();
};

function setCookie(key, value, info) {
  const _ref = info || {},
        _ref$path = _ref.path,
        path = _ref$path === void 0 ? '/' : _ref$path,
        _ref$domain = _ref.domain,
        domain = _ref$domain === void 0 ? location.hostname : _ref$domain;

  let str = key + '=' + encodeURIComponent(value) + ';';
  str += 'path=' + path + ';';
  str += 'expires=' + expiresTime() + ';';

  if (domain !== 'localhost') {
    str += 'domain=' + domain + ';';
  }

  document.cookie = str;
}