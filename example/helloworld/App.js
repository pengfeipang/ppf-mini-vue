import { h } from "../../lib/guide-mini-vue.esm.js"

// 方便调试 
window.self = null
export const App = {
    // .vue 暂不实现template编译
    // 通过render去渲染
    render() {
        window.self = this
        // ui 
        // return h("", "hi, " + this.msg)
        return h (
            "div",
            {
                id: "root",
                class: ["red", "hard"]
            },
            // this.$el --> get root elment
            "hi," + this.msg
            // [h("p",{ class: "red"}, "hi"), h("p", {class: "blue"}, "mini-vue")]
            // "hi,mini-vue" //string    
        )
    },
    setup() {
        // composition api
        return {
            msg: 'mini-vue'
        }
    }
}