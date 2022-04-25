// 面向对象
class ReactiveEffect {
    private _fn: any
    constructor(fn){
        this._fn = fn
    }
    run(){
        activeEffect = this
        return this._fn()
    }
}

//最外层 target 收集盒子
const targetMap = new Map()

// 依赖收集方法 track
export function track(target, key) {
    // 收集的依赖不能重复，所以可以放到set map里
    // target --> key --> dep
    //depMap的盒子
    let depMap = targetMap.get(target)
    // depMap初始化，处理depMap不存在的情况
    if(!depMap) {
        depMap = new Map()
        targetMap.set(target, depMap)
    }
    let dep = depMap.get(key)
    if(!dep) {
        dep = new Set()
        depMap.set(key, dep)
    }

    dep.add(activeEffect)
    // const dep = new Set()
    
}

// 触发依赖trigger 方法
// 先拿到dep的fn方法，然后遍历 执行
export function trigger(target, key) {
    let depsMap = targetMap.get(target)
    let dep = depsMap.get(key)
     for (const effect of dep) {
         effect.run()
     }
}

// 创建全局对象，用来指向this
let activeEffect

export function effect(fn) {
    // fn
    const _effect = new ReactiveEffect(fn)
    _effect.run()
    return _effect.run.bind(_effect)
}