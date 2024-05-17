import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/code-server-04ad78a4-55ce-441c-9a37-f8b250706be7/proxy/5173/',
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: false,
    hmr: {
      protocol: 'wss',
      host: 'projectsinabro.store',
      clientPort: 443,
    }
  }
})