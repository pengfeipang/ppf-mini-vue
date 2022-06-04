import { isReadonly, shallowReadonly } from "../reactive";

describe("shallowReadonly", () => {
    // shallowReadonly 生成的对象保持最外层是readobly状态，对象里面的对象不是readonly
    test("should not make non-reactive properties reactive", () => {
        const props = shallowReadonly({ n: { foo: 1 } })
        expect(isReadonly(props)).toBe(true)
        expect(isReadonly(props.n)).toBe(false)
    })
})