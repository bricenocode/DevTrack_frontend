import { Link, useNavigate } from "react-router-dom";
import ProjectForm from "./ProjectForm";
import { Project, ProjectFormData } from "@/types/index";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProject } from "@/services/projectAPI";
import { toast } from "react-toastify";

type EditProyectoFormProps = {
  data: ProjectFormData,
  projectId: Project['_id']
}

export default function EditProyectoForm({data, projectId}:EditProyectoFormProps) {

  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: {
    projectName: data.projectName,
    clientName: data.clientName,
    description: data.description
  } });

  const queryClient = useQueryClient()
  const {mutate} = useMutation({
    mutationFn: updateProject,
    onError: (error) => {
      toast.error(error.message)
    }, 
    onSuccess: (response) => {
      //Esto es para invalidar o volver a recuperar los datos para evitar que use los ya cacheados.
      queryClient.invalidateQueries({queryKey: ['projects']})
      queryClient.invalidateQueries({queryKey: ['editProject', projectId]})
      toast.success(response)
      navigate('/')
    }
  })

  const handleForm = (formData: ProjectFormData) => {
   const data = {
      formData,
      projectId
    }
    mutate(data)
  }

  return (
   <>
    <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-black text-white"> Editar Proyecto </h1>
        <p className="text-2xl font-light text-gray-300 mt-5">Llena el siguiente formulario para poder editar el proyecto</p>
        <nav className="my-5">
          <Link
            className="bg-orange-400 hover:bg-orange-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
            to="/"
          >
            Volver a Proyectos
          </Link>
        </nav>

        <form
          className="mt-10 bg-neutral-300  shadow-lg p-10 rounded-lg"
          onSubmit={handleSubmit(handleForm)}
          noValidate
        >
          <ProjectForm
            register={register}
            errors={errors}
          />
          <input type="submit"
            value="Guardar Cambios"
            className="bg-orange-600 rounded hover:bg-orange-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors"
          />
        </form>
      </div>
   </>
  )
}
