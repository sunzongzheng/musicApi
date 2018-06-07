"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  require("dsbridge");

  const Fly = require("flyio/dist/npm/fly");

  const adapter = require("flyio/dist/npm/adapter/dsbridge");

  const EngineWrapper = require("flyio/dist/npm/engine-wrapper");

  const dsEngine = EngineWrapper(adapter);
  return new Fly(dsEngine);
}