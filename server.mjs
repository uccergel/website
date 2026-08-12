import { serve } from 'srvx'
import { serveStatic } from 'srvx/static'
import { fileURLToPath } from 'node:url'

import handler from './dist/server/server.js'

const clientDir = fileURLToPath(new URL('./dist/client', import.meta.url))

const port = Number(process.env.PORT) || 3000
const hostname = process.env.HOST || '0.0.0.0'

serve({
  port,
  hostname,
  // Önce statik client varlıklarını (JS/CSS/görseller) servis et,
  // eşleşme yoksa TanStack Start SSR fetch handler'ına düş.
  middleware: [serveStatic({ dir: clientDir })],
  fetch: handler.fetch
})

console.log(`Server listening on http://${hostname}:${port}`)
