"use strict";

const crypto = require('crypto');

const sjcl = require('sjcl');

module.exports = {
  createCipheriv: crypto.createCipheriv,
  publicEncrypt: crypto.publicEncrypt,
  createHash: crypto.createHash,

  randomBytes(length) {
    let size = length;
    let wordCount = Math.ceil(size * 0.25);
    let randomBytes = sjcl.random.randomWords(wordCount, 10);
    let hexString = sjcl.codec.hex.fromBits(randomBytes);
    hexString = hexString.substr(0, size * 2);
    return new Buffer(hexString, 'hex');
  }

};