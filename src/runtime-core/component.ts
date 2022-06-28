export function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type
    }
    return component
}
export function setupComponent(instance) {
    // TODO 
    // initProps()
    // initSolts()

    // 初始化 一个有状态的component
    setupStatefulComponent(instance)
}

function setupStatefulComponent(instance: any) {
     // 调用setup 拿到setup的返回值
    const Component = instance.type

    const { setup } = Component
    if(setup) {
        const setupResult = setup()
        handleSetupResult(instance, setupResult)
    }
}
function handleSetupResult(instance: any, setupResult: any) {
    // function object
    // TODO function
    if(setupResult === "object") {
        instance.setupState = setupResult
    }

    finishComponentSetup(instance)
}

function finishComponentSetup(instance: any) {
    const Component = instance.type 
    
    instance.render = Component.render 
}

