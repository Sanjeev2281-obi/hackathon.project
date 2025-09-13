import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react() ,tailwindcss()],
  server: {
    allowedHosts: [
      "5173-sanjeev2281-hackathonpr-5qval0znw2d.ws-us121.gitpod.io", // your Gitpod host
    ],
    host: "0.0.0.0", // allows external access
    port: 5173
  },
});
