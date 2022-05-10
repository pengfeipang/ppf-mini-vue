import { reactive } from '../reactive'
import { effect, stop } from '../effect'
// 单元测试
describe( 'effect', () => {
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
        // 调用effect返回一个fn，runner' 调用render的时候会再次执行fn，当调用fn的时候 返回fn的一个返回值
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

    it( 'scheduler', () => {
        // 1. 通过effect的第二个参数给定一个 scheduler 的fn
        // 2. effect 会执行fn
        // 3. 当响应式对象 set update的时候不会执行fn 而是执行第二个参数 scheduler函数
        // 4. 然后执行runner的时候，会再次执行 fn
        let dummy
        let run: any
        const scheduler = jest.fn( () => {
            run = runner
        })
        const obj = reactive( { foo: 1 } )
        const runner = effect( () => {
            dummy = obj.foo
        }, { scheduler })
        expect(scheduler).not.toHaveBeenCalled()
        expect(dummy).toBe(1)
        // should be called on first trigger
        obj.foo++
        expect(scheduler).toHaveBeenCalledTimes(1)
        // should not run yet
        expect(dummy).toBe(1)

        // manually run 手动执行run
        run()
        // should have run
        expect(dummy).toBe(2)
        
    })

    it( 'stop', () => {
        let dummy: unknown
        const obj = reactive( { prop: 1 } )
        const runner = effect( () => {
            dummy = obj.prop
        })
        obj.prop = 2
        expect(dummy).toBe(2)
        stop(runner)
        obj.prop = 3
        expect(dummy).toBe(2)

        // stoped effect should still be manually callable
        runner()
        expect(dummy).toBe(3)
    })

    // 调用stop后的回调函数，允许调用stop后可进行其它操作
    it( 'onStop', () => {
        const obj = reactive({
            foo: 1
        })
        const onStop = jest.fn()
        let dummy: number
        const runner = effect( () => {
            dummy = obj.foo
        }, { onStop })
        stop(runner)
        expect(onStop).toBeCalledTimes(1)
    })

})

