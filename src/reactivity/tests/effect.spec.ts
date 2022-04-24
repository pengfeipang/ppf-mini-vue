import { reactive } from '../reactive'
import { effect } from '../effect'
// 单元测试
describe( 'effecf', () => {
    it('happy path', () => {
        // 通过reactive创建一个响应式对象
        const user = reactive({
            age: 10
        })

        // 通过effect触发和改变响应式对象的值
        // 依赖收集 & 依赖触发
        let changeAge
        effect( () => {
            changeAge = user.age + 1
        })

        // 测试effect
        expect(changeAge).toBe(11)

        //update
        user.age++
        expect(changeAge).toBe(12)
    })
})

