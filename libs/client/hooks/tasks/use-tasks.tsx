import { Branch, Task, TaskFilterOption } from "@taskboard/types"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useAPI } from "../global/use-api"

export function useTasks(branch: Branch) {
  const api = useAPI.context()
  const tasksQuery = useQuery<Task[]>({
    initialData: [],
    queryKey: ['tasks', branch.id],
    queryFn: async () => (await api.get(`/tasks?branch_id=${branch.id}`)).data
  })


  const list = tasksQuery.data
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())

  const [creatingTask, setCreatingTask] = useState(false)
  const [selectedTaskId, selectTaskId] = useState<string | null>(null)
  useEffect(() => { setCreatingTask(false) }, [selectedTaskId])

  const selectedTask = list.find(p => p.id == selectedTaskId) ?? null
  const [filter, setFilter] = useState<TaskFilterOption>('incompleted')

  return { list, selectTaskId, selectedTaskId, selectedTask, filter, setFilter, creatingTask, setCreatingTask }
}