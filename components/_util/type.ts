//  https://stackoverflow.com/questions/46176165/ways-to-get-string-literal-type-of-array-values-without-enum-overhead
// 避免允许字符串类型 和 数组允许类型的多次列出，泛型约束，配合(typeof 数组返回)[number]就是个数组索引类型
export const tuple = <T extends string[]>(...args: T) => args

export type htmlRef = HTMLElement | null

// 省略。（选择）剔除T中K包含的属性值
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
