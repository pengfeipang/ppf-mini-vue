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

    it( 'should return render when call effect', () => {
        //  effect(fn) -> function(render) -> fn -> return
        // 调用effect返回一个fn，render' 调用render的时候会再次执行fn，当调用fn的时候 返回fn的一个返回值
        let foo = 10
        const runner:any = effect( () => {
            foo++
            return "foo"
        })
        expect(foo).toBe(11)

        const r = runner()
        expect(foo).toBe(12)
        expect(r).toBe("foo")
    })
})

