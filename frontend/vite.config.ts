import reactRefresh from '@vitejs/plugin-react-refresh';
// https://vitejs.dev/config/
// export default defineConfig({ plugins: [reactRefresh()]})

import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.VITE_REACT_URL': JSON.stringify(env.VITE_REACT_URL),
    },
    plugins: [reactRefresh()],
  };
});
