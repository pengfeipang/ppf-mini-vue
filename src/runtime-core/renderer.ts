import { doc } from "prettier";
import { isObject } from "../shared/index";
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode: { type: any; props: any; children: any; }, container: any) {
    // 其实这边只调用了patch 为了方便递归调用
    patch(vnode, container)
}

function patch(vnode, container) {
    // debugger
    // 去处理组件
    // TODO 判断 vnode是不是element 如果是就处理
    // 思考：怎么判断vnode类型
    if(typeof vnode.type === "string") {
        processElement(vnode,container)
    } else if(isObject(vnode.type)) {
        processComponent(vnode, container)
    }
}

function processElement(vnode: any, container: any) {
    mountElement(vnode, container)
}

function mountElement(vnode: any, container: any) {
    // string array
    const el = (vnode.el = document.createElement(vnode.type))
    const { children, props } = vnode
    console.log(children, props, 'asdasd')
    // children is array
    if(Array.isArray(children)) {
        children.forEach( item => {
            patch(item,el)
        })
    } else if(typeof children === 'string') {
        console.log(children,'1231231231')
        el.textContent = children
    }
    // props 处理el props
    for (const key in props) {
        el.setAttribute(key, props[key])
    }
    container.append(el)
}

function processComponent(vnode: any, container: any) {
    // 挂载vnod
    mountComponent(vnode, container)
}
function mountComponent(vnode: any, container: any) {
    // 创建组件实例
    const instance = createComponentInstance(vnode)

    setupComponent(instance)
    
    setupRenderEffect(vnode, instance, container)
}

function setupRenderEffect(vnode, instance, container) {
    const { proxy } = instance
    // 虚拟节点树 vnode
    const subTree = instance.render.call(proxy)

    // vnode -> element -> mountEffect
    patch(subTree, container)
    // 所有的elment类型都 初始化后
    vnode.el = subTree.el
}

