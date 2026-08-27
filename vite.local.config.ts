import tailwindcss from '@tailwindcss/postcss';
import vinext from 'vinext';
import { defineConfig } from 'vite';

// Browser-preview fallback for Windows hosts where workerd cannot start.
export default defineConfig({
  css: { postcss: { plugins: [tailwindcss()] } },
  plugins: [vinext()],
});
