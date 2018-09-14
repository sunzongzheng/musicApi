import musicApi from './music-api'
import instance from './util/flyio.web'

export default function (adapter) {
    return musicApi(instance(adapter))
}