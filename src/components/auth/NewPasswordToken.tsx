import { validateToken } from '@/services/authAPI';
import { ConfirmToken } from '@/types/index';
import { PinInput, PinInputField } from '@chakra-ui/pin-input';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

type NewPasswordTokenProps = {
    token: ConfirmToken['token'],
    setToken:  React.Dispatch<React.SetStateAction<string>>,
    setIsValidToken: React.Dispatch<React.SetStateAction<boolean>>
}


export default function NewPasswordToken({token, setToken, setIsValidToken}:NewPasswordTokenProps) {

    const { mutate } = useMutation({
        mutationFn: validateToken,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (success) => {
        toast.success(success)
        setIsValidToken(true)
        }
    })

    const handleChange = (token: string) => {
        setToken(token)
    }
    const handleComplete = (token: string) => {
        mutate({token})
    }

    return (
        <>
            <form
                className="space-y-8 p-10 rounded-lg mt-10"
            >
                <label
                    className="font-normal text-2xl text-center text-white block"
                >Código de 6 dígitos</label>
                <div className="flex justify-center gap-5">
                    <PinInput value={token} onChange={handleChange} onComplete={handleComplete}>
                        <PinInputField className="size-14 p-4 rounded-lg border-orange-600 border placeholder-white text-2xl font-bold text-center" />
                        <PinInputField className="size-14 p-4 rounded-lg border-orange-600 border placeholder-white text-2xl font-bold text-center" />
                        <PinInputField className="size-14 p-4 rounded-lg border-orange-600 border placeholder-white text-2xl font-bold text-center" />
                        <PinInputField className="size-14 p-4 rounded-lg border-orange-600 border placeholder-white text-2xl font-bold text-center" />
                        <PinInputField className="size-14 p-4 rounded-lg border-orange-600 border placeholder-white text-2xl font-bold text-center" />
                        <PinInputField className="size-14 p-4 rounded-lg border-orange-600 border placeholder-white text-2xl font-bold text-center" />
                    </PinInput>
                </div>
            </form>
            <nav className="mt-10 flex flex-col space-y-4">
                <Link
                    to='/auth/forgot-password'
                    className="text-center text-gray-300 font-normal"
                >
                    Solicitar un nuevo Código
                </Link>
            </nav>
        </>
    )
}