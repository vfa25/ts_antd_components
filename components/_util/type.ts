//  https://stackoverflow.com/questions/46176165/ways-to-get-string-literal-type-of-array-values-without-enum-overhead
// 避免允许字符串类型 和 数组允许类型的多次列出，并配合 typeof类型保护
export const tuple = <T extends string[]>(...args: T) => args

export type htmlRef = HTMLElement | null
