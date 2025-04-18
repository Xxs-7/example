import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    base: mode === 'production' ? '/react-example/' : '/',
    // 其他配置
    plugins: [react()]
  }
})
