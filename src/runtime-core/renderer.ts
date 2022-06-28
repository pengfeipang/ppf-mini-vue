import { createComponentInstance, setupComponent } from "./component";

export function render(vnode: { type: any; props: any; children: any; }, container: any) {
    // 其实这边只调用了patch 为了方便递归调用
    patch(vnode, container)
}

function patch(vnode, container) {
    // 去处理组件
    processComponent(vnode, container)
}

function processComponent(vnode: any, container: any) {
    // 挂载vnod
    mountComponent(vnode, container)
}
function mountComponent(vnode: any, container: any) {
    // 创建组件实例
    const instance = createComponentInstance(vnode)
    setupComponent(instance)
    setupRenderEffect(instance, container)
}

function setupRenderEffect(instance, container) {
    // 虚拟节点树 vnode
    const subTree = instance.render()

    // vnode -> element -> mountEffect
    patch(subTree, container)
}

