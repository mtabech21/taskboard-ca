import express from 'express'
import { public_key } from '../secret'
import auth_route from './auth'
import surveys from './surveys/surveys'

const public_routes = express.Router()

public_routes
  .use('/public/key', (req, res) => { res.json(public_key) })
  .use('/auth', auth_route)
  .use('/surveys', surveys)

export default public_routes