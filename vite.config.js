import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
        privacidad: resolve(__dirname, 'politica-privacidad.html'),
        tratamientoDatos: resolve(__dirname, 'tratamiento-datos.html'),
        terminosCondiciones: resolve(__dirname, 'terminos-condiciones.html'),
        politicaCookies: resolve(__dirname, 'politica-cookies.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        terminosServicio: resolve(__dirname, 'terminos-servicio.html')
      }
    }
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
});
