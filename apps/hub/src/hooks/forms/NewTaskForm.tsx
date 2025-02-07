import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Branch, Task } from "@taskboard/types";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@shad/form'
import { Input } from '@shad/input'
import { useHub } from "@taskboard/client/hooks/accounts/use-hub";
import { useAPI } from "@taskboard/client/hooks/global/use-api";

type NewTask = {
  title: string,
  created_by: string,
  due_date: Date,
  branch_id?: string,
  associate_id?: string
}

const newTaskFormSchema = z.object({
  title: z.string().min(5, 'Requires at least 5 characters.'),
  created_by: z.string().uuid(),
  due_date: z.date().min(new Date()),
  branch_id: z.string().uuid().optional(),
  associate_id: z.string().uuid().optional()
})
  .refine(c => c.branch_id !== undefined || c.associate_id !== undefined, 'Task not assigned.')

function useCreateTask(branch: Branch) {
  const api = useAPI.context()
  const { account, puncher: { badges } } = useHub.context()
  const form = useForm<z.infer<typeof newTaskFormSchema>>({
    resolver: zodResolver(newTaskFormSchema),
    defaultValues: {
      title: '',
      created_by: account.associate_data?.associate_id,
    }
  })



  const taskMutator = useMutation({
    mutationKey: ['create_task', branch.id],
    mutationFn: async (task: NewTask) => (await api.post('/tasks', task)).data as Task
  })

  const create = taskMutator.mutate
  const submit = (d: NewTask) => { create(d) }

  return { form, submit, associates: badges }
}

function NewTaskForm(props: { branch: Branch }) {
  const { form, submit } = useCreateTask(props.branch)
  return (
    <div className="flex flex-col gap-5 h-full w-full justify-center items-center font-mono bg-white cursor-default select-none">
      <h1 className="text-2xl">New Task</h1>
      <div className="bg-gray-50 rounded border p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)}>
            <FormField control={form.control} name="title" render={({ field }) =>
              <FormItem className="w-64">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input className="bg-white" {...field} />
                </FormControl>
                <FormDescription>Give your new task a title.</FormDescription>
              </FormItem>
            } />
          </form>
        </Form>
      </div>
    </div>
  )
}

export default NewTaskForm