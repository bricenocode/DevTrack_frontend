import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PinInput, PinInputField } from '@chakra-ui/pin-input'
import { useMutation } from "@tanstack/react-query"; 
import { ConfirmToken } from "@/types/index";
import { confirmAccount } from "@/services/authAPI";
import { toast } from "react-toastify";

export default function ConfirmAccountView() {
  const navigate = useNavigate()
  const [token, setToken] = useState<ConfirmToken['token']>('')

  const { mutate } = useMutation({
    mutationFn: confirmAccount,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (success) => {
      toast.success( success)
      navigate('/auth/login')
    }
  })


  const handleChange = (token:ConfirmToken['token']) => {
    setToken(token)
  }

  const handleComplete = (token: ConfirmToken['token']) => {
    mutate({token})
  }

  return (
    <>
      <h1 className="text-5xl font-black text-white">Confirma tu Cuenta</h1>
      <p className="text-2xl font-light text-white mt-2">
        Ingresa el código que recibiste {''}
        <span className=" text-orange-500 font-bold"> por e-mail</span>
      </p>
      <form
        className="space-y-8 p-10 mt-2 rounded-lg"
      >
        <label
          className="font-normal text-2xl text-center block text-white"
        >Código de 6 dígitos</label>
        <div className=" flex justify-center gap-2 md:gap-5">
          <PinInput value={token} onChange={handleChange} onComplete={handleComplete}>
            <PinInputField className="size-3 md:size-12 p-4 rounded-lg border-orange-600 border placeholder-white text-2xl font-bold text-center"></PinInputField>
            <PinInputField className="size-3 md:size-12 p-4 rounded-lg border-orange-600 border placeholder-white text-2xl font-bold text-center"></PinInputField>
            <PinInputField className="size-3 md:size-12 p-4 rounded-lg border-orange-600 border placeholder-white text-2xl font-bold text-center"></PinInputField>
            <PinInputField className="size-3 md:size-12 p-4 rounded-lg border-orange-600 border placeholder-white text-2xl font-bold text-center"></PinInputField>
            <PinInputField className="size-3 md:size-12 p-4 rounded-lg border-orange-600 border placeholder-white text-2xl font-bold text-center"></PinInputField>
            <PinInputField className="size-3 md:size-12 p-4 rounded-lg border-orange-600 border placeholder-white text-2xl font-bold text-center"></PinInputField>
          </PinInput>
        </div>
      </form>

      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          to='/auth/request-code'
          className="text-center text-gray-200 font-normal"
        >
          Solicitar un nuevo Código
        </Link>
      </nav>

    </>
  )
}