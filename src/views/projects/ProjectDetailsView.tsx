import { Navigate, useNavigate, useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getFullProject } from "@/services/projectAPI"
import AddTaskModal from "@/components/tasks/AddTaskModal";
import TaskList from "@/components/tasks/TaskList";
import EditTaskData from "@/components/tasks/EditTaskData";
import TaskModalDetails from "@/components/tasks/TaskModalDetails";
import { useAuth } from "@/hooks/useAuth";
import { isManager } from "@/utils/polices";
import { useMemo } from "react";
export default function ProjectDetailsView() {
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId!;

  const { data: user, isLoading: authLoading } = useAuth();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['editProject', projectId],
    queryFn: () => getFullProject(projectId),
    retry: false, // Esto sirve para deshabilitar el reintento de recuperar la información, si la url o peticion no es encontrada.
  });

  const canEdit = useMemo(() => data?.manager?._id === user?._id, [data, user]);

  // Comprobamos si los datos aún están cargando
  if (isLoading || authLoading) {
    return <div>Cargando...</div>; // Puedes usar un spinner o cualquier otro indicador de carga.
  }

  // Si hay error, redirigimos a la página 404
  if (isError) {
    return <Navigate to='/404' />;
  }

  // Aseguramos que 'data' y 'user' están definidos antes de acceder a sus propiedades
  if (data && user) {
    return (
      <>
        <h1 className="text-5xl font-black text-white">{data.projectName}</h1>
        <p className="text-2xl font-light text-gray-200 mt-5">{data.description}</p>
        {data.manager?._id && isManager(data.manager._id, user._id) && (
          <nav className="my-5 flex flex-col sm:flex-row gap-3 max-w-64 ">
            <button
              type="button"
              className="bg-orange-700 rounded-lg hover:bg-orange-900 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
              onClick={() => navigate(location.pathname + '?newTask=true')}
            >
              Agregar Tarea
            </button>

            <Link
              to={'team'}
              className="bg-orange-800 rounded-lg hover:bg-orange-950 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
            >
              Colaboradores
            </Link>
          </nav>
        )}
        <TaskList tasks={data.tasks} canEdit={canEdit} />
        <AddTaskModal />
        <EditTaskData />
        <TaskModalDetails />
      </>
    );
  }

  // Devolver un mensaje si no se tienen los datos del proyecto o del usuario
  return <div>No se encontró el proyecto o usuario.</div>;
}
