import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// Restricts where the built app may load code, styles, images and data from.
// Only applied to production builds: the dev server needs inline scripts and
// a websocket for hot reload. Inline styles are allowed because react-slick
// and react-loading-skeleton set them at runtime.
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: https://image.tmdb.org https://secure.gravatar.com",
  "connect-src 'self' https://api.themoviedb.org https://acb-api.algoritmika.org",
  "frame-src https://www.youtube-nocookie.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

const cspPlugin = (): Plugin => ({
  name: 'inject-csp',
  apply: 'build',
  transformIndexHtml: () => [
    {
      tag: 'meta',
      attrs: { 'http-equiv': 'Content-Security-Policy', content: CONTENT_SECURITY_POLICY },
      injectTo: 'head-prepend',
    },
  ],
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), cspPlugin()],
})
