import { track, trigger } from "./effect"

// reactie 本质就是通过proxy代理的对象， 触发get 触发set
export function reactive (raw) {
    return new Proxy(raw, {
        // target 就是当前的对象； key是 用户访问的key
        // { foo: 1} === target
        // foo === key
        get(target, key){
            const res = Reflect.get(target, key)

            // todo 依赖收集
            track(target, key)
            return res
        },

        set(target, key, value) {
            const res = Reflect.set(target, key, value)

            // 触发依赖
            trigger(target, key)
            return res
        }
    })
}