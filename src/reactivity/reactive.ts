import { mutableHandlers, readonlyHandlers } from "./baseHandlers"

// reactie 本质就是通过proxy代理的对象， 触发get 触发set
export function reactive (raw: any) {
    return proxyFun(raw,mutableHandlers)
}

export function readonly(raw: any) {
    return proxyFun(raw, readonlyHandlers)
}

function proxyFun(raw: any, handlers: object) {
    return new Proxy(raw, handlers)
}