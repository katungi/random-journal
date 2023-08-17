import reactRefresh from '@vitejs/plugin-react-refresh';
// https://vitejs.dev/config/
// export default defineConfig({ plugins: [reactRefresh()]})

import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
  return {
    define: {
      'process.env': process.env,
      ENV_KEY: process.env.VITE_REACT_URL,
    },
    plugins: [reactRefresh()],
  };
});
