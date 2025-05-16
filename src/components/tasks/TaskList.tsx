import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core"
import { Project, TaskProject, TaskStatus } from "@/types/index"
import TaskCard from "./TaskCard"
import { statusTranslations } from "@/locales/es"
import DropTask from "./DropTask"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateStatus } from "@/services/taskAPI"
import { toast } from "react-toastify"
import { useParams } from "react-router-dom"

type TaskListProps = {
  tasks: TaskProject[],
  canEdit: boolean
}
type GroupedTasks = {
  [key: string]: TaskProject[],
}

const initialStatusGroups: GroupedTasks = {
  pending: [],
  onHold: [],
  inProgress: [],
  underReview: [],
  completed: [],

}


const statusStyles:{ [key:string] : string} = {
  pending: 'border-slate-500',
  onHold: 'border-orange-500',
  inProgress: 'border-blue-500',
  underReview: 'border-purple-500',
  completed: 'border-green-500',
}

export default function TaskList({ tasks, canEdit }: TaskListProps) {

  const groupedTasks = (tasks || []).reduce((acc, task) => {
    let currentGroup = acc[task.status] ? [...acc[task.status]] : [];
    currentGroup = [...currentGroup, task];
    return { ...acc, [task.status]: currentGroup };
  }, initialStatusGroups);
  

  //Ordenador
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      //indica que no se activará el drag hasta que el ratón no se mueva 10px desde su posición inicial.
      distance: 10,
    },
  });
 //Movil
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      //No se activará el drag hasta que el usuario tenga presionado al menos 250 milisegundos el objeto
      delay: 250,
      //Parecido al de distance de activationConstraint pero para pantallas táctiles
      tolerance: 5,
    },
  });

  //Esto asegura que se usarán ambos sensores, asi que funcionará para PC y para móviles.
  const sensors = useSensors(mouseSensor, touchSensor);

  //Volvemos a instanciar todo lo necesario para actualizar el estado de una tarea
  const params = useParams()
  const projectId = params.projectId!

  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationFn: updateStatus,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (success) => {
      queryClient.invalidateQueries({ queryKey: ['editProject', projectId] })
      toast.success(success)
    }
  })



  const handleDragEnd = (e:  DragEndEvent) => {
    const { over, active } = e  
    if( over && over.id){

      const status = over.id as TaskStatus
      const taskId = active.id.toString()
      const data = { projectId, taskId, status }
      mutate(data)

      //Actualización Optimista
      queryClient.setQueryData(['editProject', projectId], (prevData: Project) => {
        const updatedTasks = prevData.tasks.map( (task:TaskProject) => {
          if(task._id === taskId){
            return{
              ...task,
              status
            }
          }
          return task
        })
      
            return{
              ...prevData,
              tasks: updatedTasks
            }
      })
    }

  }

  return (
    <>
      <h2 className="text-5xl font-black text-white my-10">Tareas</h2>

      <div className='flex flex-col gap-5 overflow-x-scroll 2xl:overflow-auto pb-32 sm:flex-row'>
        <DndContext
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          {Object.entries(groupedTasks).map(([status, tasks]) => (
            <div key={status} className='min-w-[270px] 2xl:min-w-0 2xl:w-1/5'>
              <h3 
                className={`capitalize text-xl font-light border-0 rounded ${statusStyles[status]} bg-white p-3 border-l-[15px]`}
              >{statusTranslations[status]}</h3>

            <DropTask status={status}/>

              <ul className='mt-5 space-y-5'>
                {tasks.length === 0 ? (
                  <li className="text-gray-200 text-center pt-3">No Hay tareas</li>
                ) : (
                  tasks.map(task => <TaskCard key={task._id} task={task} canEdit={canEdit} />)
                )}
              </ul>
            </div>
          ))}
        </DndContext>
      </div>
    </>
  )
}
