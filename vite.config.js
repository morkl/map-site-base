import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  build: {
    minify: false,
    sourceMap: true,
  },
  plugins: [react()],
});
