import { extend } from "../shared"
// 创建全局对象，用来指向this
let activeEffect: any
// 创建是否stop判断参数
let shouldTrack: boolean

// 面向对象
class ReactiveEffect {
    private _fn: any
    deps = []
    active: boolean = true
    onStop?: () => void
    constructor(fn: any, public scheduler?: any){
        this._fn = fn
    }
    run(){
        // 会依赖收集 
        // shouldTrack 来做区分
        if(!this.active) {
            return this._fn()
        }

        shouldTrack = true
        activeEffect = this
        const result = this._fn()

        // reset
        shouldTrack = false
        
        return result 
    }
    stop(){
        // 清空操作优化
        if(this.active){
            clearupEffect(this)
            // onStop的回调 如果有onStop就调用一下
            this.onStop ? this.onStop() : console.log('no onStop')
            this.active = false
        }
    }
}

function clearupEffect(effect: any) {
    effect.deps.forEach((dep: any) => {
        dep.delete(effect)
    });
    effect.deps.length = 0
}

//最外层 target 收集盒子
const targetMap = new Map()

// 依赖收集方法 track
export function track(target: any, key: any) {
    if(!isTracking()) return 
    // 收集的依赖不能重复，所以可以放到set里
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
    
    trackEffects(dep)
    
}

// 抽离track 收集dep
export function trackEffects(dep: any) {
    // 看看 dep 之前有没有添加过，添加过的话 就不添加了
    if(dep.has(activeEffect)) return
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
    // const dep = new Set()
}

// 抽离出判断
export function isTracking() {
    return activeEffect && shouldTrack
}

// 触发依赖trigger 方法
// 先拿到dep的fn方法，然后遍历 执行
export function trigger(target: any, key: string | symbol) {
    let depsMap = targetMap.get(target)
    let dep = depsMap.get(key)
    triggerEffects(dep)
}

// 抽离trigger 触发依赖行为
export function triggerEffects(dep: any) {
    for (const effect of dep) {
        // 判断effect是否哟scheduler方法
        if( effect.scheduler ) {
            effect.scheduler()
        } else {
            effect.run()
        }
    }
}

export function effect(fn: any, options: any = {}) {
    // fn
    const _effect = new ReactiveEffect(fn, options?.scheduler)
    // 后续options里会有更多的方法，所以这块通过Object.assign 挂载上
    // 为了更语义化，可以抽离Object.assign方法 导出 extend(a,b)
    // _effect.onStop = options.onStop
    // Object.assign(_effect, options)
    extend(_effect, options)

    _effect.run()
    const runner: any = _effect.run.bind(_effect)
    runner.effect = _effect
    return runner
}

export function stop (runner: any) {
    runner.effect.stop()
}