import { addUserToProject } from "@/services/teamAPI"
import { TeamMember } from "@/types/index"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"

type SearchResultProps = {
  user: TeamMember,
  reset: () => void
}


export default function SearchResult({user, reset}:SearchResultProps) {

  const params = useParams()
  const projectId = params.projectId!
  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationFn: addUserToProject,
    onError: (error) => {
      toast.error(error.message)
    }, 
    onSuccess: () => {
      toast.success('El usuario ha sido agregado al proyecto!');
      reset()
      queryClient.invalidateQueries({queryKey:['projectTeam']})
    }

  })

  const handleAddUserToProject = () => {
    mutate({projectId, id: user._id})
  }

  return (
    <>
      <p className="mt-10 text-center font-bold">Resultado: </p>
      <div className="flex justify-evenly md:justify-between items-center gap-2">
          <p>{user.name}</p>
          <button
            className="text-orange-600 text-sm hover:text-orange-700  py-2 font-bold cursor-pointer"
            onClick={handleAddUserToProject}
            >
            Agregar al Proyecto
          </button>
      </div>
    </>
  )
}
