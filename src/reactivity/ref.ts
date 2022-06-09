import { hasChange, isObject } from "../shared";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

class refImpl {
    private _value: any
    public dep: any
    _rawValue: any
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

function trackRefValue(red) {
    if(isTracking()) {
        trackEffects(red.dep)
    }
}

export function ref(value: any) {
    return new refImpl(value)
}