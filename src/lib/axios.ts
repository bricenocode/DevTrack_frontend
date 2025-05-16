import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

//Esto te ahorra codigo ya que intercepta la peticion para agregarle algo antes de que llegue a el lugar donde se quiere utilizar

api.interceptors.request.use( config => {
  const token = localStorage.getItem('AUTH_TOKEN')
  if(token){
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api;
