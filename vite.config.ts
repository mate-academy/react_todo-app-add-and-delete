import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/react_todo-app-add-and-delete/',
  plugins: [react()],
})
