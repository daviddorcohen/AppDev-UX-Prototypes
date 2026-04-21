import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: Update the base path to match your prototype name
// e.g. for prototype "my-app", set base to '/AppDev-UX-Prototypes/my-app/'
export default defineConfig({
  plugins: [react()],
  base: '/AppDev-UX-Prototypes/PROTOTYPE_NAME/',
})
