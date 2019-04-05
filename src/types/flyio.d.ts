declare module 'flyio/dist/npm/engine-wrapper' {
    export default function (adapter: any): any
}
declare module 'flyio/dist/npm/fly' {
    import { 
        Fly, 
        FlyRequestConfig, 
        FlyRequestInterceptor, 
        FlyResponseInterceptor, 
        FlyResponse,
        FlyPromise
    } from 'flyio'
    interface config extends FlyRequestConfig {
        rejectUnauthorized?: boolean
        url?: string
        [key: string]: any
    }
    interface response<T = any> {
        data: T;
        request: config;
        engine: XMLHttpRequest;
        headers: {
            [key: string]: any
        };
    }
    interface interceptors {
        request: FlyRequestInterceptor<config>
        response: FlyResponseInterceptor<response>
    }
    export default class {
        constructor(engine: any)
        post: Fly['post']
        get<T = any>(url: string, data?:any, config?: config): Promise<any>;
        config: config
        interceptors: interceptors
        lock: Fly['lock']
        unlock: Fly['unlock']
        request<T = any>(url: string | Object, data?: any, config?: config): FlyPromise<T>;
    }
}
declare module 'flyio/src/adapter/node' {
    export default function (request: any, responseCallBack: any): void
}
declare module 'flyio/src/adapter/dsbridge' {
    export default function (request: any, responseCallBack: any): void
}
