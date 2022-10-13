// extend Object.assign
const isObject = (res) => {
    return res !== null && typeof res === "object";
};

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type
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
    const { setup } = Component;
    if (setup) {
        const setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    // function object
    // TODO function
    if (setupResult === "object") {
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
    // 去处理组件
    // TODO 判断 vnode是不是element 如果是就处理
    // 思考：怎么判断vnode类型
    console.log(vnode.type, '123');
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
    const el = document.createElement(vnode.type);
    const { children, props } = vnode;
    console.log(children, props, 'asdasd');
    // children is array
    if (Array.isArray(children)) {
        children.forEach(item => {
            patch(item, el);
        });
    }
    else if (typeof children === 'string') {
        el.textContent = children;
        // props
        for (const key in props) {
            el.setAttribute(key, props[key]);
        }
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
    setupRenderEffect(instance, container);
}
function setupRenderEffect(instance, container) {
    // 虚拟节点树 vnode
    const subTree = instance.render();
    // vnode -> element -> mountEffect
    patch(subTree, container);
}

function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children
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

export { createApp, h };
