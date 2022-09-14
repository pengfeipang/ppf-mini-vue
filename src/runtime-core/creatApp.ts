import { render } from "./renderer"
import { createVNode } from "./vnode"

// 接受根组件模板
export function creatApp(rootComponent: any) {
    return {
        mount(rootContainer: any) {
            console.log(rootContainer,'rootContainer')
            // 把所有组件转换成 vnode虚拟节点
            // component -> vnode
            // 所有的逻辑都是基于 vnode 做处理

            // 先创建虚拟节点
            const vnode = createVNode(rootComponent)
            render(vnode, rootContainer)
        }
    }
}