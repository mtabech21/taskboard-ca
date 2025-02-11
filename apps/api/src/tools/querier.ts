import { Orderable, Queriable } from "@taskboard/types";
import db, { Database, Task } from "../db";

type On<T extends object, TOther extends object> = { [K in keyof T]?: keyof TOther }
type AsForColumns<T extends readonly string[]> =
  Partial<Record<T[number], string>>;
type TAsFromTColumns<TColumns extends readonly (readonly any[])[]> = {
    [K in keyof TColumns]: AsForColumns<TColumns[K]>
}; 
type UnionToIntersection<U> =
  (U extends any ? (x: U) => any : never) extends (x: infer I) => any ? I : never;
type RemapKeys<T, M extends Partial<Record<keyof T, string>>> = {
    [K in keyof T as K extends keyof M ? (M[K] extends string ? M[K] : K) : K]: T[K]
  };
type TableOf<T> = T extends Querier<infer R, any, any> ? R : never;
type SelectOptions<T, TKey> = { order_by?: Orderable<T>, select?: TKey[], limit?: number, handleQuery?: (q: string) => void }
function whereString<T>(where: Queriable<T> | '*', table?: string): string | undefined {
  if (where == '*') return
  const t = table ?? ''
  let wheres: string[] = []
  const custom_where = where.where; where.where = undefined
  Object.entries(where).forEach(([key, value]) => {
    switch (typeof value) {
      case "string":
        wheres.push(`${t}${key} = '${value}'`); break;
      case "bigint":
      case "number":
      case "boolean":
        wheres.push(`${t}${key} = ${value}`); break;
      case "object":
        wheres.push(`${t}${key} IN ('${(value as Array<any>).join(`','`)}')`); break;
    }
  })
  if (custom_where) wheres.push(...custom_where)
  return `${table ? '' : 'WHERE '}${wheres.join(' AND ')} `
}

export default class Querier<TTable extends object, TInsert extends object, TDefinedQueries> {
  private table_name; task; defined;
  select; insert; update; delete;

  

