import { DashboardProjectSchema, EditProjectSchema, Project, ProjectFormData, ProjectSchema } from "@/types/index";
import api from "@/lib/axios";
import { isAxiosError } from "axios";



export async function createProject(formData:ProjectFormData){
  try {
    const {data} = await api.post('/projects', formData)
    return data
  } catch (error) {
    if(isAxiosError(error) && error.response){
      throw new Error(error.response.data.error)
    }
  }
}


export async function getProjects(){
  try {
    const { data } = await api('/projects')
    const response = DashboardProjectSchema.safeParse(data)
    if(response.success){
      return response.data
    }
  } catch (error) {
    if(isAxiosError(error) && error.response){
      throw new Error(error.response.data.error)
    }
  }
}

export async function getProjectById(id : Project['_id']){
  try {
    const { data } = await api(`/projects/${id}`);
    const response = EditProjectSchema.safeParse(data);
    if(response.success){
      return response.data;
    } else {
      throw new Error("Error de validación de esquema Zod");
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
}


export async function getFullProject(id : Project['_id']){
  try {
    const { data } = await api(`/projects/${id}`)
    const response = ProjectSchema.safeParse(data)

    if (response.success) {
      return response.data
    } else {
      throw new Error("La validación del esquema falló")
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
    // por si es otro error
    throw error
  }
}

type ProjectAPIType = {
  formData: ProjectFormData,
  projectId: Project['_id']
}

export async function updateProject({formData, projectId }:ProjectAPIType){
  try {

    const {data} = await api.put<string>(`/projects/${projectId}`, formData)
    return data

  } catch (error) {
    if(isAxiosError(error) && error.response){
      throw new Error(error.response.data.error)
    }
  }
}

export async function deleteProject(id : Project['_id']){
  try {
    const { data } = await api.delete(`/projects/${id}`)
    return data
   
  } catch (error) {
    if(isAxiosError(error) && error.response){
      throw new Error(error.response.data.error)
    }
    
  }
}

