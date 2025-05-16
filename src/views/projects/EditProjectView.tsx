import { Navigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getProjectById } from "@/services/projectAPI"
import EditProyectoForm from "@/components/projects/EditProyectoForm"

export default function EditProjectView(){
  const params = useParams()
  const projectId = params.projectId!

  const { data, isLoading, isError } = useQuery({
    queryKey: ['editProject', projectId],
    queryFn: () => getProjectById(projectId),
    retry: false //Esto sirve para deshabilitar el reintento de recuperar la información, si la url o petición no es encontrada.
  })

    if(isLoading){return 'Cargando...'}
    if(isError){return <Navigate to='/404'/>}
    
    if (data) return <EditProyectoForm data={data} projectId={projectId}/>
}
