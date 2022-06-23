import { reactive } from "../reactive"
import { computed } from "../computed"

describe("computed", () => {
    it("happy path", () => {
        // ref
        // .value
        // 缓存
        const user = reactive({
            age: 1
        })

        const age = computed(() => {
            return user.age
        })
        expect(age.value).toBe(1)
    })

    it("should computed lazily", () => {
        const value = reactive({
            foo: 1
        })
        // 因为要测试fn 所以使用jest.fn
        const getter = jest.fn(() => {
            return value.foo
        })
        const cValue = computed(getter)

        // lazy 懒执行 如果不调用cValue.value的话 函数getter就不会执行
        expect(getter).not.toHaveBeenCalled()
        expect(cValue.value).toBe(1)
        expect(getter).toHaveBeenCalledTimes(1)

        // should not compute again 
        cValue.value // get 操作后 getter还是被调用了一次
        expect(getter).toHaveBeenCalledTimes(1)

        // 触发set 希望getter还是触发一次
        value.foo = 2 // 触发set就是 -> trigger -> 收集effect -> get 重新执行 返回新value
        expect(getter).toHaveBeenCalledTimes(1)
        expect(cValue.value).toBe(2)
        expect(getter).toHaveBeenCalledTimes(2)

        cValue.value
        expect(getter).toHaveBeenCalledTimes(2)

    })
})