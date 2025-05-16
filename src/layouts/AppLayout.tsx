import { Link, Navigate, Outlet } from "react-router-dom"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/ReactToastify.css'
import Logo from "@/components/Logo"
import NavMenu from "@/components/NavMenu"
import { useAuth } from "@/hooks/useAuth"

export default function AppLayout() {

  const { data, isError, isLoading } = useAuth()

  if(isLoading) return 'Cargando...'
  if(isError){
    return <Navigate to='/auth/login'/>
  }

  if (data) return (
    <>
    <header
      className="bg-[#0c0d0c] py-5"
    >
      <div className="max-w-screen-2xl  mx-auto flex flex-col lg:flex-row justify-between items-center">
        <div className="w-56">
          <Link to="/">
            <Logo/>
          </Link>
        </div>
        <NavMenu name={data.name}/>
      </div>
    </header>
    <section className="max-w-screen-2xl mx-auto mt-10 p-5 min-w-[290px]">
      <Outlet/>
    </section>
    <footer className="py-5 ">
        <p className="text-center text-white">
          Todos los derechos reservados {new Date().getFullYear()}
        </p>
    </footer>
    <ToastContainer 
      pauseOnHover={false}
      pauseOnFocusLoss={false}
    />
    </>
  )
}
