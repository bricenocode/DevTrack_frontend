import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { toast } from 'react-toastify'
import { useMutation  } from "@tanstack/react-query";
import ProjectForm from "@/components/projects/ProjectForm";
import { ProjectFormData } from "@/types/index";
import { createProject } from "@/services/projectAPI";

export default function CreateProjectView() {

  const navigate = useNavigate();

  const initialValues: ProjectFormData = {
    projectName: '',
    clientName: '',
    description: ''
  }

  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues });

  const mutation = useMutation({
    mutationFn: createProject,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (response) => {
      toast.success(response)
      navigate('/')
    }
  })

  const handleForm = (data: ProjectFormData) => { mutation.mutate(data) }

  return (
    <>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-black text-white"> Crear Proyecto </h1>
        <p className="text-2xl font-light text-slate-200 mt-5">Llena el siguiente formulario para poder crear un proyecto</p>
        <nav className="my-5">
          <Link
            className="bg-orange-700 hover:bg-orange-950 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
            to="/"
          >
            Volver a Proyectos
          </Link>
        </nav>

        <form
          className="mt-10 bg-white shadow-lg p-10 rounded-lg"
          onSubmit={handleSubmit(handleForm)}
          noValidate
        >
          <ProjectForm
            register={register}
            errors={errors}
          />
          <input type="submit"
            value="Crear Proyecto"
            className=" rounded  bg-orange-700 hover:bg-orange-950 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors"
          />
        </form>
      </div>
    </>
  )
}
