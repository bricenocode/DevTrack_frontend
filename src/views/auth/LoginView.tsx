import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { UserLoginForm } from "@/types/index";
import ErrorMessage from "@/components/ErrorMessage";
import { login } from "@/services/authAPI";
import { toast } from "react-toastify";

export default function LoginView() {

  const initialValues: UserLoginForm = {
    email: '',
    password: '',
  }
  const { register, handleSubmit , formState: { errors } } = useForm({ defaultValues: initialValues })
  const navigate = useNavigate()
  const { mutate } = useMutation({
    mutationFn: login,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      navigate('/')
    }
  })

  const handleLogin = (formData: UserLoginForm) => { mutate(formData) }

  return (
    <>
    <h1 className="text-3xl md:text-5xl font-black text-white">Inicia Sesión</h1>
      <p className="text-sm md:text-md font-light text-white mt-5 ">
        Comienza a planear tus proyectos {''}
        <span className=" text-orange-600 font-bold"> iniciando sesión</span>
        {''} en este formulario
      </p>

      <form
        onSubmit={handleSubmit(handleLogin)}
        className="space-y-6 p-5 mt-5 md:space-y-8 md:p-10 md:mt-10 bg-transparent"
        noValidate
      >
        <div className="flex flex-col gap-3 md:gap-5">
          <label
            className="font-normal text-base md:text-2xl text-white"
            htmlFor="email"
          >Email</label>

          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full p-2 md:p-3 border-gray-300 border"
            {...register("email", {
              required: "El Email es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.email && (
            <ErrorMessage>{errors.email.message}</ErrorMessage>
          )}
        </div>

        <div className="flex flex-col gap-3 md:gap-5">
          <label
            className="font-normal text-base md:text-2xl text-white"
            htmlFor="password"
          >Password</label>

          <input
            id="password"
            type="password"
            placeholder="Password de Registro"
            className="w-full p-2 md:p-3 border-gray-300 border"
            {...register("password", {
              required: "El Password es obligatorio",
            })}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        <input
          type="submit"
          value='Iniciar Sesión'
          className="bg-orange-600 hover:bg-orange-700 w-full p-2 md:p-3 text-white font-black text-lg md:text-xl cursor-pointer"
        />
      </form>
      <nav className="mt-5 md:mt-10 flex flex-col space-y-3 md:space-y-4">
        <Link
          to={"/auth/register"}
          className="text-center text-gray-300 font-normal text-sm md:text-base"
        >
          ¿No tiene cuenta? ¡Crea Una!
        </Link>

        <Link
          to={"/auth/forgot-password"}
          className="text-center text-gray-300 font-normal text-sm md:text-base"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </nav>
    </>
  )
}