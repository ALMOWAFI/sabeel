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
        '**/mcp*/**',
        '**/node_modules/**'
      ]
    }
  },
  preview: {
    port: 4173,
    host: true
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@supabase/supabase-js'
    ],
    exclude: [
      // TensorFlow.js dependencies
      '@tensorflow/tfjs-backend-wasm',
      '@tensorflow/tfjs-automl', 
      '@tensorflow/tfjs-tflite',
      'babel-polyfill',
      'regenerator-runtime/runtime',
      // PeerTube dependencies
      '@peertube/peertube-models',
      '@peertube/player',
      '@peertube/peertube-core-utils',
      '@root-helpers/translations-manager',
      'jschannel',
      'color-bits',
      // RxJS and Socket.io dependencies
      'rxjs',
      'rxjs/operators',
      'socket.io-client'
    ],
    entries: [
      'src/main.tsx'
    ]
  },
  esbuild: {
    logOverride: { 
      'this-is-undefined-in-esm': 'silent' 
    }
  }
}) 