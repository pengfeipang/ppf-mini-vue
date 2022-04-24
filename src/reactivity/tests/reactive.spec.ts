import { reactive } from "../reactive"

describe( "reactive", () => {
    it("happy path", () => {
        // 先创建一个对象
        const original: object = {foo: 1}
        // 通过reactive将对象变成响应式对象
        const observed = reactive(original)
        // 单元测例
        expect(observed).not.toBe(original)
        expect(observed.foo).toBe(1)
    })
})