
// import { Branch, Task } from "@taskboard/types"
// import { useQuery } from "@tanstack/react-query"
// import { useEffect, useState } from "react"
// import { useAPI } from "@taskboard/client/hooks/use-api"
// import { UUID } from "crypto"



// export type FilterOption = 'incompleted' | 'late' | 'completed' | 'all'

// type AssociateID = string

// export type AssignageType = 'associate' | 'branch'

// export type AssociateAssignage = {
//   type: 'associate'
//   associate_id: AssociateID
// }

// export type BranchAssignage = {
//   type: 'branch',
//   branch_id: UUID
//   delegation: AssociateID[]
// }

// export type TaskAssignage = BranchAssignage | AssociateAssignage

// export type TaskData = {
//   field: string
//   value: unknown
// }


// export type TaskForm = {
//   id: string
//   fields: TaskField[]
// }

// export type TaskField = {
//   prompt: string,
//   input: TaskFieldInput
// }

// export type TaskFieldInput = StringInput | NumberInput

// type StringInput = {
//   value: string
// }

// type NumberInput = {
//   value: number
// }



// export type TasksFilter = 'not_completed' | 'completed' | 'all' | 'late'

// // const example_tasks: Task[] = [
// //   {
// //     id: '0001',
// //     title: 'Product Translation',
// //     due_date: new Date(2024, 10, 1),
// //     branch_id: '98eb11bc-df41-4b5d-b4a0-1e1b66851b20',
// //     associate_id: 'dasdad',
// //     created_at: new Date(2024, 9, 15),
// //     created_by: {
// //       email: 'mtabech21@gmail.com',
// //       first_name: 'Mohammed',
// //       last_name: 'Tabech',
// //       uuid: '1233'
// //     }
// //   },
// // ]

// export function useTasks(branch: Branch) {
//   const api = useAPI.context()
//   const tasksQuery = useQuery<Task[]>({
//     initialData: [],
//     queryKey: ['tasks', branch.id],
//     queryFn: async () => (await api.get(`/tasks?branch_id=${branch.id}`)).data
//   })


//   const list = tasksQuery.data
//     .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())

//   const [creatingTask, setCreatingTask] = useState(false)
//   const [selectedTaskId, selectTaskId] = useState<string | null>(null)
//   useEffect(() => { setCreatingTask(false) }, [selectedTaskId])

//   const selectedTask = list.find(p => p.id === selectedTaskId) ?? null
//   const [filter, setFilter] = useState<FilterOption>('incompleted')

//   return { list, selectTaskId, selectedTaskId, selectedTask, filter, setFilter, creatingTask, setCreatingTask }
// }