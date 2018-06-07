export default function () {
    require("dsbridge")
    const Fly = require("flyio/dist/npm/fly")
    const adapter = require("flyio/dist/npm/adapter/dsbridge")
    const EngineWrapper = require("flyio/dist/npm/engine-wrapper")
    const dsEngine = EngineWrapper(adapter)

    return new Fly(dsEngine)
}