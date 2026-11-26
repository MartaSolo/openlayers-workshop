import {viteStaticCopy as copy} from 'vite-plugin-static-copy';
import {defineConfig} from 'vite';
import {resolve} from 'node:path';

export default defineConfig({
  plugins: [
    copy({
      targets: [{src: 'data/*', dest: 'data'}],
    }),
  ],
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        vectorData: resolve(__dirname, 'exercises/vector-data/index.html'),
        mobile: resolve(__dirname, 'exercises/mobile/index.html'),
      },
    },
    sourcemap: true,
  },
  server: {
    allowedHosts: ['silent-papayas-live.loca.lt'],
  },
});
