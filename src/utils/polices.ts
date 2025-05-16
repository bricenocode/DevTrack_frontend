import { Project, TeamMember } from "../types";

export const isManager = (managerId: Project['_id'], userId: TeamMember['_id']) => {
  console.log(managerId, userId)
  return managerId === userId
} 