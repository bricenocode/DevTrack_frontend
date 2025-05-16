import {Fragment} from 'react'
import {Link, useLocation, useNavigate} from "react-router-dom"
import {Menu, MenuButton, MenuItem, MenuItems, Transition} from '@headlessui/react'
import {useQuery} from '@tanstack/react-query'
import {EllipsisVerticalIcon} from '@heroicons/react/20/solid'
import {getProjects} from "@/services/projectAPI"
import {useAuth} from "@/hooks/useAuth"
import {isManager} from "@/utils/polices"
import DeleteProjectModal from '@/components/projects/DeleteProjectModal'

export default function DashboardView() {

  const location = useLocation();
  const navigate = useNavigate()
  const { data: user, isLoading: authLoading } = useAuth()
  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
    
  })


  if (isLoading && authLoading) {
    return 'Cargando...'
  }
  //Esto es recomendado por la documentación de ReactQuery.
  if (data && user) return (
    <>
      <h1 className="text-5xl font-black text-white"> Mis Proyectos </h1>
      <p className="text-2xl font-light text-gray-200 mt-5">Maneja y administra tus proyectos</p>
      <nav className="my-5">
        <Link
          className="bg-orange-700 rounded-lg hover:bg-orange-900 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
          to="/projects/create"
        >
          Nuevo Proyecto
        </Link>
      </nav>

      {data.length ? (
        <ul role="list" className="divide-y rounded-2xl rounded-2xlborder-orange-800 mt-10 shadow-lg">
          {data.map((project) => (
            <li key={project._id} className="flex rounded-2xl justify-between bg-stone-300 gap-x-6 px-5 py-10  border-orange-700 border-l-8 my-5">
              <div className="flex min-w-0 gap-x-4 ">
                <div className="min-w-0 flex-auto space-y-2 ">
                  <div className="mb-2">
                    {
                      project.manager._id === user._id ?
                        <p className="font-bold text-xs uppercase bg-purple-50 text-purple-600 border-2 border-purple-600 rounded-lg inline-block py-1 px-5">Manager</p>
                        :
                        <p className="font-bold text-xs uppercase bg-slate-50 text-slate-600 border-2 border-slate-600 rounded-lg inline-block py-1 px-5">Colaborador</p>
                    }
                  </div>

                  <Link to={`/projects/${project._id}`}
                    className="relative inline-block text-gray-900 text-3xl font-bold cursor-pointer transition-all duration-300
             hover:text-gray-900 hover:bg-white/40 hover:backdrop-blur-sm pr-2 rounded"
                  >{project.projectName}</Link>
                  <p className="text-lg text-gray-900">
                    Cliente: {project.clientName}
                  </p>
                  <p className="text-md text-gray-700">
                    {project.description}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-x-6">
                <Menu as="div" className="relative flex-none">
                  <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                    <span className="sr-only">opciones</span>
                    <EllipsisVerticalIcon className="h-9 w-9" aria-hidden="true" />
                  </MenuButton>
                  <Transition as={Fragment} enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95">
                    <MenuItems
                      className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
                    >
                      <MenuItem>
                        <Link to={`/projects/${project._id}`}
                          className='block px-3 py-1 text-sm leading-6 text-gray-900'>
                          Ver Proyecto
                        </Link>
                      </MenuItem>
                      {isManager(project.manager._id, user._id) && (
                        <>
                          <MenuItem>
                            <Link to={`/projects/${project._id}/edit`}
                              className='block px-3 py-1 text-sm leading-6 text-gray-900'>
                              Editar Proyecto
                            </Link>
                          </MenuItem>
                          <MenuItem>
                            <button
                              type='button'
                              className='block px-3 py-1 text-sm leading-6 text-red-500'
                              onClick={() => navigate( location.pathname + `?deleteProject=${project._id}`)}
                            >
                              Eliminar Proyecto
                            </button>
                          </MenuItem>
                        </>
                      )}
                    </MenuItems>
                  </Transition>
                </Menu>
              </div>
            </li>
          ))}
        </ul>
      ) : (

        <p className=" text-centr py-20 ">No hay proyectos aún {''}
          <Link
            to='/projects/create'
            className="text-orange-500 font-bold "
          >

            Crear Proyecto </Link>
        </p>

      )
      }
    <DeleteProjectModal/>
    </>
  )
}
