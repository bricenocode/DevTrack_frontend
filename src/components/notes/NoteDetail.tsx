import { useAuth } from "@/hooks/useAuth"
import { deleteNote } from "@/services/noteAPI"
import { Note } from "@/types/index"
import { formatDate } from "@/utils/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import { useLocation, useParams } from "react-router-dom"
import { toast } from "react-toastify"

type NoteDatailProps = {
  note: Note
}

export default function NoteDetail({note}: NoteDatailProps) {

  const params = useParams()
  const location = useLocation()

  const queryParams = new URLSearchParams(location.search)

  const projectId = params.projectId!
  const taskId = queryParams.get('showTask')!

  const { data, isLoading } = useAuth()
  const canDelete = useMemo( () =>  data?._id === note.createdBy._id ,[data])

  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationFn: deleteNote,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (success) => {
      toast.success(success)
      queryClient.invalidateQueries({queryKey:['task', taskId]})
    }
  })

  
  if(isLoading) return 'Cargando...'

  return (
    <div className="p-3 flex justify-between items-center">
      <div>
        <p>
          {note.content} por: <span className="font-bold">{note.createdBy.name}</span>
        </p>
        <p className="text-xs text-slate-900">
          {formatDate(note.createdAt)}
        </p>
      </div>
      {canDelete && (
        <button 
          className="bg-red-500 rounded hover:bg-red-600 p-2 text-xs text-white font-bold cursor-pointer"
          onClick={ () => mutate({projectId, taskId, noteId: note._id})}
        >
          Eliminar
        </button>
      )}
    </div>
  )
}