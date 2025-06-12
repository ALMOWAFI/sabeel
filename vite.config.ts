import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  server: {
    port: 5173,
    host: true,
    watch: {
      ignored: [
        '**/sabeel-tech-awakening/**',
        '**/webfrontend/**',
        '**/hack2/**',
        '**/sabeel_doc/**',
        '**/sabeel-clean/**',
        '**/mcp*/**'
      ]
    }
  },
  preview: {
    port: 4173,
    host: true
  },
  optimizeDeps: {
    exclude: [
      '@tensorflow/tfjs-backend-wasm',
      '@tensorflow/tfjs-automl', 
      '@tensorflow/tfjs-tflite',
      '@peertube/peertube-models',
      '@peertube/player',
      '@peertube/peertube-core-utils',
      '@root-helpers/translations-manager',
      'jschannel',
      'color-bits',
      'babel-polyfill',
      'regenerator-runtime/runtime'
    ]
  }
}) 