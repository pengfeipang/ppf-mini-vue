import typescript from '@rollup/plugin-typescript'
import config from "./package.json"

export default {
    input: "./src/index.ts",
    output: [
        // 1 cjs -> commonjs
        // 2 esm es6
        {
            format: "cjs", // 描述
            file: config.main
        },
        {
            format: "es",
            file: config.module
        }
    ],
    plugins: [
        typescript() // 安装转译官方插件 ts-->js @rollup/plugin-typescript
    ]
}