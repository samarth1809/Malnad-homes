import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  // Using '.' instead of process.cwd() to avoid TypeScript type errors if Node types are missing.
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // Securely map the process.env.API_KEY used in your code to the environment variable provided by Vercel
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    },
    build: {
      outDir: 'dist',
      sourcemap: false
    }
  };
});