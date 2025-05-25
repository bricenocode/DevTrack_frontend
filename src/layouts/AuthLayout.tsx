import Logo from "@/components/Logo"
import { Link, Outlet } from "react-router-dom"
import { ToastContainer } from "react-toastify"

export default function AuthLayout() {
  return (
    <>
      <div className="bg-[#0c0d0c] min-h-screen">
        <div className="py-10 lg:py-20 mx-auto min-w-[290px]">
          <div className="size-44 md:size-80 mx-auto">
            <Link to={"/auth/login"}>
             <Logo/>
            </Link>
          </div>
          <div className="mt-10 mx-3 flex flex-col justify-center items-center text-center">
            <div className="min-w-[270] p-2 sm:p-10 w-[300px] lg:w-[800px] md:w-[700px] sm:w-[500px]">
              <Outlet/>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
      pauseOnHover={false}
       pauseOnFocusLoss={false}
      />
    </>
    
  )
}
