
import express from 'express'
import db from '../../db'


const surveys = express.Router()
// type Field = {
//   id: string,
//   type: string,
//   ref: string
// }

// type StringAnswer = {
//   field: Field
//   type: "text"
//   text: string
// }

// type NumberAnswer = {
//   field: Field
//   type: "number"
//   number: number
// }

// type BooleanAnswer = {
//   field: Field
//   type: "boolean"
//   boolean: boolean
//}

// type Answer = StringAnswer | NumberAnswer | BooleanAnswer


// eslint-disable-next-line @typescript-eslint/no-unused-vars
// type Response = {
//   answers: Answer[]
// }



surveys
  .route('/responses')
  .get(async (req, res) => {

    res.json([])

  })



surveys
  .route('/hours_budget')
  .get(async (req, res) => {
    const store = req.query.store
    res.json(await db.many(`select * from hours_budget ${store && `WHERE store_number = ${store}`}`))
  })
  .post(async (req, res) => {
    const { store, hours, opening, closing } = req.query as { store: string, hours: string, opening: string, closing: string }
    await db.none(`UPDATE hours_budget SET hours = ${hours}, opening = ${opening}, closing = ${closing} where store_number = '${store}'`)
    res.json(await db.many('select * from hours_budget'))
  })

surveys
  .route('/hours')
  .post(async (req, res) => {
    const { store, date, hours } = req.query as { store: string, date: string, hours: string }
    await db.none(`INSERT INTO daily_hours (store,date,hours) VALUES ('${store}','${date}',${hours})
      ON CONFLICT (store, date) DO UPDATE SET hours = ${hours}`)
    res.send()
  })
  .get(async (req, res, next) => {
    if (req.query.store == 'totals')
      res.json(await db.manyOrNone('SELECT store, sum(hours) total_hours FROM daily_hours GROUP BY store'))
    else if (req.query.store == '' || !req.query.store)
      res.json(await db.manyOrNone(`SELECT * FROM daily_hours`))
    else if (req.query.store && req.query.store != 'totals')
      res.json(await db.manyOrNone(`SELECT * FROM daily_hours WHERE store = '${req.query.store}'`))
    else next('ERROR')
  })


export default surveys