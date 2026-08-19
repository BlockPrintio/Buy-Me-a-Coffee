import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import wasm from 'vite-plugin-wasm'

// The Cardano serialisation layer behind @lucid-evolution/lucid ships as
// WebAssembly and initialises with a top-level await.
//
// No TLA transform plugin is needed here: the build targets es2022, where
// top-level await is native. `vite-plugin-top-level-await` used to do that
// transform, but it accepts any `@swc/core@^1.x`, and swc 1.16 changed its AST
// printer — so any install that resolved past the lockfile failed the build
// with "missing field `type`". Targeting a runtime that has the feature is
// simpler, and drops a native binary from the dependency tree.
export default defineConfig({
  plugins: [react(), wasm()],
  build: {
    target: 'es2022',
  },
  // Dev prebundling has to agree with the build target, or the WASM module's
  // top-level await fails under `vite dev` only.
  optimizeDeps: {
    esbuildOptions: { target: 'es2022' },
  },
})
