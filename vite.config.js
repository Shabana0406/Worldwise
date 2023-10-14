import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: 'http://localhost:8000/cities', // replace with the IP address of the Homestead machine
    https: false,
    cors: false,
    hmr: {
        host: 'http://localhost:8000/cities', // replace with the IP address of the Homestead machine
    }
},

  base: "/Worldwise/",
  plugins: [react(), eslint()],
});

// export default defineConfig({
//   server: {
//     watch: {
//       usePolling: true,
//     },
//   },

//   plugins: [
//     react({
//       include: "**/*.jsx",
//     }),

//     eslint(),
//   ],
// });
