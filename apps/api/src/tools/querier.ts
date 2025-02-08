import db, { Database, Task } from "../db";

export type Queriable<T> = { [K in keyof T]?: string | string[] } | '*'

export default class Querier<TTable extends object, TInsert extends object, TDefinedQueries> {
  private table_name; task; defined;
  select; insert; delete;

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
    const insert_string = (columns: string[], values: string) => `INSERT INTO ${this.table_name} (${columns.join(",")}) VALUES ${values} RETURNING *`;
    function insert(data: [TInsert, ...TInsert[]]): Promise<TTable[]>;
    function insert(data: TInsert): Promise<TTable>;
    function insert(data: TInsert | [TInsert, ...TInsert[]]): Promise<TTable | TTable[]> {
      const isArray = Array.isArray(data);
      const firstItem = isArray ? (data.length > 0 ? data[0] : null) : data;
    
      const columns = Object.keys(firstItem!);
      const values = (isArray ? data : [data])
        .map((d) => {
          return (
            "(" +
            Object.values(d)
              .map((v) => {
                switch (typeof v) {
                  case "string":
                    return `'${v}'`;
                  case "number":
                  case "bigint":
                  case "boolean":
                    return v;
                  case "symbol":
                  case "undefined":
                  case "function":
                    return "null";
                  case "object":
                    return `'{${Array(v).join(",")}}'`;
                }
              })
              .join(", ") +
            ")"
          );
        })
        .join(", ");
      
      const q = insert_string(columns, values)
      
      return isArray
        ? db.many<TTable>(q) as Promise<TTable[]>
        : db.one<TTable>(q) as Promise<TTable>;
    };

    return insert
  };
  private delete_queries = (db: Database) => {
    return (where: Queriable<TTable>, confirm: boolean) => {
      const where_query = this.where_string(where) ?? ''
      const q = `DELETE FROM ${this.table_name} ${where_query}`
      return confirm && db.manyOrNone<TTable>(q)
    }
  }

  constructor(table_name: string, queries: (database: Database) => TDefinedQueries) {
    this.table_name = table_name
    this.select = this.select_queries(db)
    this.insert = this.insert_query(db)
    this.defined = queries(db)
    this.delete = this.delete_queries(db)

    this.task = (t: Task) => ({
      select: this.select_queries(t),
      insert: this.insert_query(t),
      defined: queries(t),
      delete: this.delete_queries(t)
    })
  }

  static async join<
    TQuerier1 extends Querier<any, any, any>,
    TQuerier2 extends Querier<any, any, any>,
    TTable1 = TQuerier1 extends Querier<infer R, any, any> ? R : never,
    TTable2 = TQuerier2 extends Querier<infer R, any, any> ? R : never,
    TKey1 = keyof TTable1,
    TKey2 = keyof TTable2,
    TMatch extends [TKey1, TKey2] = [TKey1, TKey2],
    TColumns1 = [(keyof TTable1), string | undefined][],
    TColumns2 = [(keyof TTable2), string | undefined][],
    TQueriable = Queriable<TTable1 & TTable2>
  >
    (queriers: [TQuerier1, TQuerier2], query: {
      select?: {
        t1: TColumns1
        t2?: TColumns2
      }
      on: TMatch[]
      where?: TQueriable
    }) {
    const [querier1, querier2] = queriers
    const matches = query.on
    const columns = ''
    const select_string =
      query.select ?
        [...query.select.t1?.map<string>(([column, as]) => (`t1.${column as string}` + as ? ` ${as}` : '') as string)]
        : '*'
    const q = `
    SELECT ${columns} FROM ${querier1.table_name} t1
    JOIN ${querier2.table_name} t2 ON ${querier1.table_name}.${matches[0][0] as string} = ${querier2.table_name}.${matches[0][1] as string}

      `
    return q
  }



  static async tx<T extends [Querier<any,any, any>, ...Querier<any,any, any>[]], TResult>(
    queriers: T,
    action: (
      queriers: { [K in keyof T]: ReturnType<T[K]["task"]>; },
      t: Task
    ) => Promise<TResult>
  ) {
    return await db.tx(async (t: Task) => { return await action(queriers.map(q => q.task(t)) as { [K in keyof T]: ReturnType<T[K]["task"]> }, t).catch(() => { throw 'Error within' }) }).catch(() => {throw 'Transaction Error'}); 
  }
  static create: <TTable extends object, TInsert extends object = TTable>() => <TDefinedQueries>(table_name: string, queries: (db: Database) => TDefinedQueries) => Querier<TTable,TInsert, TDefinedQueries> = () => ((table_name, queries) => {
          return new Querier(table_name,queries)
      })
  static db<T>(query: string) {
    return db.query<T>(query)
  }
}