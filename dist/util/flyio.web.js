"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(adapter) {
  const Fly = require("flyio/dist/npm/fly");

  const EngineWrapper = require("flyio/dist/npm/engine-wrapper");

  const engine = EngineWrapper(adapter);
  return () => new Fly(engine);
}