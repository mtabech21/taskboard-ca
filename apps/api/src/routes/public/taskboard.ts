import express from 'express'


const taskboard = express.Router()

// taskboard
//   .route('/user/:uuid')
//   .get(async (req, res) => {
//     const { uuid } = req.params
//     const list = req.query.list as string

//     const tb = list == 'true' ? await Taskboard.get_branches_from_user(uuid) : await Taskboard.get_branch_from_user(uuid)
//     res.json(tb)
//   })

export default taskboard