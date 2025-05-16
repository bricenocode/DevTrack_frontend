import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './index.css'
import Router from './router'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client = {queryClient}>
      <Router />
      <ReactQueryDevtools/>
    </QueryClientProvider>
  </StrictMode>,
)




new file:   .env
new file:   .gitignore
new file:   README.md
new file:   eslint.config.js
new file:   index.html
new file:   package-lock.json
new file:   package.json
new file:   postcss.config.js

new file:   public/404.png
new file:   public/logo.svg

new file:   src/components/ErrorMessage.tsx
new file:   src/components/Logo.tsx
new file:   src/components/NavMenu.tsx

new file:   src/components/auth/NewPasswordForm.tsx
new file:   src/components/auth/NewPasswordToken.tsx

new file:   src/components/notes/AddNoteForm.tsx
new file:   src/components/notes/NoteDetail.tsx
new file:   src/components/notes/NotesPanel.tsx

new file:   src/components/profile/ProfileForm.tsx
new file:   src/components/profile/Tabs.tsx

new file:   src/components/projects/DeleteProjectModal.tsx
new file:   src/components/projects/EditProyectoForm.tsx
new file:   src/components/projects/ProjectForm.tsx

new file:   src/components/tasks/AddTaskModal.tsx
new file:   src/components/tasks/DropTask.tsx
new file:   src/components/tasks/EditTaskData.tsx
new file:   src/components/tasks/EditTaskModal.tsx
new file:   src/components/tasks/TaskCard.tsx
new file:   src/components/tasks/TaskForm.tsx
new file:   src/components/tasks/TaskList.tsx
new file:   src/components/tasks/TaskModalDetails.tsx

new file:   src/components/team/AddMemberForm.tsx
new file:   src/components/team/AddMemberModal.tsx
new file:   src/components/team/SearchResult.tsx

new file:   src/hooks/useAuth.ts
new file:   src/index.css
new file:   src/layouts/AppLayout.tsx
new file:   src/layouts/AuthLayout.tsx
new file:   src/layouts/ProfileLayout.tsx
new file:   src/lib/axios.ts
new file:   src/locales/es.ts
new file:   src/main.tsx
new file:   src/router.tsx
new file:   src/services/authAPI.ts
new file:   src/services/noteAPI.ts
new file:   src/services/profileAPI.ts
new file:   src/services/projectAPI.ts
new file:   src/services/taskAPI.ts
new file:   src/services/teamAPI.ts
new file:   src/types/index.ts
new file:   src/utils/polices.ts
new file:   src/utils/utils.ts
new file:   src/views/404/NotFound.tsx
new file:   src/views/DashboardView.tsx
new file:   src/views/auth/ConfirmAccountView.tsx
new file:   src/views/auth/ForgotPasswordView.tsx
new file:   src/views/auth/LoginView.tsx
new file:   src/views/auth/NewPasswordView.tsx
new file:   src/views/auth/RegisterView.tsx
new file:   src/views/auth/RequestNewCodeView.tsx
new file:   src/views/profile/ChangePasswordView.tsx
new file:   src/views/profile/ProfileView.tsx
new file:   src/views/projects/CreateProjectView.tsx
new file:   src/views/projects/EditProjectView.tsx
new file:   src/views/projects/ProjectDetailsView.tsx
new file:   src/views/projects/ProjectTeamView.tsx
new file:   src/vite-env.d.ts
new file:   tailwind.config.js
new file:   tsconfig.app.json
new file:   tsconfig.json
new file:   tsconfig.node.json
new file:   vercel.json
new file:   vite.config.ts
