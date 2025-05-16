import Logo from "@/components/Logo"
import { Outlet } from "react-router-dom"
import { ToastContainer } from "react-toastify"

export default function AuthLayout() {
  return (
    <>
      <div className="bg-[#0c0d0c] min-h-screen">
        <div className="py-10 lg:py-20 mx-auto min-w-[300px]">
          <div className="size-80 mx-auto">
          <Logo/>
          </div>
          <div className="mt-10 mx-3 flex flex-col justify-center items-center text-center">
            <div className="min-w-[270] p-2 sm:p-10 w-[500px] lg:w-[800px] md:w-[600px]">
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
