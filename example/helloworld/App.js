export const App = {
    // .vue 暂不实现template编译
    // 通过render去渲染
    render() {
        // ui 
        return h("", "hi, " + this.msg)
    },
    setup() {
        // composition api
        return {
            msg: 'mini-vue'
        }
    }
}