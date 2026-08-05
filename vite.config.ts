import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'

// The Cardano serialisation layer behind @lucid-evolution/lucid ships as
// WebAssembly and initialises with a top-level await, so both plugins are
// needed for it to bundle at all.
export default defineConfig({
  plugins: [react(), wasm(), topLevelAwait()],
  build: {
    target: 'es2022',
  },
})
