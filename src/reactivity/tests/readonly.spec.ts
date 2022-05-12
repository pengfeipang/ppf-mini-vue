import { readonly } from "../reactive"

// readonly 只读对象 属性
describe( 'readonly', () => {
    it('happy path', () => {
        // 不能set 只可以get
        const original = { foo: 1, bar: { baz: 2 } }
        const wrapped = readonly(original)
        expect(wrapped).not.toBe(original)
        expect(wrapped.foo).toBe(1)
    })
    it('warn when readonly call set', () => {
        // 要用 mock  console.warn
        console.warn = jest.fn()
        const obj = { foo: 1}
        const readonlyObj = readonly({ foo: 1})
        readonlyObj.foo = 2
        expect(console.warn).toBeCalled()
    })
})