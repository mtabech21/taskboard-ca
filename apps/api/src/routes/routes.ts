import express from 'express'
import accounts from './accounts/accounts'
import portal from './portal/portal'
import taskboard from './public/taskboard'
import payroll from './payroll/_payroll'
import tasks from './tasks/tasks'
import branches from './public/branches'
import company from './public/company'
import spirit from './spirit/spirit'
import logger from '../middleware/logger'
import errors from '../middleware/errors'

const routes = express.Router()

routes.use(logger)

routes.use('/accounts', accounts)
routes.use('/portal', portal)
routes.use('/taskboard', taskboard)
routes.use('/payroll', payroll)
routes.use('/tasks', tasks)
routes.use('/branches', branches)
routes.use('/company', company)
routes.use('/spirit', spirit)

routes.use(errors)

export default routes