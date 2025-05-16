import { z} from 'zod'

/* Auth & Users */

const AuthSchema =  z.object({
  name: z.string(),
  email: z.string().email(),
  currentPassword: z.string(),
  password: z.string(),
  passwordConfirmation: z.string(),
  token:z.string()
})


type Auth = z.infer<typeof AuthSchema>
export type UserLoginForm = Pick<Auth, 'email' | 'password'>
export type UserRegistrationForm = Pick<Auth, 'name'| 'email' | 'password' | 'passwordConfirmation'>
export type RequestConfirmationCodeForm = Pick<Auth, 'email'>
export type     ConfirmToken = Pick<Auth, 'token'>
export type ForgotPasswordForm = Pick<Auth, 'email'>
export type NewPasswordForm = Pick<Auth, 'password' | 'passwordConfirmation'>
export type UpdateCurrentUserPasswordForm = Pick<Auth,'currentPassword' | 'password' | 'passwordConfirmation'>
export type CheckPasswordForm = Pick<Auth, 'password'>

/* Users */

export const UserSchema = AuthSchema.pick({
  name: true,
  email: true,
}).extend({
  _id: z.string()
})

export type User = z.infer<typeof UserSchema>
export type UserProfileForm = Pick<User, 'name' | 'email'>

/* Notes */

const NoteSchema = z.object({
  _id: z.string(),
  content: z.string(),
  createdBy: UserSchema,
  task: z.string(),
  createdAt: z.string()
})

export type Note = z.infer<typeof NoteSchema>
export type NoteFormData = Pick<Note, 'content'>

/* Tasks */
export const taskStatusSchema = z.enum(["pending" , "onHold" , "inProgress" , "underReview" , "completed"])
export type TaskStatus = z.infer<typeof taskStatusSchema>

export const TaskSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  project:z.string(),
  status: taskStatusSchema,
  completedBy: z.array(z.object(
    {
      _id: z.string(),
      user: UserSchema.or(z.null()),
      status: taskStatusSchema
    }

  )) /*Con esto le indicas que puede ser nulo o del tipo userSchema */,
  notes: z.array(NoteSchema.extend({
    createdBy: UserSchema
  })),
  createdAt: z.string(),
  updatedAt: z.string()
})

export const DashboardTaskSchema = z.array(
  TaskSchema.pick({
    _id: true,
    name: true,
    description: true,
    project: true,
    status: true
  })
)

export const taskProjectSchema = TaskSchema.pick({
  _id: true,
  name: true,
  description: true,
  status: true,
})
export type Task = z.infer<typeof TaskSchema>
export type TaskFormData = Pick<Task, 'name' | 'description'>
export type TaskProject = z.infer<typeof taskProjectSchema>


/* Projects */
export const ProjectSchema = z.object({
  _id: z.string(),
  projectName: z.string(),
  clientName: z.string(),
  description: z.string(),
  manager: UserSchema,
  tasks: z.array(taskProjectSchema),
  team: z.array(UserSchema)
})

export const DashboardProjectSchema = z.array(
  ProjectSchema.pick({
    _id: true,
    projectName: true,
    clientName: true,
    description: true,
    manager: true,
  })
)

export const EditProjectSchema = ProjectSchema.pick({
  projectName: true,
  clientName: true,
  description: true,
})

export type Project = z.infer<typeof ProjectSchema>
export type ProjectFormData = Pick<Project, 'projectName' | 'clientName'| 'description'>


/* Team */

const teamMemberSchema = UserSchema.pick({
  name:true,
  email:true,
  _id:true
})

export const TeamMembersSchema = z.array(teamMemberSchema)
export type TeamMember = z.infer<typeof teamMemberSchema>
export type TeamMemberForm = Pick<TeamMember, 'email'>
