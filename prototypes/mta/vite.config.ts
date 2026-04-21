import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/AppDev-UX-Prototypes/mta/',
  optimizeDeps: {
    include: ['@patternfly/quickstarts', 'marked'],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
})
