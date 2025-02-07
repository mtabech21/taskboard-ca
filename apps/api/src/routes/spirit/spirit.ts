import axios from 'axios'
import express from 'express'

const spirit = express.Router()

spirit.route('/live_sales')
  .get(async (req, res, next) => {
    try {
      const sales = (await axios.get("https://bot.metesolutions.com/spirit/live_sales")).data as { date: Date, store_number: string, sales: number, plan: number }[]
      if (req.query.store)
        res.json(sales.find(p => p.store_number == req.query.store))
      else
        res.json(sales)
    } catch (e) {
      next(e)
    }
  })

export default spirit  