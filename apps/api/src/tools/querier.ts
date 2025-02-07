import db, { Database, Task } from "../db";

export type Queriable<T> = { [K in keyof T]?: string | string[] } | '*'

export default class Querier<TTable extends object, TDefinedQueries> {
  private table_name; task; defined;
  select; insert;

  private where_string(where: Queriable<TTable>): string | undefined {
    let wheres: string[] = []
    if (where != '*') {
      Object.entries(where).forEach(([key, value]) => {
        switch (typeof value) {
          case "string":
            wheres.push(`${key} = '${value}'`); break;
          case "number":
            wheres.push(`${key} = ${value}`); break;
          case "boolean":
            wheres.push(`${key} = ${value}`); break;
          case "object":
            wheres.push(`${key} IN ('${(value as Array<any>).join(`','`)}')`); break;
        }
    })
    } else
      return 
    return `WHERE ${wheres.join(' AND ')}`
  }
  private select_queries = (db: Database) => {
    return {
      one: <TKey extends keyof TTable>(where: Queriable<TTable>, columns?: TKey[]) => {
        const where_query = this.where_string(where) ?? ''
        const q = `SELECT ${columns ? columns.join(',') : '*'} FROM ${this.table_name} ${where_query}`
        return columns ? db.one<Pick<TTable, TKey>>(q) : db.one<TTable>(q)
      },
      many: <TKey extends keyof TTable>(where: Queriable<TTable>, columns?: TKey[]) => {
        const where_query = this.where_string(where) ?? ''
        const q = `SELECT ${columns ? columns.join(',') : '*'} FROM ${this.table_name} ${where_query}`
        return columns ? db.many<Pick<TTable, TKey>>(q) : db.many<TTable>(q)
      },
      oneOrNone: <TKey extends keyof TTable>(where: Queriable<TTable>, columns?: TKey[]) => {
        const where_query = this.where_string(where) ?? ''
        const q = `SELECT ${columns ? columns.join(',') : '*'} FROM ${this.table_name} ${where_query}`
        return columns ? db.oneOrNone<Pick<TTable, TKey>>(q) : db.oneOrNone<TTable>(q)
      },
      manyOrNone: <TKey extends keyof TTable>(where: Queriable<TTable>, columns?: TKey[]) => {
        const where_query = this.where_string(where) ?? ''
        const q = `SELECT ${columns ? columns.join(',') : '*'} FROM ${this.table_name} ${where_query}`
        return columns ? db.manyOrNone<Pick<TTable, TKey>>(q) : db.manyOrNone<TTable>(q)
        },
      }
    }

  
  
  private insert_query = (db: Database) => {
    const base = () =>
      <TRequired extends object = TTable>(...data: [TRequired, ...TRequired[]]) => {
        const first = data[0]
        const columns = Object.keys(first).map(k => k)
        const values = data.map((d) => {
          return '(' + Object.values(d).map(v => {
            switch (typeof v) {
              case "string": return `'${v}'`
              case "number": return v
              case "bigint": return v
              case "boolean": return v
              case "symbol": return v
              case "undefined": return 'null'
              case "object": return `'{${Array(v).join(',')}}'`;
              case "function": return 'null'
            }
          }).join(', ') + ')'
        }).join(', ')
        const q = `INSERT INTO ${this.table_name} (${columns.join(',')}) VALUES ${values}`
        return db.manyOrNone<TTable>(q)
      }
    return base()
  }

  constructor(table_name: string, queries: (database: Database) => TDefinedQueries) {
    this.table_name = table_name
    this.select = this.select_queries(db)
    this.insert = this.insert_query(db)
    this.defined = queries(db)

    this.task = (t: Task) => ({
      select: this.select_queries(t),
      insert: this.insert_query(t),
      defined: queries(t)
    })
  }

  static async tx<T extends [Querier<any, any>, ...Querier<any, any>[]], TResult>(
    queriers: T,
    action: (
      queriers: { [K in keyof T]: ReturnType<T[K]["task"]>; },
      t: Task
    ) => Promise<TResult>
  ) {
    return await db.tx(async (t: Task) => { return await action(queriers.map(q => q.task(t)) as { [K in keyof T]: ReturnType<T[K]["task"]> }, t) }); 
  }

  static create:
    <TTable extends object>() =>
      <TDefinedQueries>(table_name: string, queries: (db: Database) => TDefinedQueries)
        => Querier<TTable, TDefinedQueries> = () => ((table_name, queries) => {
          return new Querier(table_name,queries)
        })
  
}



















