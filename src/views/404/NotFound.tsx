import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <>
      <div 
        className="font-black text-center text-4xl text-white flex flex-col justify-center items-center"
      >
        <p>Página no encontrada</p>
        <img src="./404.png" alt="error 404" className="rounded-full"/>
      </div>
      <p className="mt-10 text-center text-white">
        Click aqui para volver a proyectos
        <Link className= "text-green-400 text-xl" to={'/'}> proyectos</Link>
      </p>
    </>
  )
}
