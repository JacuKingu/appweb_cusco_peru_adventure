import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';  // Importa path para manejar rutas

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './20240912_COD_src/20240912_COD_components'),
      '@pages': path.resolve(__dirname, './20240912_COD_src/20240912_COD_pages'),
      '@services': path.resolve(__dirname, './20240912_COD_src/20240912_COD_services'),
      '@routes': path.resolve(__dirname, './20240912_COD_src/20240912_COD_routes'),
      '@context': path.resolve(__dirname,'./20240912_COD_src/20240912_COD_context'),
      '@layouts': path.resolve(__dirname,'./20240912_COD_src/20240912_COD_layouts'),
      '@hooks': path.resolve(__dirname,'./20240912_COD_src/20240912_COD_hooks'),
    },
  },
});
