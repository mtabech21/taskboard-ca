import { IoCheckbox, IoLayers, IoListCircle, IoPerson, IoStorefront, IoTime } from "react-icons/io5";
import style from '../../../../styles/tb.module.scss'
import { Clock } from "lucide-react";

import { Task, TaskFilterOption } from "@taskboard/types";
import NewTaskForm from "../../../../hooks/forms/NewTaskForm";
import { useHub } from "@taskboard/client/hooks/accounts/use-hub";
import { useTask } from "@taskboard/client/hooks/tasks/use-task";
import { cn } from "@taskboard/client/ui/src/utils";

function FilterOptions(props: { selectedFilter: TaskFilterOption, onFilterChange: (filter: TaskFilterOption) => void }) {
  return (
    <div className={`text-gray-600 bg-white border-r`}>
      <FilterButton title="Tasks" selected={props.selectedFilter === 'incompleted'} filter="incompleted" onClick={f => props.onFilterChange(f)} />
      <FilterButton title="Late Tasks" selected={props.selectedFilter === 'late'} filter="late" onClick={f => props.onFilterChange(f)} />
      <FilterButton title='Completed Tasks' selected={props.selectedFilter === 'completed'} filter="completed" onClick={f => props.onFilterChange(f)} />
      <FilterButton title='All Tasks' selected={props.selectedFilter === 'all'} filter="all" onClick={f => props.onFilterChange(f)} />
    </div>
  )
}

function Taskboard() {
  const { tasks, selectedBranch } = useHub.context()

  return (
    <div className='flex bg-white overflow-hidden flex-col border-t flex-1'>
      <div className='flex h-full'>
        <div className='flex border-r bg-gray-50 min-w-[20em] h-full'>
          <FilterOptions selectedFilter={tasks.filter} onFilterChange={f => tasks.setFilter(f)} />
          <div className={style.taskListContainer}>
            <div className="bg-white border-b font-mono font-bold text-center">
              {
                tasks.filter === 'late' ? 'Late Tasks'
                  : tasks.filter === 'completed' ? 'Completed Tasks'
                    : tasks.filter === 'all' ? 'All Tasks' : 'Tasks'}
            </div>
            <div className={style.taskList}>
              {
                tasks.list
                  .filter((task) => {
                    switch (tasks.filter) {
                      case "incompleted": return (task.completed_at === undefined)
                      case "late": return (Date.now() > new Date(task.due_date).getTime())
                      case "completed": return task.completed_at !== undefined
                      case "all": return true
                      default: return true
                    }
                  })
                  .map((task) => (
                    <TaskPreview task={task} key={task.id} />
                  ))
              }
            </div>
          </div>
        </div>
        {tasks.selectedTask ? <div className="p-5">
          <TaskView selectedTask={tasks.selectedTask} />
        </div> :
          tasks.creatingTask ? <NewTaskForm branch={selectedBranch} /> :
            <div className="flex flex-col gap-5 h-full w-full justify-center items-center font-mono text-gray-400 bg-white cursor-default select-none">
              <div>No task selected.</div>
              <div onClick={() => tasks.setCreatingTask(true)} className="text-sm items-center flex gap-1 px-3 py-1 rounded-full font-bold text-blue-600 hover:cursor-pointer hover:bg-blue-50">Create Task</div>
            </div>}
      </div>
    </div>
  );
}

function TaskView(props: { selectedTask: Task }) {
  const { task } = useTask(props.selectedTask)
  return (
    <div className="text-3xl">{task.title}</div>
  )
}

function TaskPreview(props: { task: Task }) {
  const { task } = props
  const { tasks: { selectedTaskId, selectTaskId } } = useHub.context()
  const days_left = ((new Date(props.task.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  const days_left_element = days_left < 0 ? <>Late</> : <>{days_left.toFixed()} day{days_left > 1 ? 's' : ''}</>

  const selected = task.id === selectedTaskId
  const completed = task.completed_at !== undefined
  const unopened = !task.viewed_at
  const late = Date.now() > new Date(task.due_date).getTime()

  return (
    <div className={cn('flex justify-between bg-white border hover:bg-slate-100 m-0.5 rounded overflow-hidden hover:cursor-pointer', { 'bg-gray-100 text-gray-400': completed, 'bg-slate-100': selected })} onClick={() => { selectTaskId(selected ? null : task.id) }}>
      <div className="flex">
        <div className={cn('w-2', { ' bg-gray-600': true, 'bg-green-600': completed, 'bg-orange-600': late, 'bg-gray-400': false, 'bg-blue-600 font-bold': selected, })} />
        <div className={"p-3 font-mono text-left"}>
          <div className={cn("text-sm", { 'font-bold': unopened, 'line-through': false })}>{task.title}</div>
          <div className="text-gray-500 text-xs">{
            completed ? 'Completed'
              : <div className="flex gap-1 items-center"><Clock size={12} /><div className={cn("font-bold", { 'text-orange-700': days_left < 5 })}>{days_left_element}</div></div>}</div>
        </div>
      </div>
      <div style={{ color: unopened ? 'black' : "gray", fontFamily: "monospace", display: "flex", justifyContent: "center", alignItems: "center" }}>
        {task.associate_id ?
          <IoPerson style={{ fontSize: "1.2em", margin: "1em" }} /> :
          task.branch_id ?
            <IoStorefront style={{ fontSize: "1.2em", margin: "1em" }} />
            : <div></div>
        }
      </div>
    </div>
  )
}

function FilterButton(props: { title: string, selected: boolean, filter: TaskFilterOption, onClick: (filter: TaskFilterOption) => void }) {

  return (
    <div title={props.title} onClick={() => { props.onClick(props.filter) }} className={`${style.filterBtn}`} >
      {
        props.filter === 'incompleted' ? <IoListCircle className={cn({ 'text-primary': props.selected })} />
          : props.filter === 'late' ? <IoTime className={cn({ 'text-orange-600': props.selected })} />
            : props.filter === 'completed' ? <IoCheckbox className={cn({ 'text-green-600': props.selected })} />
              : props.filter === 'all' ? <IoLayers className={cn({ 'text-yellow-600': props.selected })} />
                : <div></div>
      }
    </div>
  )
}



export default Taskboard;
