"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 参考 https://github.com/darknessomi/musicbox/wiki/
var crypto_1 = __importDefault(require("crypto"));
var big_integer_1 = __importDefault(require("big-integer"));
var modulus = '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7';
var nonce = '0CoJUm6Qyw8W8jud';
var pubKey = '010001';
function createSecretKey(size) {
    var keys = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var key = '';
    for (var i = 0; i < size; i++) {
        var pos = Math.random() * keys.length;
        pos = Math.floor(pos);
        key = key + keys.charAt(pos);
    }
    return key;
}
function aesEncrypt(text, secKey) {
    var _text = text;
    var lv = new Buffer('0102030405060708', 'binary');
    var _secKey = new Buffer(secKey, 'binary');
    var cipher = crypto_1.default.createCipheriv('AES-128-CBC', _secKey, lv);
    var encrypted = cipher.update(_text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}
function zfill(str, size) {
    while (str.length < size)
        str = '0' + str;
    return str;
}
function rsaEncrypt(text, pubKey, modulus) {
    var _text = text.split('').reverse().join('');
    var biText = big_integer_1.default(new Buffer(_text).toString('hex'), 16), biEx = big_integer_1.default(pubKey, 16), biMod = big_integer_1.default(modulus, 16), biRet = biText.modPow(biEx, biMod);
    return zfill(biRet.toString(16), 256);
}
function Encrypt(obj) {
    var text = JSON.stringify(obj);
    var secKey = createSecretKey(16);
    var encText = aesEncrypt(aesEncrypt(text, nonce), secKey);
    var encSecKey = rsaEncrypt(secKey, pubKey, modulus);
    return {
        params: encText,
        encSecKey: encSecKey
    };
}
exports.default = Encrypt;
//# sourceMappingURL=crypto.js.map