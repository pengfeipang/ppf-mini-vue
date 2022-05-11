import { track, trigger } from "./effect"

// reactie 本质就是通过proxy代理的对象， 触发get 触发set
export function reactive (raw: any) {
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

export function readonly(raw: any) {
    return new Proxy(raw, {
        get(target, key) {
            const res = Reflect.get(target, key)
            // 因为是readonly 所以不需要依赖收集
            return res
        },
        set(target, key, value) {
            console.log(`this is readonly ${target[key]},cant change`)
            return true
        }
    })
}