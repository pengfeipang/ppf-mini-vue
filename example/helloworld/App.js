import { h } from "../../lib/guide-mini-vue.esm.js"

export const App = {
    // .vue 暂不实现template编译
    // 通过render去渲染
    render() {
        // ui 
        // return h("", "hi, " + this.msg)
        return h (
            "div",
            {
                id: "root",
                class: ["red", "hard"]
            },
            [h("p",{ class: "red"}, "hi"), h("p", {class: "blue"}, "mini-vue")]
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