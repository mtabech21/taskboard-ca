// import { useMutation, useQueryClient } from "@tanstack/react-query";

// import { useEffect } from "react";


// import { Task } from "@taskboard/types";
// import { useAPI } from "@taskboard/client/hooks/use-api";

// function useTask(task: Task) {
//   const api = useAPI.context()
//   const client = useQueryClient()

//   const taskView = useMutation<string>({
//     mutationKey: ['task', task.id],
//     mutationFn: async () => (await api.post(`/tasks/view?task_id=${task.id}`)).data.task_id,
//     onSuccess: (d) => client.setQueryData(['tasks', task.branch_id], (tasks: Task[]) => {
//       return tasks.map((t => {
//         if (t.id === d) return { ...t, viewed_at: new Date() } as Task
//         else return t
//       }))
//     })
//   })

//   useEffect(() => { !task.viewed_at && taskView.mutate() }, [taskView, task])

//   return {
//     task
//   }
// }

// export default useTask