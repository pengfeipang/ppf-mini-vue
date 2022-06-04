import { mutableHandlers, readonlyHandlers, shallowHandlers } from "./baseHandlers"

export const enum reactiveFlags {
    IS_REACTIVE = "__v_isReactive",
    IS_READONLY = "__v_isReadonly"
}

// reactie 本质就是通过proxy代理的对象， 触发get 触发set
export function reactive (raw: any) {
    return proxyFun(raw,mutableHandlers)
}

export function isReactive(raw: any) {
    return !!raw[reactiveFlags.IS_REACTIVE]
}

export function isReadonly(raw: any) {
   return !!raw[reactiveFlags.IS_READONLY]
}

export function readonly(raw: any) {
    return proxyFun(raw, readonlyHandlers)
}

export function shallowReadonly(raw: any) {
    return proxyFun(raw, shallowHandlers)
}

function proxyFun(raw: any, handlers: object) {
    return new Proxy(raw, handlers)
}