import QQ from "@suen/music-api-core/qq.class";
import axios, {AxiosInstance, AxiosAdapter} from "axios";

function getFunc(cls: Function, api: AxiosInstance): Object {
  return new Proxy(cls, {
    get(target, propKey, receiver) {
      const func = Reflect.get(target, propKey, receiver);
      if (func) {
        return api(func());
      }
    },
  });
}

function customCtor(adapter: AxiosAdapter) {
  const api = axios.create({ adapter });
  return {
    qq: getFunc(QQ, api),
  };
}
export default customCtor;