  private select_queries = (db: Database) => {    
    const q = <TKey extends keyof TTable>(where: Queriable<TTable>, options?: SelectOptions<TTable, TKey>) => {
      const where_query = whereString(where) ?? ''
      const order = options?.order_by ? 'ORDER BY ' + options.order_by.join(', ') : ''
      const limit = options?.limit ? `LIMIT ${options.limit}` : ''
      const q = `SELECT ${options?.select ? options.select.join(',') : '*'} FROM ${this.table_name} ${where_query}${order} ${limit}`
      options?.handleQuery && options.handleQuery(q)
      return q
    }
    return {
      one: <TKey extends keyof TTable>(where: Queriable<TTable>, options?: SelectOptions<TTable, TKey>) => {
        return options?.select ? db.one<Pick<TTable, TKey>>(q(where,options)) : db.one<TTable>(q(where,options))
      },
      many: <TKey extends keyof TTable>(where: Queriable<TTable>, options?: SelectOptions<TTable, TKey>) => {
        return options?.select ? db.many<Pick<TTable, TKey>>(q(where,options)) : db.many<TTable>(q(where,options))
      },
      oneOrNone: <TKey extends keyof TTable>(where: Queriable<TTable>, options?: SelectOptions<TTable, TKey>) => {
        return options?.select ? db.oneOrNone<Pick<TTable, TKey>>(q(where,options)) : db.oneOrNone<TTable>(q(where,options))
      },
      manyOrNone: <TKey extends keyof TTable>(where: Queriable<TTable>, options?: SelectOptions<TTable, TKey>) => {
        return options?.select ? db.manyOrNone<Pick<TTable, TKey>>(q(where,options)) : db.manyOrNone<TTable>(q(where,options))
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
      const where_query = whereString(where) ?? ''
      const q = `DELETE FROM ${this.table_name} ${where_query}`
      return confirm && db.manyOrNone<TTable>(q)
    }
  }
  private update_queries = (db: Database) => {
    return (where: Queriable<TTable>, to: Partial<TTable>) => {
      const where_query = whereString(where) ?? ''
      const update_query = Object.entries(to).map((v) => {
        let value
        switch (typeof v[1]) {
          case "string":
            value = `'${v}'`; break;
          case "number":
          case "bigint":
          case "boolean":
            value = v; break;
          case "symbol":
          case "undefined":
          case "function":
            value = "null"; break;
          case "object":
            value = `'{${Array(v).join(",")}}'`;break
        }
        return `${v[0]} = ${value}`
      }).join(', ')

      const q = `UPDATE ${this.table_name} SET ${update_query} ${where_query} RETURNING *`
      console.log(q)
      return db.many<TTable>(q)
    }
  }

  constructor(table_name: string, queries: (database: Database) => TDefinedQueries) {
    this.table_name = table_name

    this.select = this.select_queries(db)
    this.insert = this.insert_query(db)
    this.update = this.update_queries(db)
    this.delete = this.delete_queries(db)
    
    this.defined = queries(db)
    
    this.task = (t: Task) => ({
      select: this.select_queries(t),
      insert: this.insert_query(t),
      update: this.update_queries(t),
      delete: this.delete_queries(t),

      defined: queries(t),
    })
  }

  static async join<TFirst extends Querier<any, any, any>,TOthers extends [...Querier<any,any,any>[]],TQueriers extends [TFirst, ...TOthers],TColumns extends { [K in keyof TQueriers]: readonly (keyof TableOf<TQueriers[K]>)[] },TAs extends TAsFromTColumns<TColumns>,TResult extends UnionToIntersection<{[K in keyof TQueriers]: RemapKeys<Pick<TableOf<TQueriers[K]>, TColumns[K][number]>,TAs[K]>}[number]>> (
    queriers: [TFirst, ...TOthers],
    query: {
      select?: TColumns
      as?: TAs
      on: { [K in keyof TOthers]: On<TableOf<TFirst>,TableOf<TOthers[K]>> }
      where?: { [K in keyof TQueriers]: Queriable<TableOf<TQueriers[K]> > | '*' }
    },
  ) {


    function alias(i: number) {
      if (i == 0) return 'ft.'
      return `t${i-1}.`
    }
    const tables = queriers.map(q => q.table_name);
    const first_table = tables[0]; const other_tables = tables.splice(1)

    const columns = query.select ? query.select.map((columns, i) => {
      const table = alias(i)
      const as = query.as?.[i] ?? {}
      return columns.map((c, i) => {
        const alias = (Object.entries(as)[i]?.length > 0) ? ` ${Object.entries(as)[i][1]}` : ''
        return table + String(c) + alias
      }).join(', ')
    }) : '*'

    const joins = other_tables.map((table, i) =>
      `JOIN ${table} t${i} ON ${Object.entries(query.on[i]).map(v => `${'ft.' + v[0]} = ${'t' + i + '.' + String(v[1])}`).join(' AND ')}`)

    const where = query.where ? 'WHERE ' + query.where?.map((v, i) => {
        if (v == '*') return
        const table = alias(i)
        return whereString(v,table)
    }).filter(a => a != undefined).join(' AND ') : ''

    return db.many<TResult>(`
    SELECT ${columns} FROM ${first_table} ft
    ${joins.join('\n    ')} 
    ${where}`).catch((e) => { throw e })
    
  }
  static async tx<T extends [Querier<any,any, any>, ...Querier<any,any, any>[]], TResult>(
    queriers: T,
    action: (
      queriers: { [K in keyof T]: ReturnType<T[K]["task"]>; },
      t: Task
    ) => Promise<TResult>
  ) {
    return await db.tx(async (t: Task) => await action(queriers.map(q => q.task(t)) as { [K in keyof T]: ReturnType<T[K]["task"]> }, t)) 
  }
  static create: <TTable extends object, TInsert extends object = TTable>() => <TDefinedQueries>(table_name: string, queries: (db: Database) => TDefinedQueries) => Querier<TTable,TInsert, TDefinedQueries> = () => ((table_name, queries) => {
          return new Querier(table_name,queries)
  })
  static db<T>(query: string) {
    return db.query<T>(query)
  }
}
