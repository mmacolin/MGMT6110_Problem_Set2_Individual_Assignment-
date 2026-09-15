import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

const apiDevPlugin = (): Plugin => ({
  name: 'api-dev-middleware',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (!req.url?.startsWith('/api/')) {
        return next();
      }
      try {
        const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        if (url.pathname === '/api/country-list') {
          const { default: handler } = await import('./api/country-list.js');
          return await handler(req, res);
        }
        if (url.pathname === '/api/countries') {
          const { default: handler } = await import('./api/countries.js');
          return await handler(req, res);
        }
        if (url.pathname === '/api/health') {
          const { default: handler } = await import('./api/health.js');
          return await handler(req, res);
        }
        next();
      } catch (err) {
        console.error('API middleware error:', err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Internal server error', code: 'INTERNAL_ERROR' }));
      }
    });
  },
});

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiDevPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
