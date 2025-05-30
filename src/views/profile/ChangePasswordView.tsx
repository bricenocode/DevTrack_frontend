import { useForm } from "react-hook-form"
import ErrorMessage from "@/components/ErrorMessage"
import { UpdateCurrentUserPasswordForm } from "@/types/index";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { changePassword } from "@/services/profileAPI";

export default function ChangePasswordView() {
  const initialValues : UpdateCurrentUserPasswordForm = {
    currentPassword: '',
    password: '',
    passwordConfirmation: ''
  }

  const { register, handleSubmit,reset,  watch, formState: { errors } } = useForm({ defaultValues: initialValues })

  const { mutate } = useMutation({
    mutationFn: changePassword,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (success) => {
      toast.success(success)
      reset()
    }
  })

  const password = watch('password');

  const handleChangePassword = (formData : UpdateCurrentUserPasswordForm) => {
      mutate(formData)
   }

  return (
    <>
      <div className="mx-auto max-w-3xl">

        <h1 className="text-5xl font-black text-white">Cambiar contraseña</h1>
        <p className="text-2xl font-light text-gray-200 mt-5">Utiliza este formulario para cambiar tu contraseña</p>

        <form
          onSubmit={handleSubmit(handleChangePassword)}
          className=" mt-14 space-y-5  shadow-lg p-10 rounded-lg"
          noValidate
        >
          <div className="mb-5 space-y-3">
            <label
              className="text-sm uppercase font-bold text-white"
              htmlFor="current_password"
            >Contraseña Actual</label>
            <input
              id="current_password"
              type="password"
              placeholder="Contraseña Actual"
              className="w-full p-3  border border-gray-200"
              {...register("currentPassword", {
                required: "La contraseña actual es obligatoria",
              })}
            />
            {errors.currentPassword && (
              <ErrorMessage>{errors.currentPassword.message}</ErrorMessage>
            )}
          </div>

          <div className="mb-5 space-y-3">
            <label
              className="text-sm uppercase font-bold text-white"
              htmlFor="password"
            >Nueva contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="Nueva contraseña"
              className="w-full p-3  border border-gray-200"
              {...register("password", {
                required: "El Nuevo Password es obligatorio",
                minLength: {
                  value: 8,
                  message: 'La contraseña debe ser mínimo de 8 caracteres'
                }
              })}
            />
            {errors.password && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </div>
          <div className="mb-5 space-y-3 text-white">
            <label
              htmlFor="password_confirmation"
              className="text-sm uppercase font-bold"
            >Repetir contraseña</label>

            <input
              id="password_confirmation"
              type="password"
              placeholder="Repetir Password"
              className="w-full p-3  border border-gray-200 text-black"
              {...register("passwordConfirmation", {
                required: "Este campo es obligatorio",
                validate: value => value === password || 'Los contraseñas no son iguales'
              })}
            />
            {errors.passwordConfirmation && (
              <ErrorMessage>{errors.passwordConfirmation.message}</ErrorMessage>
            )}
          </div>

          <input
            type="submit"
            value='Cambiar contraseña'
            className="bg-orange-600 rounded w-full p-3 text-white uppercase font-bold hover:bg-orange-700 cursor-pointer transition-colors"
          />
        </form>
      </div>
    </>
  )
}