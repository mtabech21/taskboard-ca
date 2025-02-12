export type Queriable<T> =
  ({ [K in keyof T]?: unknown | unknown[] } & { where?: string[] }) | '*'
export type Orderable<T> = `${string & keyof T} ${string & 'ASC' | 'DESC'}`[]
export type Partialize<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type NotEmpty<T> = [T, ...T[]]