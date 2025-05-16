import { isAxiosError } from "axios";
import api from "@/lib/axios";
import { Project, TeamMember, TeamMemberForm, TeamMembersSchema } from "../types";

export async function findUserByEmail({projectId, formData} : {projectId: Project['_id'], formData: TeamMemberForm}){
    try {

      const url = `/projects/${projectId}/team/find`
      const data = await api.post(url, formData)
      return data
    } catch (error) {
      if(isAxiosError(error) && error.response){
        throw new Error(error.response.data.error)
      }
    }
}

export async function addUserToProject({projectId, id} : {projectId: Project['_id'], id: TeamMember['_id']}){
    try {

        console.log({id})
      const url = `/projects/${projectId}/team`
      const data = await api.post(url, {id})
      return data
    } catch (error) {
      if(isAxiosError(error) && error.response){
        throw new Error(error.response.data.error)
      }
    }
}
export async function getProjectTeam(projectId :  Project['_id']){
    try {

      const url = `/projects/${projectId}/team`
      const data = await api(url)
        console.log(data)
      const response = TeamMembersSchema.safeParse(data.data)
      if(response.success){
        return response
      }
    } catch (error) {
      if(isAxiosError(error) && error.response){
        throw new Error(error.response.data.error)
      }
    }
}

export async function removeMemberFromProject({projectId, id} : {projectId: Project['_id'], id: TeamMember['_id']}){
  try {

    const url = `/projects/${projectId}/team/${id}`
    const data = await api.delete(url)
    return data
  } catch (error) {
    if(isAxiosError(error) && error.response){
      throw new Error(error.response.data.error)
    }
  }
}