import { isObject } from "../shared"
import { track, trigger } from "./effect"
import { reactive, reactiveFlags, readonly } from "./reactive"

// 高阶函数 返回一个fun
function createGetter(isReadonly:boolean = false) {
    // 优化get set
    return function get(target: any, key: any) { 
        if(key === reactiveFlags.IS_REACTIVE) {
            return !isReadonly 
        }
        if(key === reactiveFlags.IS_READONLY){
            return isReadonly
        }
        // target 就是当前的对象； key是 用户访问的key
        // { foo: 1} === target
        // foo === key 
        const res = Reflect.get(target, key)

        // 判断res是不是obj，如果是继续reactive
        if(isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res)
        }

        if(isReadonly) return res
        // todo 依赖收集
        track(target, key)
        return res
    }
}

function createSetter() {
    return function set(target: any, key: any, value: any) {
        const res = Reflect.set(target, key, value)
        // 触发依赖
        trigger(target, key)
        return res
    }
}

export const mutableHandlers = {
    get: createGetter(),
    set: createSetter()
}

export const readonlyHandlers = {
    get: createGetter(true),
    set(target: any, key: any, value: any) {
        console.warn(`这是只读的属性： ${target[key]},不能 set修改`)
        return true
    }
}