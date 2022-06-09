// extend Object.assign
export const extend = Object.assign

export const isObject = (res) => {
    return  res !== null && typeof res === "object"
}

export const hasChange = (val: any, newVal: any) => {
    return !Object.is(val, newVal)
}