import { hasChange, isObject } from "../shared";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

class refImpl {
    private _value: any
    public dep: any
    _rawValue: any
    public __v_isRef: boolean = true
    constructor(value: any) {
        this._rawValue = value
        this._value = convert(value)
        this.dep = new Set()
    }
    get value() {
        // 检查是否有activeEffect
        trackRefValue(this)
        return this._value
    }
    set value(newVal) {
        if(hasChange(newVal,this._rawValue)){
            this._rawValue = newVal
            // 先修改值 再通知触发
            this._value =  convert(newVal)
            triggerEffects(this.dep)
        }
    }
}

function convert(value: any) {
    return isObject(value) ? reactive(value) : value
}

function trackRefValue(red: any) {
    if(isTracking()) {
        trackEffects(red.dep)
    }
}

export function ref(value: any) {
    return new refImpl(value)
}

export function isRef(ref: any) {
    return !!ref.__v_isRef
}

export function unRef(ref: any) {
    return isRef(ref) ? ref.value : ref
}

export function proxyRefs(objectWithRefs: any) {
    // 需要用proxy包起来，因为需要触发 get set
    return new Proxy( objectWithRefs, {
        get(target, key) {
            // 如果taget.key 是ref 就返回.value
            // 反之则返回本身
            return unRef( Reflect.get(target, key) )
        },
        set(target, key, value){
            // 如果值是ref 且 新值value不是一个ref
            if( isRef(target[key]) && !isRef(value) ) {
                return target[key].value = value 
            } else {
                return Reflect.get(target, key)
            }
        }
    })
}