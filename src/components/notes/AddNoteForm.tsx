import { useForm } from 'react-hook-form'
import type { NoteFormData } from '@/types/index'
import ErrorMessage from '../ErrorMessage'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createNote } from '@/services/noteAPI'
import { toast } from 'react-toastify'
import { useLocation, useParams } from 'react-router-dom'

export default function AddNoteForm() {

  
  
  const params = useParams()
  const location = useLocation()

  const queryParams = new URLSearchParams(location.search)

  const projectId = params.projectId!
  const taskId = queryParams.get('showTask')!

  const initialValues : NoteFormData = {
    content:''
  }

  const { register , handleSubmit, reset , formState: {errors} } = useForm({defaultValues:initialValues})

  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationFn: createNote,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (success) => {
      toast.success(success)
      queryClient.invalidateQueries({queryKey:['task', taskId]})
    }
  })
  

  const handleAddNote = ( formData : NoteFormData) => {
    mutate({ formData, projectId, taskId})
    reset()
  }

  return (
    <form 
      onSubmit={handleSubmit(handleAddNote)}
      className="space-y-3"
      noValidate
    >
      <div className="flex flex-col gap-2">
        <label className="font-bold" htmlFor="content">Crear Nota:
        <input 
          id="content"
          type="text" 
          placeholder="Contenido de la Nota"
          className="w-full p-3 border border-gray-300"
          { ...register('content', {
            required: 'El Contenido de la nota es obligatorio'
          })}
        />
        {errors.content && (
          <ErrorMessage> {errors.content?.message}</ErrorMessage>
        )}
        </label>
      </div>
      <input 
        type="submit"
        value="Crear Nota"
        className="bg-orange-500 rounded hover:bg-orange-600 w-full p-2 text-white font-black cursor-pointer"
      />
    </form>
  )
}
