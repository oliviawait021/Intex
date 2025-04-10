import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    headers: {
      'Content-Security-Policy':
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://apis.google.com; " +
        "style-src 'self' 'unsafe-inline' fonts.googleapis.com; " +
        "img-src 'self' data: https://movie-posters8.s3.us-east-1.amazonaws.com; " +
        'frame-src https://accounts.google.com; ' +
        "frame-ancestors 'none'; " +
        "font-src 'self' fonts.gstatic.com data:; " +
        "connect-src 'self' https://localhost:5000 https://oauth2.googleapis.com wss://localhost:3000; " +
        "object-src 'none'; " +
        "base-uri 'self'; " +
        "form-action 'self';",
    },
    https: {
      key: fs.readFileSync('./localhost-key.pem'),
      cert: fs.readFileSync('./localhost.pem'),
    },
  },
});
