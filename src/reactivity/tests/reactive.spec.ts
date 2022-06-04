import { reactive, isReactive } from "../reactive"

describe( "reactive", () => {
    it("happy path", () => {
        // 先创建一个对象
        const original: object = {foo: 1}
        // 通过reactive将对象变成响应式对象
        const observed = reactive(original)
        // 单元测例
        expect(observed).not.toBe(original)
        expect(observed.foo).toBe(1)
        expect(isReactive(observed)).toBe(true)
        expect(isReactive(original)).toBe(false)
    })
    // 多层对象 进行reactive
    test("nested reactive", () => {
        const original = {
            nested: { foo: 1},
            aray: [ { bar: 2 } ]
        }
        const observed = reactive(original)
        expect(isReactive(observed)).toBe(true)
        expect(isReactive(observed.nested)).toBe(true)
        expect(isReactive(observed.aray)).toBe(true)
        expect(isReactive(observed.aray[0])).toBe(true)
    })
})