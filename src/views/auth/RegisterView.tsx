import ErrorMessage from "@/components/ErrorMessage";
import { createAccount } from "@/services/authAPI";
import { UserRegistrationForm } from "@/types/index";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function RegisterView() {
  const initialValues: UserRegistrationForm = {
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  };

  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<UserRegistrationForm>({ defaultValues: initialValues });

  const { mutate, isPending } = useMutation({
    mutationFn: createAccount,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (success) => {
      toast.success(success);
      reset();
    },
  });

  const password = watch("password");

  const handleRegister = (formData: UserRegistrationForm) => {
    mutate(formData);
  };

  return (
    <>
      <h1 className="text-5xl font-black text-white">Crear Cuenta</h1>
      <p className="text-2xl font-light text-white mt-5">
        Llena el formulario para {''}
        <span className=" text-orange-600 font-bold"> crear tu cuenta</span>
      </p>

      <form
        onSubmit={handleSubmit(handleRegister)}
        className="space-y-8 p-10 mt-10 bg-transparent"
        noValidate
      >
        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl text-white" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full p-3 border-gray-300 border"
            {...register("email", {
              required: "El Email de registro es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>

        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl text-white" htmlFor="name">
            Nombre
          </label>
          <input
            id="name"
            type="text"
            placeholder="Nombre de Registro"
            className="w-full p-3 border-gray-300 border"
            {...register("name", {
              required: "El Nombre de usuario es obligatorio",
            })}
          />
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        </div>

        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl text-white" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password de Registro"
            className="w-full p-3 border-gray-300 border"
            {...register("password", {
              required: "El Password es obligatorio",
              minLength: {
                value: 8,
                message: "El Password debe ser mínimo de 8 caracteres",
              },
            })}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl text-white" htmlFor="passwordConfirmation">
            Repetir Password
          </label>
          <input
            id="passwordConfirmation"
            type="password"
            placeholder="Repite Password de Registro"
            className="w-full p-3 border-gray-300 border"
            {...register("passwordConfirmation", {
              required: "Repetir Password es obligatorio",
              validate: (value) =>
                value === password || "Los passwords no son iguales",
            })}
          />
          {errors.passwordConfirmation && (
            <ErrorMessage>{errors.passwordConfirmation.message}</ErrorMessage>
          )}
        </div>

        <input
          type="submit"
          value={isPending ? 'Registrando...' : 'Registrarme'}
          className="bg-orange-600 hover:bg-orange-700 w-full p-3 text-white font-black text-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting || isPending}
        />
      </form>

      <nav className="mt-10 flex flex-col space-y-4">
        <Link to="/auth/login" className="text-center text-gray-300 font-normal">
          ¿Ya tienes cuenta? Inicia Sesión!
        </Link>
        <Link to="/auth/forgot-password" className="text-center text-gray-300 font-normal">
          ¿Olvidaste tu contraseña?
        </Link>
      </nav>
    </>
  );
}