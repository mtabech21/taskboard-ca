/* eslint-disable @typescript-eslint/no-empty-object-type */
import pgp from "pg-promise";
import pgPromise from "pg-promise";
import pg from "pg-promise/typescript/pg-subset";

const db = pgp()(`${process.env.DATABASE_URL}`)
export type Task = pgPromise.ITask<{}>
export type Database = pgp.IDatabase<{}, pg.IClient> | Task

/**
 * @example Value
 * fullName: `'John Spirit'`
 * 
 * @example Query
 * id: '==', 012345
 * 
 */
type Queriable<T> = {
  [K in keyof T]?: string
};
export abstract class Querier<TColumns> {
  protected abstract table_name: string
  query(): Queries<TColumns> { return new Queries(db, this.table_name) }
}
class Queries<TColumns> {
  protected db: Database | Task
  protected table_name: string
  constructor(db: Database | Task, table_name: string) {
    this.db = db; this.table_name = table_name
  }

  async insert(data: TColumns): Promise<TColumns> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const insert = `( ${Object.entries(Object(data)).map(([_, value]) => value ? String(value).includes(`'`) ? `'${String(value).split(`'`).join(`''`)}'` : `'${value}'` : 'NULL').join(', ')})`
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const columns = `( ${Object.entries(Object(data)).map(([key, _]) => `${key}`).join(', ')})`
    const q = `INSERT INTO ${this.table_name}${columns} VALUES ${insert} RETURNING *`
    return await db.one<TColumns>(q)
  }

  async get(columns: (keyof TColumns)[] | ['*'], where?: Queriable<TColumns>): Promise<TColumns[]> {
    const column_list = columns.join(', ')
    const table = this.table_name
    const query = where ? ` WHERE ` + Object.entries(where).map(([key, value]) => `${key} ${value}`).join(' AND ') : ''

    const q = `SELECT ${column_list} FROM ${table}${query}`
    return await db.manyOrNone<TColumns>(q)
  }
}





export default db



