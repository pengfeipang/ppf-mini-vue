'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// extend Object.assign
const isObject = (res) => {
    return res !== null && typeof res === "object";
};

// map 扩展
const publicPropertiesMap = {
    $el: (i) => i.vnode.el
    // setup --> options data
    // $data ...等等
};
const publicInstanceProxyHandles = {
    get({ _: instance }, key) {
        const { setupState } = instance;
        console.log(key, setupState, 'setupState');
        if (key in setupState) {
            return setupState[key];
        }
        // key --> $el
        // if(key === '$el') {
        //     return instance.vnode.el
        // } ⬇ ⬇ ⬇
        // 优化
        const publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    }
};

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {}
    };
    return component;
}
function setupComponent(instance) {
    // TODO 
    // initProps()
    // initSolts()
    // 初始化 一个有状态的component
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    // 调用setup 拿到setup的返回值
    const Component = instance.type;
    // 实现代理对象
    instance.proxy = new Proxy({ _: instance }, publicInstanceProxyHandles);
    const { setup } = Component;
    if (setup) {
        const setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    // function object
    // TODO function
    if (isObject(setupResult)) {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const Component = instance.type;
    instance.render = Component.render;
}

function render(vnode, container) {
    // 其实这边只调用了patch 为了方便递归调用
    patch(vnode, container);
}
function patch(vnode, container) {
    // debugger
    // 去处理组件
    // TODO 判断 vnode是不是element 如果是就处理
    // 思考：怎么判断vnode类型
    if (typeof vnode.type === "string") {
        processElement(vnode, container);
    }
    else if (isObject(vnode.type)) {
        processComponent(vnode, container);
    }
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    // string array
    const el = (vnode.el = document.createElement(vnode.type));
    const { children, props } = vnode;
    console.log(children, props, 'asdasd');
    // children is array
    if (Array.isArray(children)) {
        children.forEach(item => {
            patch(item, el);
        });
    }
    else if (typeof children === 'string') {
        console.log(children, '1231231231');
        el.textContent = children;
    }
    // props 处理el props
    for (const key in props) {
        el.setAttribute(key, props[key]);
    }
    container.append(el);
}
function processComponent(vnode, container) {
    // 挂载vnod
    mountComponent(vnode, container);
}
function mountComponent(vnode, container) {
    // 创建组件实例
    const instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(vnode, instance, container);
}
function setupRenderEffect(vnode, instance, container) {
    const { proxy } = instance;
    // 虚拟节点树 vnode
    const subTree = instance.render.call(proxy);
    // vnode -> element -> mountEffect
    patch(subTree, container);
    // 所有的elment类型都 初始化后
    vnode.el = subTree.el;
}

function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        el: null
    };
    return vnode;
}

// 接受根组件模板
function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            console.log(rootContainer, 'rootContainer');
            // 把所有组件转换成 vnode虚拟节点
            // component -> vnode
            // 所有的逻辑都是基于 vnode 做处理
            // 先创建虚拟节点
            const vnode = createVNode(rootComponent);
            render(vnode, rootContainer);
        }
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

exports.createApp = createApp;
exports.h = h;
