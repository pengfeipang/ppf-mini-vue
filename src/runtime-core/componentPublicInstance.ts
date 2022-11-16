// map 扩展
const publicPropertiesMap = {
    $el:(i: any) => i.vnode.el
    // setup --> options data
    // $data ...等等
}

export const publicInstanceProxyHandles = {
    get({_: instance}, key: any) {
        const { setupState } = instance
        console.log(key, setupState,'setupState')
        if(key in setupState) {
            return setupState[key]
        }
        // key --> $el
        // if(key === '$el') {
        //     return instance.vnode.el
        // } ⬇ ⬇ ⬇

        // 优化
        const publicGetter = publicPropertiesMap[key]
        if(publicGetter) {
            return publicGetter(instance)
        }
    }
}